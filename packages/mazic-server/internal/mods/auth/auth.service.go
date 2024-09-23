package auth

import (
	"context"
	"errors"
	"mazic/pocketbase/tools/security"
	"mazic/server/config"
	"mazic/server/internal/mods/rbac/user"
	"mazic/server/pkg/infrastructure"
	"mazic/server/pkg/token"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/pocketbase/dbx"
)

type AuthService struct {
	app *infrastructure.Pocket
}

func NewAuthService(app *infrastructure.Pocket) *AuthService {
	return &AuthService{app: app}
}

func (service *AuthService) Login(ctx context.Context, email, password string) (*Tokens, *user.User, error) {
	user := new(user.User)
	err := service.app.Dao().DB().
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
		"token_id": security.RandomSnowflakeId(),
		"roles":    []string{""},
		"exp":      now.Add(config.Config.AccessTokenExpiresIn).Unix(),
		"iat":      now.Unix(),
		"nbf":      now.Unix(),
	})
	if err != nil {
		return nil, nil, errors.New("failed to create access token")
	}

	refreshToken, err := token.CreateToken(config.Config.RefreshTokenPrivateKey, jwt.MapClaims{
		"sub":      user.Id,
		"token_id": security.RandomSnowflakeId(),
		"roles":    []string{""},
		"exp":      now.Add(config.Config.RefreshTokenExpiresIn).Unix(),
		"iat":      now.Unix(),
		"nbf":      now.Unix(),
	})
	if err != nil {
		return nil, nil, errors.New("failed to create access token")
	}

	return &Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, user, nil
}

func (service *AuthService) GetMe(ctx context.Context, userId string) (*user.User, error) {
	user := new(user.User)
	err := service.app.Dao().DB().
		NewQuery(`SELECT id, first_name, last_name, email, avatar FROM sys_user WHERE id = {:id}`).
		WithContext(ctx).
		Bind(dbx.Params{"id": userId}).
		One(&user)
	if err != nil {
		return nil, err
	}
	return user, nil
}
