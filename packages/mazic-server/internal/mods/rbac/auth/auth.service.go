package auth

import (
	"context"
	"errors"
	"mazic/server/config"
	"mazic/server/internal/mods/rbac/permission"
	"mazic/server/internal/mods/rbac/user"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/token"
	"mazic/server/pkg/utils"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/pocketbase/dbx"
)

type AuthService interface {
	Login(ctx context.Context, email, password string) (*Tokens, *user.User, error)
	GetMe(ctx context.Context, userId string) (*user.User, error)
}

type authService struct {
	Entry entry.Entry
}

func NewAuthService(entry entry.Entry) AuthService {
	return &authService{
		Entry: entry,
	}
}

func (service *authService) Login(ctx context.Context, email, password string) (*Tokens, *user.User, error) {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, password_hash, roles FROM sys_user WHERE email = {:email}`).
		WithContext(ctx).
		Bind(dbx.Params{"email": email}).
		One(&user)
	if err != nil {
		return nil, nil, err
	}
	if !user.CheckPassword(password) {
		return nil, nil, errors.New("invalid login credentials")
	}

	now := time.Now()

	accessToken, err := token.CreateToken(config.Config.AccessTokenPrivateKey, jwt.MapClaims{
		"sub":      user.Id,
		"token_id": utils.RandomString(),
		"roles":    utils.ToInterfaceSlice(user.Roles),
		"exp":      now.Add(config.Config.AccessTokenExpiresIn).Unix(),
		"iat":      now.Unix(),
		"nbf":      now.Unix(),
	})
	if err != nil {
		return nil, nil, errors.New("failed to create access token")
	}

	refreshToken, err := token.CreateToken(config.Config.RefreshTokenPrivateKey, jwt.MapClaims{
		"sub":      user.Id,
		"token_id": utils.RandomString(),
		"roles":    utils.ToInterfaceSlice(user.Roles),
		"exp":      now.Add(config.Config.RefreshTokenExpiresIn).Unix(),
		"iat":      now.Unix(),
		"nbf":      now.Unix(),
	})
	if err != nil {
		return nil, nil, errors.New("failed to create access token")
	}

	currentUser, err := service.GetMe(ctx, user.Id)
	if err != nil {
		return nil, nil, err
	}

	return &Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, currentUser, nil
}

func (service *authService) GetMe(ctx context.Context, userId string) (*user.User, error) {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, first_name, last_name, email, avatar, bio, roles FROM sys_user WHERE id = {:id}`).
		WithContext(ctx).
		Bind(dbx.Params{"id": userId}).
		One(&user)
	if err != nil {
		return nil, err
	}

	var permissions []permission.Permission
	err = service.Entry.Dao().DB().
		Select("p.id", "p.name", "p.code").
		From("sys_role_permission rp").
		LeftJoin("sys_permission p", dbx.NewExp("rp.permission_id = p.id")).
		Where(dbx.In("role_id", user.Roles...)).
		AndWhere(dbx.NewExp("p.code IS NOT NULL")).
		All(&permissions)

	if err != nil {
		return nil, err
	}

	user.Permissions = permissions
	return user, nil
}
