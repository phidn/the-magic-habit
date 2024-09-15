package role

import (
	"context"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/util"
)

type RoleService struct {
	EntryService *entry_common.EntryService
}

func NewRoleService(entryService *entry_common.EntryService) *RoleService {
	return &RoleService{
		EntryService: entryService,
	}
}

func (service *RoleService) GetList(ctx context.Context, params RoleParamsSchema, pagination util.PaginationPage) ([]RoleSchema, int64, error) {
	var items []RoleSchema
	var filters = entry_common.Filters{
		Search: map[string]interface{}{
			"name": params.Search,
		},
		Filters: map[string]interface{}{
			"is_active": params.IsActive,
		},
		Sort: params.Sort,
	}
	total, err := service.EntryService.GetList(ctx, &items, pagination, &filters)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (service *RoleService) GetById(ctx context.Context, id string) (*RoleSchema, error) {
	var result RoleSchema
	if err := service.EntryService.GetById(ctx, &result, id, nil); err != nil {
		return nil, err
	}
	return &result, nil
}

func (service *RoleService) Upsert(ctx context.Context, item *RoleSchema) error {
	if err := service.EntryService.Save(ctx, item, nil); err != nil {
		return err
	}
	return nil
}

func (service *RoleService) Delete(ctx context.Context, id string) error {
	if err := service.EntryService.Delete(ctx, id, &RoleSchema{}); err != nil {
		return err
	}
	return nil
}
