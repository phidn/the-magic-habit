package user

import (
	"mazic/pocketbase/models"
	"mazic/pocketbase/tools/types"
	"mazic/server/config"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"golang.org/x/crypto/bcrypt"
)

var _ models.Model = (*User)(nil)

type User struct {
	models.BaseModel

	FirstName    string `db:"first_name" json:"first_name"`
	LastName     string `db:"last_name" json:"last_name"`
	Email        string `db:"email" json:"email"`
	Username     string `db:"username" json:"username"`
	Password     string `db:"-" json:"password"`
	PasswordHash string `db:"password_hash" json:"-"`
	Avatar       string `db:"avatar" json:"avatar"`
	Verified     bool   `db:"verified" json:"verified"`

	Roles types.JsonArray[any] `db:"roles" json:"roles"`
}

func (m *User) TableName() string {
	return "sys_user"
}

func (user *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	return err == nil
}

func (user *User) SetPasswordHash() error {
	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), config.Config.BcryptCost)
	if err != nil {
		return err
	}

	user.PasswordHash = string(hash)
	return nil
}

func (user *User) ParseRecord(record *models.Record) error {
	if user.Password != "" {
		if err := user.SetPasswordHash(); err != nil {
			return err
		}
	}

	record.Set("first_name", user.FirstName)
	record.Set("last_name", user.LastName)
	record.Set("email", user.Email)
	if user.PasswordHash != "" {
		record.Set("password_hash", user.PasswordHash)
	}
	record.Set("username", user.Username)
	record.Set("avatar", user.Avatar)
	record.Set("verified", user.Verified)
	record.Set("roles", user.Roles)

	return nil
}

func (user *User) Validate() error {
	return validation.ValidateStruct(user,
		validation.Field(&user.FirstName, validation.Required),
		validation.Field(&user.LastName, validation.Required),
		validation.Field(&user.Email, validation.Required, is.Email),
		validation.Field(&user.Verified, validation.Required, validation.In(true, false)),
	)
}
