package action

import (
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type ActionService struct {
	Entry *entry.Entry
}

func NewActionService(entry *entry.Entry) *ActionService {
	return &ActionService{
		Entry: entry,
	}
}

func (service *ActionService) Find(queryParams url.Values) (*schema.ListItems, error) {
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

	result, err := service.Entry.Find(&[]*Action{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *ActionService) FindOne(id string) (*Action, error) {
	action := &Action{}
	err := service.Entry.ModelQuery(action).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(&action)

	if err != nil {
		return nil, err
	}

	return action, nil
}

func (service *ActionService) Create(action *Action) (*models.Record, error) {
	collection, err := service.Entry.Dao().FindCollectionByNameOrId(new(Action).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	action.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *ActionService) Update(id string, action *Action) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Action).TableName(), id)
	if err != nil {
		return nil, err
	}

	action.ParseRecord(record)
	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *ActionService) Delete(id string) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Action).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
