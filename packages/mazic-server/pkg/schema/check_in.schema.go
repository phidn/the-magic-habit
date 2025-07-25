package schema

import (
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*CheckIn)(nil)

type CheckIn struct {
	models.BaseModel

	Date    types.DateTime `db:"date" json:"date"`
	Journal string         `db:"journal" json:"journal"`
	HabitId string         `db:"habit_id" json:"habit_id"`
	Value   float64        `db:"value" json:"value"`
	IsDone  *bool          `db:"is_done" json:"is_done"`

	Level    int     `db:"level" json:"level"`
	Count    float64 `json:"count"`
	BarValue float64 `json:"bar_value"`

	CriterionId string `db:"criterion_id" json:"criterion_id"`

	CriterionValues []*CriterionValue `db:"-" json:"criterion_values"`
}

func (c *CheckIn) TableName() string {
	return "mz_check_in"
}

func (c *CheckIn) Validate() error {
	return validation.ValidateStruct(c,
		validation.Field(&c.Date, validation.Required),
		validation.Field(&c.HabitId, validation.Required),
	)
}

func (c *CheckIn) ParseRecord(record *models.Record) error {

	record.Set("id", c.Id)
	record.Set("habit_id", c.HabitId)
	record.Set("date", c.Date)
	record.Set("journal", c.Journal)
	record.Set("value", c.Value)
	record.Set("is_done", c.IsDone)

	return nil
}

type CriterionValue struct {
	models.BaseModel

	CriterionId string  `db:"criterion_id" json:"criterion_id"`
	Value       float64 `db:"value" json:"value"`
}
