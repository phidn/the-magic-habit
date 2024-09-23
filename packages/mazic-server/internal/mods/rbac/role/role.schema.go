package role

import (
	"mazic/pocketbase/models"
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
