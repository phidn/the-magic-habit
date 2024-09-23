package permission

import (
	"context"
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type PermissionService struct {
	Entry *entry.Entry
}

func NewPermissionService(entry *entry.Entry) *PermissionService {
	return &PermissionService{
		Entry: entry,
	}
}

func (service *PermissionService) Find(queryParams url.Values) (*schema.ListItems, error) {
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

	result, err := service.Entry.Find(&[]*Permission{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *PermissionService) FindOne(ctx context.Context, id string) (*Permission, error) {
	permission := Permission{}
	err := service.Entry.ModelQuery(&permission).
		WithContext(ctx).
		Where(dbx.HashExp{"id": id}).
		Limit(1).
		One(&permission)

	if err != nil {
		return nil, err
	}

	return &permission, nil
}

func (service *PermissionService) Create(permission *Permission) (*models.Record, error) {
	collection, err := service.Entry.Dao().FindCollectionByNameOrId(new(Permission).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	permission.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *PermissionService) Update(id string, permission *Permission) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Permission).TableName(), id)
	if err != nil {
		return nil, err
	}

	permission.ParseRecord(record)
	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *PermissionService) Delete(id string) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Permission).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
