package resource

import (
	"context"
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type ResourceService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*Resource, error)
	Create(ctx context.Context, resource *Resource) (*models.Record, error)
	Update(ctx context.Context, id string, resource *Resource) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
}

type resourceService struct {
	Entry entry.Entry
}

func NewResourceService(entry entry.Entry) ResourceService {
	return &resourceService{
		Entry: entry,
	}
}

func (service *resourceService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
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

	result, err := service.Entry.Find(ctx, &[]*Resource{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *resourceService) FindOne(ctx context.Context, id string) (*Resource, error) {
	resource := &Resource{}
	err := service.Entry.ModelQuery(ctx, resource).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(resource)

	if err != nil {
		return nil, err
	}

	return resource, nil
}

func (service *resourceService) Create(ctx context.Context, resource *Resource) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Resource).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	resource.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *resourceService) Update(ctx context.Context, id string, resource *Resource) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Resource).TableName(), id)
	if err != nil {
		return nil, err
	}

	resource.ParseRecord(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *resourceService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Resource).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
