package habit

import (
	"context"
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
	CheckIn(ctx context.Context, habitEntry *HabitEntry) (*models.Record, error)
	DeleteCheckIn(ctx context.Context, id string) (*models.Record, error)
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

	habitEntries := &[]*HabitEntry{}
	err = service.Entry.ModelQuery(ctx, new(HabitEntry)).
		AndWhere(dbx.In("habit_id", habitIds...)).
		All(habitEntries)

	if err != nil {
		return nil, err
	}

	allValues := utils.ExtractFieldToSlice(*habitEntries, "Value")
	allAvgValue := utils.Avg(allValues)

	habitEntriesMap := map[string][]*HabitEntry{}

	for _, habit := range *habits {
		if _, ok := habitEntriesMap[habit.Id]; !ok {
			habitEntriesMap[habit.Id] = []*HabitEntry{}
		}
	}

	for _, entry := range *habitEntries {
		habitEntriesMap[entry.HabitId] = append(habitEntriesMap[entry.HabitId], entry)
	}

	for _, habit := range *habits {
		if entries, ok := habitEntriesMap[habit.Id]; ok {
			values := utils.ExtractFieldToSlice(entries, "Value")
			maxValue := utils.Max(values)
			avgValue := utils.Avg(values)
			for _, entry := range entries {
				if entry.Value > 0 {
					if entry.Value > 0 && entry.Value < maxValue/4 {
						entry.Level = 1
					}
					if entry.Value >= maxValue/4 && entry.Value < maxValue/2 {
						entry.Level = 2
					}
					if entry.Value >= maxValue/2 && entry.Value < maxValue*3/4 {
						entry.Level = 3
					}
					if entry.Value >= maxValue*3/4 {
						entry.Level = 4
					}
					entry.Count = entry.Value
					numberFactor := allAvgValue / avgValue
					entry.BarValue = entry.Value * numberFactor
				} else {
					if *entry.IsDone {
						entry.Level = 4
						entry.Count = 1
						entry.Value = allAvgValue
						entry.BarValue = allAvgValue
					} else {
						entry.Level = 0
						entry.Count = 0
					}
				}
			}
			habit.Entries = entries
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

// func (service *habitService) Delete(ctx context.Context, id string) (*models.Record, error) {
// 	record, err := service.Entry.FindRecordById(ctx, new(Habit).TableName(), id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
// 		return nil, err
// 	}
// 	return record, nil
// }

func (service *habitService) CheckIn(ctx context.Context, habitEntry *HabitEntry) (*models.Record, error) {
	tableName := new(HabitEntry).TableName()
	var record *models.Record

	if habitEntry.Id == "" {
		collection, err := service.Entry.FindCollectionByName(ctx, tableName)
		if err != nil {
			return nil, err
		}

		record = models.NewRecord(collection)
	} else {
		existingRecord, err := service.Entry.Dao().FindRecordById(tableName, habitEntry.Id)
		if err != nil {
			return nil, err
		}
		record = existingRecord
	}
	habitEntry.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *habitService) DeleteCheckIn(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(HabitEntry).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
