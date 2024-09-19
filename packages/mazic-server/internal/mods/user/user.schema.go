package user

import (
	"encoding/json"
	"mazic/pocketbase/models"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	models.BaseModel

	Email        string          `db:"email" json:"email"`
	PasswordHash string          `db:"password_hash" json:"-"`
	Avatar       string          `db:"avatar" json:"avatar"`
	Roles        json.RawMessage `db:"roles" json:"roles"`
}

func (user *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	return err == nil
}
