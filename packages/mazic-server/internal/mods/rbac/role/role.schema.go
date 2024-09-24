package role

import (
	"mazic/pocketbase/models"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Role)(nil)

type Role struct {
	models.BaseModel

	Name        string `db:"name" json:"name"`
	Description string `db:"description" json:"description"`
	IsActive    bool   `db:"is_active" json:"is_active"`
}

func (m *Role) TableName() string {
	return "sys_role"
}

func (user *Role) ParseRecord(record *models.Record) error {

	record.Set("name", user.Name)
	record.Set("description", user.Description)
	record.Set("is_active", user.IsActive)

	return nil
}

func (role *Role) Validate() error {
	return validation.ValidateStruct(role,
		validation.Field(&role.Name, validation.Required),
		validation.Field(&role.IsActive, validation.In(true, false)),
	)
}
