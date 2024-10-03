package habit

import (
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Habit)(nil)
var _ models.Model = (*HabitEntry)(nil)

type Habit struct {
	models.BaseModel

	Title       string `db:"title" json:"title"`
	Metric      string `db:"metric" json:"metric"`
	WeekStart   string `db:"week_start" json:"week_start"`
	Color       string `db:"color" json:"color"`
	Order       int64  `db:"order" json:"order"`
	CheckInType string `db:"check_in_type" json:"check_in_type"`
	UserId      string `db:"user_id" json:"user_id"`
	IsDeleted   bool   `db:"is_deleted" json:"is_deleted"`
	IsPrivate   bool   `db:"is_private" json:"is_private"`

	Entries []*HabitEntry `json:"entries"`
}

func (habit *Habit) TableName() string {
	return "mz_habits"
}

func (habit *Habit) ParseRecord(record *models.Record) error {

	record.Set("title", habit.Title)
	record.Set("metric", habit.Metric)
	record.Set("week_start", habit.WeekStart)
	record.Set("color", habit.Color)
	record.Set("order", habit.Order)
	record.Set("check_in_type", habit.CheckInType)
	record.Set("user_id", habit.UserId)
	record.Set("is_deleted", habit.IsDeleted)
	record.Set("is_private", habit.IsPrivate)

	return nil
}

func (habit *Habit) Validate() error {
	return validation.ValidateStruct(habit,
		validation.Field(&habit.Title, validation.Required),
		validation.Field(&habit.Metric, validation.When(habit.CheckInType == "NUMBER", validation.Required).Else(validation.Empty)),
		validation.Field(&habit.WeekStart, validation.In("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY")),
		validation.Field(&habit.Color, validation.Required),
		validation.Field(&habit.CheckInType, validation.In("NUMBER", "CHECKBOX")),
		validation.Field(&habit.UserId, validation.Required),
	)
}

type HabitEntry struct {
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

func (habitEntry *HabitEntry) TableName() string {
	return "mz_habit_entries"
}

func (habitEntry *HabitEntry) Validate() error {
	return validation.ValidateStruct(habitEntry,
		validation.Field(&habitEntry.Date, validation.Required),
		validation.Field(&habitEntry.Value, validation.When(habitEntry.IsDone == nil, validation.Required).Else(validation.Empty)),
		validation.Field(&habitEntry.IsDone, validation.When(habitEntry.Value == 0, validation.Required)),
		validation.Field(&habitEntry.HabitId, validation.Required),
	)
}

func (habitEntry *HabitEntry) ParseRecord(record *models.Record) error {

	record.Set("id", habitEntry.Id)
	record.Set("habit_id", habitEntry.HabitId)
	record.Set("date", habitEntry.Date)
	record.Set("journal", habitEntry.Journal)
	record.Set("value", habitEntry.Value)
	record.Set("is_done", habitEntry.IsDone)

	return nil
}
