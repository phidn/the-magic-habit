package resource

import (
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type ResourceService struct {
	Entry *entry.Entry
}

func NewResourceService(entry *entry.Entry) *ResourceService {
	return &ResourceService{
		Entry: entry,
	}
}

func (service *ResourceService) Find(queryParams url.Values) (*schema.ListItems, error) {
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

	result, err := service.Entry.Find(&[]*Resource{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *ResourceService) FindOne(id string) (*Resource, error) {
	resource := new(Resource)
	err := service.Entry.ModelQuery(&Resource{}).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(&resource)

	if err != nil {
		return nil, err
	}

	return resource, nil
}

func (service *ResourceService) Create(resource *Resource) (*models.Record, error) {
	collection, err := service.Entry.Dao().FindCollectionByNameOrId(new(Resource).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	resource.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *ResourceService) Update(id string, resource *Resource) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Resource).TableName(), id)
	if err != nil {
		return nil, err
	}

	resource.ParseRecord(record)
	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *ResourceService) Delete(id string) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Resource).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
