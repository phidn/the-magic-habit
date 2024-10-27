package auth

import (
	"bytes"
	"context"
	"errors"
	"html/template"
	"log"
	"time"

	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/permission"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/user"
	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/infrastructure"
	"github.com/golangthang/mazic-habit/pkg/token"
	"github.com/golangthang/mazic-habit/pkg/utils"

	"github.com/golang-jwt/jwt/v4"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/models"
)

type AuthService interface {
	Login(ctx context.Context, email, password string) (*Tokens, *user.User, error)
	Register(ctx context.Context, user *UserRegister) (*Tokens, *user.User, error)
	RegisterWithVerify(ctx context.Context, user *UserRegister) (*models.Record, error)
	GetMe(ctx context.Context, userId string) (*user.User, error)
	VerifyCode(ctx context.Context, code string) (string, error)
	ForgotPassword(ctx context.Context, email string) error
	RefreshToken(ctx context.Context, refreshToken string) (*Tokens, error)
	VerifyForgotCode(ctx context.Context, forgot_code string) (string, error)
	ResetPassword(ctx context.Context, code, password string) error
}

type authService struct {
	Entry  entry.Entry
	Mailer *infrastructure.Mailer
}

func NewAuthService(entry entry.Entry, mailer *infrastructure.Mailer) AuthService {
	return &authService{
		Entry:  entry,
		Mailer: mailer,
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
		return nil, nil, errors.New("failed to create refresh token")
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
	userData := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, first_name, last_name, email, avatar, bio, roles FROM sys_user WHERE id = {:id}`).
		WithContext(ctx).
		Bind(dbx.Params{"id": userId}).
		One(&userData)
	if err != nil {
		return nil, err
	}

	permissions := &[]permission.Permission{}
	err = service.Entry.Dao().DB().
		Select("p.id", "p.name", "p.code").
		From("sys_role_permission rp").
		LeftJoin("sys_permission p", dbx.NewExp("rp.permission_id = p.id")).
		Where(dbx.In("role_id", userData.Roles...)).
		AndWhere(dbx.NewExp("p.code IS NOT NULL")).
		All(permissions)

	if err != nil {
		return nil, err
	}

	userSetting := &user.UserSetting{}

	err = service.Entry.Dao().DB().
		Select("id", "habit_cols", "habit_orders").
		From(userSetting.TableName()).
		AndWhere(dbx.HashExp{"user_id": userId}).
		Limit(1).
		One(userSetting)

	if err == nil {
		userData.Setting = *userSetting
	}
	userData.Permissions = *permissions
	return userData, nil
}

func (service *authService) Register(ctx context.Context, user *UserRegister) (*Tokens, *user.User, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(UserRegister).TableName())
	if err != nil {
		return nil, nil, err
	}
	if err := user.SetPasswordHash(); err != nil {
		return nil, nil, err
	}

	record := models.NewRecord(collection)
	user.ParseRecord(record)

	if err = service.Entry.Dao().Save(record); err != nil {
		return nil, nil, err
	}

	return service.Login(ctx, user.Email, user.Password)
}

func (service *authService) RegisterWithVerify(ctx context.Context, user *UserRegister) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(UserRegister).TableName())
	if err != nil {
		return nil, err
	}
	if err := user.SetPasswordHash(); err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	user.ParseRecord(record)

	if err = service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}

	go func() {
		tmpl, err := template.ParseFiles("internal/mods/rbac/auth/verify_email.html")
		if err != nil {
			log.Printf("Failed to parse email template: %v", err)
		}
		data := struct {
			AppName   string
			ActionUrl string
		}{
			AppName:   config.Config.AppName,
			ActionUrl: config.Config.AppDomain + "/verify?code=" + record.GetString("verification_code"),
		}
		var body bytes.Buffer
		if err := tmpl.Execute(&body, data); err != nil {
			log.Printf("Failed to execute email template: %v", err)
		}

		err = service.Mailer.SendMail("Welcome to "+config.Config.AppName, body.String(), user.Email)
		if err != nil {
			log.Printf("Failed to send verification email to %s: %v", user.Email, err)
		} else {
			log.Printf("Verification email sent to %s", user.Email)
		}
	}()

	return record, nil
}

func (service *authService) VerifyCode(ctx context.Context, verification_code string) (string, error) {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, email, verification_code, verified FROM sys_user WHERE verification_code = {:verification_code}`).
		WithContext(ctx).
		Bind(dbx.Params{"verification_code": verification_code}).
		One(&user)
	if err != nil {
		return "", errors.New("Invalid verification code.")
	}

	if user.Verified {
		return "", errors.New("Email has been verified.")
	}

	_, err = service.Entry.Dao().DB().
		NewQuery(`UPDATE sys_user SET verified = TRUE, verification_code = "" WHERE id = {:id}`).
		WithContext(ctx).
		Bind(dbx.Params{"id": user.Id}).
		Execute()
	if err != nil {
		return "", err
	}

	return user.Email, nil
}

func (service *authService) ForgotPassword(ctx context.Context, email string) error {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, email, verified FROM sys_user WHERE email = {:email}`).
		WithContext(ctx).
		Bind(dbx.Params{"email": email}).
		One(&user)
	if err != nil {
		return errors.New("Email not found.")
	}

	forgotCode := utils.RandomString()
	_, err = service.Entry.Dao().DB().
		NewQuery(`UPDATE sys_user SET verified = TRUE, forgot_code = {:forgot_code} WHERE email = {:email}`).
		WithContext(ctx).
		Bind(dbx.Params{
			"email":       email,
			"forgot_code": forgotCode,
		}).
		Execute()
	if err != nil {
		return err
	}

	go func() {
		tmpl, err := template.ParseFiles("internal/mods/rbac/auth/forgot_password.html")
		if err != nil {
			log.Printf("Failed to parse email template: %v", err)
		}
		data := struct {
			AppName   string
			ActionUrl string
		}{
			AppName:   config.Config.AppName,
			ActionUrl: config.Config.AppDomain + "/reset-password?code=" + forgotCode,
		}
		var body bytes.Buffer
		if err := tmpl.Execute(&body, data); err != nil {
			log.Printf("Failed to execute email template: %v", err)
		}

		err = service.Mailer.SendMail("Reset your "+config.Config.AppName+" password", body.String(), user.Email)
		if err != nil {
			log.Printf("Failed to send reset password email to %s: %v", user.Email, err)
		} else {
			log.Printf("Reset password email sent to %s", user.Email)
		}
	}()

	return nil
}

func (service *authService) RefreshToken(ctx context.Context, refreshToken string) (*Tokens, error) {
	details, err := token.ValidateToken(refreshToken, config.Config.RefreshTokenPublicKey)
	if err != nil || details["sub"] == nil || details["sub"] == "" {
		return nil, errors.New("invalid or expired token")
	}

	userId := details["sub"].(string)

	user := new(user.User)
	err = service.Entry.Dao().DB().
		NewQuery(`SELECT id, roles FROM sys_user WHERE id = {:id}`).
		WithContext(ctx).
		Bind(dbx.Params{"id": userId}).
		One(&user)
	if err != nil {
		return nil, err
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
		return nil, errors.New("failed to create access token")
	}

	refreshToken, err = token.CreateToken(config.Config.RefreshTokenPrivateKey, jwt.MapClaims{
		"sub":      user.Id,
		"token_id": utils.RandomString(),
		"roles":    utils.ToInterfaceSlice(user.Roles),
		"exp":      now.Add(config.Config.RefreshTokenExpiresIn).Unix(),
		"iat":      now.Unix(),
		"nbf":      now.Unix(),
	})
	if err != nil {
		return nil, errors.New("failed to create access token")
	}

	return &Tokens{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil

}

func (service *authService) VerifyForgotCode(ctx context.Context, forgot_code string) (string, error) {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, email, forgot_code, verified FROM sys_user WHERE forgot_code = {:forgot_code}`).
		WithContext(ctx).
		Bind(dbx.Params{"forgot_code": forgot_code}).
		One(&user)
	if err != nil {
		return "", errors.New("Invalid forgot code.")
	}

	return user.Email, nil
}

func (service *authService) ResetPassword(ctx context.Context, forgot_code, password string) error {
	user := new(user.User)
	err := service.Entry.Dao().DB().
		NewQuery(`SELECT id, email, forgot_code, verified FROM sys_user WHERE forgot_code = {:forgot_code}`).
		WithContext(ctx).
		Bind(dbx.Params{"forgot_code": forgot_code}).
		One(&user)
	if err != nil {
		return errors.New("Invalid forgot code.")
	}

	user.Password = password
	user.SetPasswordHash()

	_, err = service.Entry.Dao().DB().
		NewQuery(`UPDATE sys_user SET forgot_code = "", password_hash = {:password_hash} WHERE forgot_code = {:forgot_code}`).
		WithContext(ctx).
		Bind(dbx.Params{
			"forgot_code":   forgot_code,
			"password_hash": user.PasswordHash,
		}).
		Execute()
	if err != nil {
		return err
	}

	return nil
}
