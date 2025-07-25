package role

import (
	"context"
	"net/url"

	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/schema"

	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type RoleService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*Role, error)
	Create(ctx context.Context, role *Role) (*models.Record, error)
	Update(ctx context.Context, id string, role *Role) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
}

type roleService struct {
	Entry entry.Entry
}

func NewRoleService(entry entry.Entry) RoleService {
	return &roleService{
		Entry: entry,
	}
}

func (service *roleService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{}

	is_active := queryParams.Get("is_active")
	if is_active != "" {
		listExpression = append(listExpression, dbx.NewExp("is_active = {:is_active}", dbx.Params{"is_active": is_active}))
	}

	search := queryParams.Get("search")
	if search != "" {
		listExpression = append(listExpression, dbx.Or(
			dbx.Like("name", search),
			dbx.Like("description", search),
		))
	}

	result, err := service.Entry.Find(ctx, &[]*Role{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *roleService) FindOne(ctx context.Context, id string) (*Role, error) {
	role := &Role{}
	err := service.Entry.ModelQuery(ctx, role).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(role)

	if err != nil {
		return nil, err
	}

	return role, nil
}

func (service *roleService) Create(ctx context.Context, role *Role) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Role).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	role.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *roleService) Update(ctx context.Context, id string, role *Role) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Role).TableName(), id)
	if err != nil {
		return nil, err
	}

	role.ParseRecord(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *roleService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Role).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
