package habit

import (
	"context"
	"mazic/server/internal/mods/habit/check_in"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"mazic/server/pkg/utils"
	"net/url"

	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type HabitService interface {
	Find(ctx context.Context, userId string, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, userId, id string) (*Habit, error)
	Create(ctx context.Context, habit *Habit) (*models.Record, error)
	Update(ctx context.Context, id string, habit *Habit) (*models.Record, error)
	Delete(ctx context.Context, userId, id string) error
}

type habitService struct {
	Entry entry.Entry
}

func NewHabitService(entry entry.Entry) HabitService {
	return &habitService{
		Entry: entry,
	}
}

func (service *habitService) Find(ctx context.Context, userId string, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{
		dbx.HashExp{"user_id": userId},
	}

	title := queryParams.Get("title")
	if title != "" {
		listExpression = append(listExpression, dbx.NewExp("title = {:title}", dbx.Params{"title": title}))
	}
	metric := queryParams.Get("metric")
	if metric != "" {
		listExpression = append(listExpression, dbx.NewExp("metric = {:metric}", dbx.Params{"metric": metric}))
	}

	search := queryParams.Get("search")
	if search != "" {
		listExpression = append(listExpression, dbx.Or(
			dbx.Like("title", search),
		))
	}

	habits := &[]*Habit{}
	result, err := service.Entry.Find(ctx, habits, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	if len(*habits) == 0 {
		return result, nil
	}

	isEntryExpand := queryParams.Get("entry_expand") == "true"
	if !isEntryExpand {
		return result, nil
	}

	habitIds := utils.ExtractFieldToSlice(*habits, "Id")

	checkInList := &[]*check_in.CheckIn{}
	err = service.Entry.ModelQuery(ctx, new(check_in.CheckIn)).
		AndWhere(dbx.In("habit_id", habitIds...)).
		All(checkInList)

	if err != nil {
		return nil, err
	}

	allValues := utils.ExtractFieldToSlice(*checkInList, "Value")
	allAvgValue := utils.Avg(allValues)

	checkInMap := map[string][]*check_in.CheckIn{}

	for _, habit := range *habits {
		if _, ok := checkInMap[habit.Id]; !ok {
			checkInMap[habit.Id] = []*check_in.CheckIn{}
		}
	}

	for _, checkIn := range *checkInList {
		checkInMap[checkIn.HabitId] = append(checkInMap[checkIn.HabitId], checkIn)
	}

	for _, habit := range *habits {
		if items, ok := checkInMap[habit.Id]; ok {
			values := utils.ExtractFieldToSlice(items, "Value")
			maxValue := utils.Max(values)
			avgValue := utils.Avg(values)
			for _, checkIn := range items {
				if checkIn.Value > 0 {
					if checkIn.Value > 0 && checkIn.Value < maxValue/4 {
						checkIn.Level = 1
					}
					if checkIn.Value >= maxValue/4 && checkIn.Value < maxValue/2 {
						checkIn.Level = 2
					}
					if checkIn.Value >= maxValue/2 && checkIn.Value < maxValue*3/4 {
						checkIn.Level = 3
					}
					if checkIn.Value >= maxValue*3/4 {
						checkIn.Level = 4
					}
					checkIn.Count = checkIn.Value
					numberFactor := allAvgValue / avgValue
					checkIn.BarValue = checkIn.Value * numberFactor
				} else {
					if *checkIn.IsDone {
						checkIn.Level = 4
						checkIn.Count = 1
						checkIn.Value = allAvgValue
						checkIn.BarValue = allAvgValue
					} else {
						checkIn.Level = 0
						checkIn.Count = 0
					}
				}
			}
			habit.CheckInItems = items
		}
	}

	return result, nil
}

func (service *habitService) FindOne(ctx context.Context, userId, id string) (*Habit, error) {
	habit := &Habit{}
	err := service.Entry.ModelQuery(ctx, habit).
		AndWhere(dbx.HashExp{"id": id}).
		AndWhere(dbx.HashExp{"user_id": userId}).
		Limit(1).
		One(habit)

	if err != nil {
		return nil, err
	}

	return habit, nil
}

func (service *habitService) Create(ctx context.Context, habit *Habit) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Habit).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	habit.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *habitService) Update(ctx context.Context, id string, habit *Habit) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Habit).TableName(), id)
	if err != nil {
		return nil, err
	}

	habit.ParseRecord(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *habitService) Delete(ctx context.Context, userId, id string) error {
	_, err := service.Entry.Dao().DB().
		Delete(new(Habit).TableName(), dbx.HashExp{"id": id, "user_id": userId}).
		Execute()
	if err != nil {
		return err
	}
	return nil
}
