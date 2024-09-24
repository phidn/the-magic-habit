package action

import (
	"mazic/pocketbase/models"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Action)(nil)

type Action struct {
	models.BaseModel

	Name     string `db:"name" json:"name"`
	Code     string `db:"code" json:"code"`
	IsActive bool   `db:"is_active" json:"is_active"`
}

func (action *Action) TableName() string {
	return "sys_action"
}

func (action *Action) ParseRecord(record *models.Record) error {

	record.Set("name", action.Name)
	record.Set("code", action.Code)
	record.Set("is_active", action.IsActive)

	return nil
}

func (action *Action) Validate() error {
	return validation.ValidateStruct(action,
		validation.Field(&action.Name, validation.Required),
		validation.Field(&action.Code, validation.Required),
		validation.Field(&action.IsActive, validation.In(true, false)),
	)
}
