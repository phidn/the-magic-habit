package check_in

import (
	"context"
	"errors"

	"github.com/golangthang/mazic-habit/internal/mods/habit/habit"
	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/schema"
	"github.com/golangthang/mazic-habit/pkg/utils"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/models"
)

type CheckInService interface {
	CheckIn(ctx context.Context, userId string, checkInEntry *schema.CheckIn) (*models.Record, error)
	DeleteCheckIn(ctx context.Context, id string) (*models.Record, error)
}

type checkInService struct {
	Entry        entry.Entry
	HabitService habit.HabitService
}

func NewCheckInService(entry entry.Entry, habitService habit.HabitService) CheckInService {
	return &checkInService{
		Entry:        entry,
		HabitService: habitService,
	}
}

func (service *checkInService) CheckIn(ctx context.Context, userId string, checkInEntry *schema.CheckIn) (*models.Record, error) {
	tableName := new(schema.CheckIn).TableName()
	var record *models.Record

	habit, err := service.HabitService.FindOne(ctx, userId, checkInEntry.HabitId)
	if err != nil {
		return nil, err
	}
	if habit.Id == "" {
		return nil, errors.New("habit not found")
	}

	collection, err := service.Entry.FindCollectionByName(ctx, tableName)
	if err != nil {
		return nil, err
	}

	if habit.CheckInType == utils.MULTI_CRITERIA {
		err = service.Entry.Dao().RunInTransaction(func(txDao *daos.Dao) error {
			_, err := txDao.DB().Delete(
				tableName,
				dbx.HashExp{"habit_id": habit.Id, "date": checkInEntry.Date},
			).Execute()
			if err != nil {
				return err
			}

			for _, criterion := range checkInEntry.CriterionValues {
				checkInRecord := models.NewRecord(collection)
				checkInRecord.Set("habit_id", habit.Id)
				checkInRecord.Set("date", checkInEntry.Date)
				checkInRecord.Set("journal", checkInEntry.Journal)
				checkInRecord.Set("criterion_id", criterion.CriterionId)
				checkInRecord.Set("value", criterion.Value)

				if err := txDao.Save(checkInRecord); err != nil {
					return err
				}
			}

			return nil
		})
		if err != nil {
			return nil, err
		}
	} else {
		if checkInEntry.Id == "" {
			record = models.NewRecord(collection)
		} else {
			existingRecord, err := service.Entry.Dao().FindRecordById(tableName, checkInEntry.Id)
			if err != nil {
				return nil, err
			}
			record = existingRecord
		}
		checkInEntry.ParseRecord(record)

		if err := service.Entry.Dao().Save(record); err != nil {
			return nil, err
		}
	}

	return record, nil
}

func (service *checkInService) DeleteCheckIn(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(schema.CheckIn).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
