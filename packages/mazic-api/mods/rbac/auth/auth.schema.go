package auth

import (
	schema_common "mazic/mazicapi/common/schema"
	"mazic/mazicapi/mods/rbac/role"
	"mazic/mazicapi/pkg/errors"
	util "mazic/mazicapi/util"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type AuthRoleSchema struct {
	Id     string `json:"id"`
	AuthId string `json:"user_id"`
	RoleId string `json:"role_id"`

	Role role.RoleSchema `json:"role" gorm:"foreignKey:RoleId;references:Id"`
	Auth AuthSchema      `json:"user" gorm:"foreignKey:AuthId;references:Id"`
}

func (user AuthRoleSchema) TableName() string {
	return "sys_user_role"
}

type AuthParamsSchema struct {
	schema_common.Filter
}

// #region: AuthSchema
type AuthSchema struct {
	schema_common.BaseFields

	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Avatar    string `json:"avatar"`

	AuthRoleIds []string         `json:"user_role_ids" gorm:"-"`
	AuthRoles   []AuthRoleSchema `json:"user_roles" gorm:"foreignKey:AuthId;references:Id"`
}

func (user AuthSchema) TableName() string {
	return "sys_user"
}

func (user AuthSchema) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}

func (user *AuthSchema) FillAuthRoles() error {
	userRoles := []AuthRoleSchema{}
	for _, roleId := range user.AuthRoleIds {
		userRoles = append(userRoles, AuthRoleSchema{
			Id:     util.NewUuid(),
			AuthId: user.Id,
			RoleId: roleId,
		})
	}
	user.AuthRoles = userRoles
	return nil
}
func (user *AuthSchema) FillPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.BadRequest("", "internal error: unable to create user")
	}
	user.Password = string(hashedPassword)
	return nil
}

func (user AuthSchema) Validate() error {
	if user.Email != "" && validator.New().Var(user.Email, "email") != nil {
		return errors.BadRequest("", "Invalid email address")
	}
	return nil
}

// #endregion: AuthSchema

// #region: AuthRequestSchema
type AuthRequestSchema struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	IsActive  bool   `json:"is_active"`
}

func (user AuthRequestSchema) Validate() error {
	if user.Email != "" && validator.New().Var(user.Email, "email") != nil {
		return errors.BadRequest("", "Invalid email address")
	}
	return nil
}

// #endregion: AuthRequestSchema

type LoginRequestSchema struct {
	Password string `json:"password"`
	Email    string `json:"email" validate:"required,email"`
}

type TokensSchema struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
