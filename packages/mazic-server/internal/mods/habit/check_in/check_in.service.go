package check_in

import (
	"context"
	"mazic/server/pkg/entry"

	"github.com/pocketbase/pocketbase/models"
)

type CheckInService interface {
	CheckIn(ctx context.Context, checkInEntry *CheckIn) (*models.Record, error)
	DeleteCheckIn(ctx context.Context, id string) (*models.Record, error)
}

type checkInService struct {
	Entry entry.Entry
}

func NewCheckInService(entry entry.Entry) CheckInService {
	return &checkInService{
		Entry: entry,
	}
}

func (service *checkInService) CheckIn(ctx context.Context, checkInEntry *CheckIn) (*models.Record, error) {
	tableName := new(CheckIn).TableName()
	var record *models.Record

	if checkInEntry.Id == "" {
		collection, err := service.Entry.FindCollectionByName(ctx, tableName)
		if err != nil {
			return nil, err
		}

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
	return record, nil
}

func (service *checkInService) DeleteCheckIn(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(CheckIn).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
