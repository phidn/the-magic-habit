package permission

import (
	"context"
	"fmt"
	"net/url"
	"strings"

	"github.com/golangthang/mazic-habit/internal/mods/rbac/action"
	"github.com/golangthang/mazic-habit/internal/mods/rbac/resource"
	"github.com/golangthang/mazic-habit/pkg/entry"
	"github.com/golangthang/mazic-habit/pkg/schema"
	"github.com/golangthang/mazic-habit/pkg/utils"

	"github.com/pocketbase/pocketbase/models"

	"github.com/pocketbase/dbx"
)

type PermissionService interface {
	Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error)
	FindOne(ctx context.Context, id string) (*Permission, error)
	Create(ctx context.Context, permission *Permission) (*models.Record, error)
	Update(ctx context.Context, id string, permission *Permission) (*models.Record, error)
	Delete(ctx context.Context, id string) (*models.Record, error)
	BulkDelete(ctx context.Context, ids []string) error
	Seed(ctx context.Context) error
}

type permissionService struct {
	Entry entry.Entry
}

func NewPermissionService(entry entry.Entry) PermissionService {
	return &permissionService{
		Entry: entry,
	}
}

func (service *permissionService) Find(ctx context.Context, queryParams url.Values) (*schema.ListItems, error) {
	listExpression := []dbx.Expression{}

	is_active := queryParams.Get("is_active")
	if is_active != "" {
		listExpression = append(listExpression, dbx.NewExp("is_active = {:is_active}", dbx.Params{"is_active": is_active}))
	}

	resource_id := queryParams.Get("resource_id")
	if resource_id != "" {
		ids := strings.Split(resource_id, ",")
		listExpression = append(listExpression, dbx.In("resource_id", utils.ToInterfaceSlice(ids)...))
	}

	search := queryParams.Get("search")
	if search != "" {
		listExpression = append(listExpression, dbx.Or(
			dbx.Like("name", search),
			dbx.Like("code", search),
		))
	}

	result, err := service.Entry.Find(ctx, &[]*Permission{}, listExpression, queryParams)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func (service *permissionService) FindOne(ctx context.Context, id string) (*Permission, error) {
	permission := &Permission{}
	err := service.Entry.ModelQuery(ctx, permission).
		AndWhere(dbx.HashExp{"id": id}).
		Limit(1).
		One(permission)

	if err != nil {
		return nil, err
	}

	return permission, nil
}

func (service *permissionService) Create(ctx context.Context, permission *Permission) (*models.Record, error) {
	collection, err := service.Entry.FindCollectionByName(ctx, new(Permission).TableName())
	if err != nil {
		return nil, err
	}

	record := models.NewRecord(collection)
	permission.ParseRecord(record)

	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *permissionService) Update(ctx context.Context, id string, permission *Permission) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Permission).TableName(), id)
	if err != nil {
		return nil, err
	}

	permission.ParseRecord(record)
	if err := service.Entry.Dao().Save(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *permissionService) Delete(ctx context.Context, id string) (*models.Record, error) {
	record, err := service.Entry.FindRecordById(ctx, new(Permission).TableName(), id)
	if err != nil {
		return nil, err
	}
	if err := service.Entry.Dao().DeleteRecord(record); err != nil {
		return nil, err
	}
	return record, nil
}

func (service *permissionService) BulkDelete(ctx context.Context, ids []string) error {
	_, err := service.Entry.Dao().DB().
		Delete(new(Permission).TableName(), dbx.In("id", utils.ToInterfaceSlice(ids)...)).
		WithContext(ctx).
		Execute()
	if err != nil {
		return err
	}
	return nil
}

func (service *permissionService) Seed(ctx context.Context) error {
	var resources []resource.Resource
	var actions []action.Action

	// Fetch all active resources
	err := service.Entry.Dao().DB().
		Select("id", "name", "code", "actions").
		From(new(resource.Resource).TableName()).
		Where(dbx.HashExp{"is_active": true}).
		All(&resources)
	if err != nil {
		return fmt.Errorf("failed to fetch resources: %w", err)
	}

	err = service.Entry.Dao().DB().
		Select("id", "name", "code").
		From(new(action.Action).TableName()).
		Where(dbx.HashExp{"is_active": true}).
		All(&actions)
	if err != nil {
		return fmt.Errorf("failed to fetch actions: %w", err)
	}
	actionMap := make(map[string]action.Action)
	for _, action := range actions {
		actionMap[action.Id] = action
	}

	// Pre-fetch all existing permissions
	var existingPermissions []Permission
	err = service.Entry.Dao().DB().
		Select("code").
		From(new(Permission).TableName()).
		All(&existingPermissions)
	if err != nil {
		return fmt.Errorf("failed to fetch existing permissions: %w", err)
	}

	existingPermissionMap := make(map[string]struct{})
	for _, perm := range existingPermissions {
		existingPermissionMap[perm.Code] = struct{}{}
	}

	// Loop through resources and actions to create missing permissions
	for _, resource := range resources {
		for _, actionId := range resource.Actions {
			action := actionMap[actionId.(string)]
			permissionCode := fmt.Sprintf("%s.%s", resource.Code, action.Code)

			// Skip if permission already exists
			if _, exists := existingPermissionMap[permissionCode]; exists {
				continue
			}

			// Create new permission
			newPermission := &Permission{
				Name:        fmt.Sprintf("%s %s", action.Name, resource.Name),
				Code:        permissionCode,
				Description: fmt.Sprintf("Permission to %s %s", action.Name, resource.Name),
				IsActive:    true,
				ResourceId:  resource.Id,
				ActionId:    action.Id,
			}
			if _, err := service.Create(ctx, newPermission); err != nil {
				return fmt.Errorf("failed to create permission %s: %w", permissionCode, err)
			}
		}
	}

	return nil
}
