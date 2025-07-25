package resource

import (
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Resource)(nil)

type Resource struct {
	models.BaseModel

	Name     string `db:"name" json:"name"`
	Code     string `db:"code" json:"code"`
	IsActive bool   `db:"is_active" json:"is_active"`

	Actions types.JsonArray[any] `db:"actions" json:"actions"`
}

func (m *Resource) TableName() string {
	return "sys_resource"
}

func (resource *Resource) ParseRecord(record *models.Record) error {

	record.Set("name", resource.Name)
	record.Set("code", resource.Code)
	record.Set("is_active", resource.IsActive)
	record.Set("actions", resource.Actions)

	return nil
}

func (resource *Resource) Validate() error {
	return validation.ValidateStruct(resource,
		validation.Field(&resource.Name, validation.Required),
		validation.Field(&resource.Code, validation.Required),
		validation.Field(&resource.IsActive, validation.In(true, false)),
	)
}
