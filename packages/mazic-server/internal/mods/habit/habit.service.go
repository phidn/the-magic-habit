package habit

import (
	"context"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/mz_time"
	"mazic/server/pkg/schema"
	"mazic/server/pkg/utils"
	"net/url"
	"time"

	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/types"

	"github.com/pocketbase/dbx"
)

type HabitService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*Habit, error)
	Create(ctx context.Context, habit *Habit) (*models.Record, error)
	Update(ctx context.Context, id string, habit *Habit) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
}

type habitService struct {
	Entry entry.Entry
}

func NewHabitService(entry entry.Entry) HabitService {
	return &habitService{
		Entry: entry,
	}
}

func (service *habitService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{}

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

	habitIds := utils.ExtractFieldToSlice(*habits, "Id")

	habitEntries := &[]*HabitEntry{}
	err = service.Entry.ModelQuery(ctx, new(HabitEntry)).
		AndWhere(dbx.In("habit_id", habitIds...)).
		All(habitEntries)

	if err != nil {
		return nil, err
	}

	values := utils.ExtractFieldToSlice(*habitEntries, "Value")
	maxValue := utils.Max(values)

	habitEntriesMap := map[string][]*HabitEntry{}

	for _, entry := range *habitEntries {
		if _, ok := habitEntriesMap[entry.HabitId]; !ok {
			habitEntriesMap[entry.HabitId] = []*HabitEntry{}
		}
		if entry.Value == 0 {
			entry.Level = 0
		}
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
		habitEntriesMap[entry.HabitId] = append(habitEntriesMap[entry.HabitId], entry)
	}

	for _, habit := range *habits {
		if entries, ok := habitEntriesMap[habit.Id]; ok {
			existingDates := make(map[string]bool)
			for _, entry := range entries {
				entryDate := mz_time.TimeFormat(entry.Date.Time(), mz_time.YYYYMMDD)
				existingDates[entryDate] = true
			}

			today := time.Now()
			prevYear := today.AddDate(-1, 0, 0)
			startHeatmap := mz_time.StartOfWeek(prevYear)
			_startHeatmap := mz_time.TimeFormat(startHeatmap, mz_time.YYYYMMDD)
			habitDate, _ := types.ParseDateTime(startHeatmap)

			if !existingDates[_startHeatmap] {
				emptyEntry := &HabitEntry{
					Date:  habitDate,
					Value: 0,
					Level: 0,
				}
				entries = append([]*HabitEntry{emptyEntry}, entries...)
			}

			endHeatmap := mz_time.EndOfWeek(today)
			_endHeatmap := mz_time.TimeFormat(endHeatmap, mz_time.YYYYMMDD)
			habitDate, _ = types.ParseDateTime(endHeatmap)

			if !existingDates[_endHeatmap] {
				emptyEntry := &HabitEntry{
					Date:  habitDate,
					Value: 0,
					Level: 0,
				}
				entries = append(entries, emptyEntry)
			}

			habit.Entries = entries
		}
	}

	return result, nil
}

func (service *habitService) FindOne(ctx context.Context, id string) (*Habit, error) {
	habit := &Habit{}
	err := service.Entry.ModelQuery(ctx, habit).
		AndWhere(dbx.HashExp{"id": id}).
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

func (service *habitService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Habit).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
