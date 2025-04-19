package habit

import (
	"context"
	"net/url"

	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/schema"
	"github.com/golangthang/mazic-habit/pkg/utils"

	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type HabitService interface {
	Find(ctx context.Context, userId string, queryParams url.Values) (*schema.ListItems, error)
	FindWidget(ctx context.Context, apiKey string, queryParams url.Values) (*Habit, error)
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

	habit_id := queryParams.Get("habit_id")
	if habit_id != "" {
		listExpression = append(listExpression, dbx.NewExp("id = {:habit_id}", dbx.Params{"habit_id": habit_id}))
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

	checkInList := &[]*schema.CheckIn{}
	err = service.Entry.ModelQuery(ctx, new(schema.CheckIn)).
		AndWhere(dbx.In("habit_id", habitIds...)).
		All(checkInList)

	if err != nil {
		return nil, err
	}

	err = processCheckInList(*habits, *checkInList)
	if err != nil {
		return nil, err
	}

	criteriaList := &[]*HabitCriterion{}
	err = service.Entry.ModelQuery(ctx, new(HabitCriterion)).
		AndWhere(dbx.In("habit_id", habitIds...)).
		All(criteriaList)

	if err != nil {
		return nil, err
	}

	for _, habit := range *habits {
		if habit.CheckInType == utils.MULTI_CRITERIA {
			habit.Criterions = entry.Filter(*criteriaList, func(criterion *HabitCriterion) bool {
				return criterion.HabitId == habit.Id
			})
		}
	}

	return result, nil
}

func (service *habitService) FindWidget(ctx context.Context, apiKey string, queryParams url.Values) (*Habit, error) {
	habit := &Habit{}
	err := service.Entry.ModelQuery(ctx, habit).
		AndWhere(dbx.HashExp{"api_key": apiKey}).
		Limit(1).
		One(habit)

	if err != nil {
		return nil, err
	}

	checkInList := &[]*schema.CheckIn{}
	err = service.Entry.ModelQuery(ctx, new(schema.CheckIn)).
		AndWhere(dbx.HashExp{"habit_id": habit.Id}).
		All(checkInList)

	if err != nil {
		return nil, err
	}

	values := utils.ExtractFieldToSlice(*checkInList, "Value")
	maxValue := utils.Max(values)
	avgValue := utils.Avg(values)
	err = processCheckInItem(*checkInList, 0, maxValue, avgValue)
	if err != nil {
		return nil, err
	}

	habit.CheckInItems = *checkInList
	habit.Meta.Avg = avgValue
	habit.Meta.Max = maxValue

	return habit, nil
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

	criteriaList := &[]*HabitCriterion{}
	err = service.Entry.ModelQuery(ctx, new(HabitCriterion)).
		AndWhere(dbx.HashExp{"habit_id": id}).
		All(criteriaList)

	if err != nil {
		return nil, err
	}

	habit.Criterions = *criteriaList

	return habit, nil
}

func (service *habitService) Create(ctx context.Context, habit *Habit) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Habit).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	habit.ParseRecord(record)

	err = service.Entry.Dao().RunInTransaction(func(txDao *daos.Dao) error {
		if err := txDao.Save(record); err != nil {
			return err
		}
		criterionCollection, err := service.Entry.FindCollectionByName(ctx, new(HabitCriterion).TableName())
		if err != nil {
			return err
		}

		if habit.CheckInType == utils.MULTI_CRITERIA {
			for idx, criterion := range habit.Criterions {
				criterionItem := models.NewRecord(criterionCollection)
				criterionItem.Set("habit_id", record.Id)
				criterionItem.Set("name", criterion.Name)
				criterionItem.Set("goal_number", criterion.GoalNumber)
				if err := txDao.Save(criterionItem); err != nil {
					return err
				}
				habit.Criterions[idx].Id = criterionItem.Id
				habit.Criterions[idx].HabitId = record.Id
			}
		}
		return nil
	})
	if err != nil {
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

	err = service.Entry.Dao().RunInTransaction(func(txDao *daos.Dao) error {
		if err := txDao.Save(record); err != nil {
			return err
		}

		if habit.CheckInType == utils.MULTI_CRITERIA {
			habitCriterionIds := utils.ExtractFieldToSlice(habit.Criterions, "Id")
			_, err := txDao.DB().Delete(
				new(HabitCriterion).TableName(),
				dbx.HashExp{"habit_id": id, "id": dbx.NotIn("id", habitCriterionIds...)},
			).Execute()

			if err != nil {
				return err
			}

			// Create new criteria
			criterionCollection, err := service.Entry.FindCollectionByName(ctx, new(HabitCriterion).TableName())
			if err != nil {
				return err
			}

			for idx, criterion := range habit.Criterions {
				var criterionItem *models.Record
				if criterion.Id == "" {
					criterionItem = models.NewRecord(criterionCollection)
				} else {
					criterionItem, err = txDao.FindRecordById(criterionCollection.Name, criterion.Id)
					if err != nil {
						return err
					}
				}

				criterionItem.Set("habit_id", record.Id)
				criterionItem.Set("name", criterion.Name)
				criterionItem.Set("goal_number", criterion.GoalNumber)
				if err := txDao.Save(criterionItem); err != nil {
					return err
				}

				habit.Criterions[idx].Id = criterionItem.Id
				habit.Criterions[idx].HabitId = record.Id
			}
		}
		return nil
	})

	if err != nil {
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
