package role

import (
	"mazic/pocketbase/models"
	"mazic/server/pkg/entry"
	"mazic/server/pkg/schema"
	"net/url"

	"github.com/pocketbase/dbx"
)

type RoleService struct {
	Entry *entry.Entry
}

func NewRoleService(entry *entry.Entry) *RoleService {
	return &RoleService{
		Entry: entry,
	}
}

func (service *RoleService) Find(queryParams url.Values) (*schema.ListItems, error) {
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

	result, err := service.Entry.Find(&[]*Role{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *RoleService) FindOne(id string) (*Role, error) {
	role := &Role{}
	err := service.Entry.ModelQuery(role).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(&role)

	if err != nil {
		return nil, err
	}

	return role, nil
}

func (service *RoleService) Create(role *Role) (*models.Record, error) {
	collection, err := service.Entry.Dao().FindCollectionByNameOrId(new(Role).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	role.ParseRecord(record)

	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *RoleService) Update(id string, role *Role) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Role).TableName(), id)
	if err != nil {
		return nil, err
	}

	role.ParseRecord(record)
	if err := service.Entry.Dao().SaveRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *RoleService) Delete(id string) (*models.Record, error) {
	record, err := service.Entry.Dao().FindRecordById(new(Role).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}
