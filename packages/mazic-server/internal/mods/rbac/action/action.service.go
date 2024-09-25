package action

import (
	"context"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type ActionService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*Action, error)
	Create(ctx context.Context, action *Action) (*models.Record, error)
	Update(ctx context.Context, id string, action *Action) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
}

type actionService struct {
	Entry entry.Entry
}

func NewActionService(entry entry.Entry) ActionService {
	return &actionService{
		Entry: entry,
	}
}

func (service *actionService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{}

	is_active := queryParams.Get("is_active")
	if is_active != "" {
		listExpression = append(listExpression, dbx.NewExp("is_active = {:is_active}", dbx.Params{"is_active": is_active}))
	}

	search := queryParams.Get("search")
	if search != "" {
		listExpression = append(listExpression, dbx.Or(
			dbx.Like("name", search),
			dbx.Like("code", search),
		))
	}

	result, err := service.Entry.Find(ctx, &[]*Action{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *actionService) FindOne(ctx context.Context, id string) (*Action, error) {
	action := &Action{}
	err := service.Entry.ModelQuery(ctx, action).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(action)

	if err != nil {
		return nil, err
	}

	return action, nil
}

func (service *actionService) Create(ctx context.Context, action *Action) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Action).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	action.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *actionService) Update(ctx context.Context, id string, action *Action) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Action).TableName(), id)
	if err != nil {
		return nil, err
	}

	action.ParseRecord(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *actionService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Action).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
