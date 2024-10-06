package check_in

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
}

func (checkInEntry *CheckIn) TableName() string {
	return "mz_check_in"
}

func (checkInEntry *CheckIn) Validate() error {
	return validation.ValidateStruct(checkInEntry,
		validation.Field(&checkInEntry.Date, validation.Required),
		validation.Field(&checkInEntry.Value, validation.When(checkInEntry.IsDone == nil, validation.Required).Else(validation.Empty)),
		validation.Field(&checkInEntry.IsDone, validation.When(checkInEntry.Value == 0, validation.Required)),
		validation.Field(&checkInEntry.HabitId, validation.Required),
	)
}

func (checkInEntry *CheckIn) ParseRecord(record *models.Record) error {

	record.Set("id", checkInEntry.Id)
	record.Set("habit_id", checkInEntry.HabitId)
	record.Set("date", checkInEntry.Date)
	record.Set("journal", checkInEntry.Journal)
	record.Set("value", checkInEntry.Value)
	record.Set("is_done", checkInEntry.IsDone)

	return nil
}
