package user

import (
	schema_common "mazic/mazicapi/common/schema"
	"mazic/mazicapi/mods/rbac/role"
	"mazic/mazicapi/pkg/errors"
	util "mazic/mazicapi/util"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type UserRoleSchema struct {
	Id     string `json:"id"`
	UserId string `json:"user_id"`
	RoleId string `json:"role_id"`

	Role role.RoleSchema `json:"role" gorm:"foreignKey:RoleId;references:Id"`
	User UserSchema      `json:"user" gorm:"foreignKey:UserId;references:Id"`
}

func (user UserRoleSchema) TableName() string {
	return "sys_user_role"
}

type UserParamsSchema struct {
	schema_common.Filter
}

// #region: UserSchema
type UserSchema struct {
	schema_common.BaseFields

	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Avatar    string `json:"avatar"`

	UserRoleIds []string         `json:"user_role_ids" gorm:"-"`
	UserRoles   []UserRoleSchema `json:"user_roles" gorm:"foreignKey:UserId;references:Id"`
}

func (user UserSchema) TableName() string {
	return "sys_user"
}

func (user UserSchema) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}

func (user *UserSchema) FillUserRoles() error {
	userRoles := []UserRoleSchema{}
	for _, roleId := range user.UserRoleIds {
		userRoles = append(userRoles, UserRoleSchema{
			Id:     util.NewUuid(),
			UserId: user.Id,
			RoleId: roleId,
		})
	}
	user.UserRoles = userRoles
	return nil
}
func (user *UserSchema) FillPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.BadRequest("", "internal error: unable to create user")
	}
	user.Password = string(hashedPassword)
	return nil
}

func (user UserSchema) Validate() error {
	if user.Email != "" && validator.New().Var(user.Email, "email") != nil {
		return errors.BadRequest("", "Invalid email address")
	}
	return nil
}

// #endregion: UserSchema

// #region: UserRequestSchema
type UserRequestSchema struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	IsActive  bool   `json:"is_active"`
}

func (user UserRequestSchema) Validate() error {
	if user.Email != "" && validator.New().Var(user.Email, "email") != nil {
		return errors.BadRequest("", "Invalid email address")
	}
	return nil
}

// #endregion: UserRequestSchema

type LoginRequestSchema struct {
	Password string `json:"password"`
	Email    string `json:"email" validate:"required,email"`
}

type TokensSchema struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}
