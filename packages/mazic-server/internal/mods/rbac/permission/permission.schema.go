package permission

import (
	"mazic/pocketbase/models"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Permission)(nil)

type Permission struct {
	models.BaseModel

	Name     string `db:"name" json:"name"`
	Code     string `db:"code" json:"code"`
	IsActive bool   `db:"is_active" json:"is_active"`

	ResourceId string `db:"resource_id" json:"resource_id"`
	ActionId   string `db:"action_id" json:"action_id"`
}

func (permission *Permission) TableName() string {
	return "sys_permission"
}

func (permission *Permission) ParseRecord(record *models.Record) error {

	record.Set("name", permission.Name)
	record.Set("code", permission.Code)
	record.Set("is_active", permission.IsActive)

	record.Set("resource_id", permission.ResourceId)
	record.Set("action_id", permission.ActionId)

	return nil
}

func (permission *Permission) Validate() error {
	return validation.ValidateStruct(permission,
		validation.Field(&permission.Name, validation.Required),
		validation.Field(&permission.Code, validation.Required),
		validation.Field(&permission.IsActive, validation.In(true, false)),
	)
}
