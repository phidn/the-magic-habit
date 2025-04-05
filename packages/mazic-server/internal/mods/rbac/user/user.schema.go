package user

import (
	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/permission"

	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
	"golang.org/x/crypto/bcrypt"
)

var _ models.Model = (*User)(nil)

type UserSetting struct {
	Timezone         string `json:"timezone"`
	HabitCols        int    `json:"habit_cols"`
	HabitOrders      string `json:"habit_orders"`
	TelegramTime     string `json:"telegram_time"`
	TelegramChatId   string `json:"telegram_chat_id"`
	TelegramBotToken string `json:"telegram_bot_token"`
}

func (m *UserSetting) TableName() string {
	return "sys_user_setting"
}

type User struct {
	models.BaseModel

	FirstName        string  `db:"first_name" json:"first_name"`
	LastName         *string `db:"last_name" json:"last_name"`
	Email            string  `db:"email" json:"email"`
	Password         string  `db:"-" json:"password"`
	PasswordHash     string  `db:"password_hash" json:"-"`
	Avatar           string  `db:"avatar" json:"avatar"`
	Bio              string  `db:"bio" json:"bio"`
	Verified         bool    `db:"verified" json:"verified"`
	VerificationCode string  `db:"verification_code" json:"verification_code"`

	Roles       types.JsonArray[any]    `db:"roles" json:"roles"`
	Permissions []permission.Permission `db:"-" json:"permissions"`
	Setting     UserSetting             `db:"-" json:"setting"`
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
	record.Set("avatar", user.Avatar)
	record.Set("bio", user.Bio)
	record.Set("verified", user.Verified)
	record.Set("roles", user.Roles)

	return nil
}

func (user *User) Validate() error {
	return validation.ValidateStruct(user,
		validation.Field(&user.FirstName, validation.Required),
		validation.Field(&user.Email, validation.Required, is.Email),
		validation.Field(&user.Verified, validation.Required, validation.In(true, false)),
	)
}

func (user *User) ValidateProfile() error {
	return validation.ValidateStruct(user,
		validation.Field(&user.FirstName, validation.Required),
	)
}

func (user *User) ParseProfile(record *models.Record) error {
	record.Set("first_name", user.FirstName)
	record.Set("last_name", user.LastName)
	record.Set("avatar", user.Avatar)
	record.Set("bio", user.Bio)

	return nil
}
