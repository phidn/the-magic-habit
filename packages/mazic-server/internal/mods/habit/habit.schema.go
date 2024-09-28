package habit

import (
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	validation "github.com/go-ozzo/ozzo-validation/v4"
)

var _ models.Model = (*Habit)(nil)
var _ models.Model = (*HabitEntry)(nil)

type DaysOfWeek string

const (
	MONDAY    DaysOfWeek = "MONDAY"
	TUESDAY   DaysOfWeek = "TUESDAY"
	WEDNESDAY DaysOfWeek = "WEDNESDAY"
	THURSDAY  DaysOfWeek = "THURSDAY"
	FRIDAY    DaysOfWeek = "FRIDAY"
	SATURDAY  DaysOfWeek = "SATURDAY"
	SUNDAY    DaysOfWeek = "SUNDAY"
)

type Habit struct {
	models.BaseModel

	Title     string     `db:"title" json:"title"`
	Metric    string     `db:"metric" json:"metric"`
	WeekStart DaysOfWeek `db:"week_start" json:"week_start"`
	Color     string     `db:"color" json:"color"`
	Order     int        `db:"order" json:"order"`
	UserId    string     `db:"user_id" json:"user_id"`
	IsDeleted bool       `db:"is_deleted" json:"is_deleted"`
	IsPrivate bool       `db:"is_private" json:"is_private"`

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
	record.Set("user_id", habit.UserId)
	record.Set("is_deleted", habit.IsDeleted)
	record.Set("is_private", habit.IsPrivate)

	return nil
}

func (habit *Habit) Validate() error {
	return validation.ValidateStruct(habit)
}

type HabitEntry struct {
	models.BaseModel

	Date    types.DateTime `db:"date" json:"date"`
	Value   float64        `db:"value" json:"value"`
	Journal string         `db:"journal" json:"journal"`
	HabitId string         `db:"habit_id" json:"habit_id"`

	Level int     `db:"level" json:"level"`
	Count float64 `json:"count"`
}

func (habitEntry *HabitEntry) TableName() string {
	return "mz_habit_entries"
}
