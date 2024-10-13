package auth

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"github.com/golangthang/mazic-habit/config"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"
	"golang.org/x/crypto/bcrypt"
)

type LoginForm struct {
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

var _ models.Model = (*UserRegister)(nil)

type UserRegister struct {
	models.BaseModel

	FirstName    string               `db:"first_name" json:"first_name"`
	LastName     string               `db:"last_name" json:"last_name"`
	Email        string               `db:"email" json:"email"`
	Password     string               `db:"-" json:"password"`
	PasswordHash string               `db:"password_hash" json:"-"`
	Roles        types.JsonArray[any] `db:"roles" json:"roles"`
}

func (m *UserRegister) TableName() string {
	return "sys_user"
}

func (m *UserRegister) Validate() error {
	return validation.ValidateStruct(m,
		validation.Field(&m.FirstName, validation.Required),
		validation.Field(&m.LastName, validation.Required),
		validation.Field(&m.Email, validation.Required, is.Email),
	)
}

func (user *UserRegister) SetPasswordHash() error {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), config.Config.BcryptCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hash)
	return nil
}

func (user *UserRegister) ParseRecord(record *models.Record) error {
	if err := user.SetPasswordHash(); err != nil {
		return err
	}
	record.Set("first_name", user.FirstName)
	record.Set("last_name", user.LastName)
	record.Set("email", user.Email)
	record.Set("password_hash", user.PasswordHash)
	record.Set("verified", true)

	userRole := []string{config.UserRoleId}
	record.Set("roles", userRole)

	return nil
}
