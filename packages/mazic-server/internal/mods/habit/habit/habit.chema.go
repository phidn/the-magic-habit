package habit

import (
	"github.com/golangthang/mazic-habit/pkg/schema"
	"github.com/golangthang/mazic-habit/pkg/utils"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/pocketbase/models"
)

var _ models.Model = (*Habit)(nil)

type HabitMeta struct {
	Avg    float64 `json:"avg,omitempty"`
	Max    float64 `json:"max,omitempty"`
	Streak float64 `json:"streak,omitempty"`
}

type Habit struct {
	models.BaseModel

	Title       string `db:"title" json:"title"`
	Metric      string `db:"metric" json:"metric"`
	WeekStart   string `db:"week_start" json:"week_start"`
	Color       string `db:"color" json:"color"`
	Order       int64  `db:"order" json:"order"`
	CheckInType string `db:"check_in_type" json:"check_in_type"`
	Template    string `db:"template" json:"template"`
	UserId      string `db:"user_id" json:"user_id"`
	IsDeleted   bool   `db:"is_deleted" json:"is_deleted"`
	IsPrivate   bool   `db:"is_private" json:"is_private"`
	ApiKey      string `db:"api_key" json:"api_key"`

	CheckInItems []*schema.CheckIn `json:"check_in_items"`
	Meta         HabitMeta         `json:"meta"`
	Criterions   []*HabitCriterion `db:"-" json:"criterions"`
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
	record.Set("template", habit.Template)
	record.Set("user_id", habit.UserId)
	record.Set("is_deleted", habit.IsDeleted)
	record.Set("is_private", habit.IsPrivate)
	if record.IsNew() {
		record.Set("api_key", utils.RandomString())
	}

	return nil
}

func (habit *Habit) Validate() error {
	return validation.ValidateStruct(habit,
		validation.Field(&habit.Title, validation.Required),
		validation.Field(&habit.WeekStart, validation.In("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY")),
		validation.Field(&habit.Color, validation.Required),
		validation.Field(&habit.CheckInType, validation.In(utils.INPUT_NUMBER, utils.DONE_NOTE, utils.DONE, utils.MULTI_CRITERIA)),
		validation.Field(&habit.UserId, validation.Required),
	)
}

type HabitCriterion struct {
	models.BaseModel

	HabitId    string `json:"habit_id"`
	Name       string `json:"name"`
	GoalNumber int    `json:"goal_number"`
}

func (habitCriterion *HabitCriterion) TableName() string {
	return "mz_criterion"
}
