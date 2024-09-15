package resource

import (
	"context"

	entry_common "mazic/mazicapi/common/entry"
	util "mazic/mazicapi/util"
)

type ResourceService struct {
	EntryService *entry_common.EntryService
}

func NewResourceService(entryService *entry_common.EntryService) *ResourceService {
	return &ResourceService{
		EntryService: entryService,
	}
}

func (service *ResourceService) GetList(ctx context.Context, params ResourceParamsSchema, pagination util.PaginationPage) ([]ResourceSchema, int64, error) {
	var items []ResourceSchema
	filters := entry_common.Filters{
		Search: map[string]interface{}{
			"name": params.Search,
		},
		Filters: map[string]interface{}{
			"is_active": params.IsActive,
		},
		Sort: params.Sort,
	}
	total, err := service.EntryService.GetList(ctx, &items, pagination, &filters)
	return items, total, err
}

func (service *ResourceService) GetById(ctx context.Context, id string) (*ResourceSchema, error) {
	var result ResourceSchema
	err := service.EntryService.GetById(ctx, &result, id, nil)
	return &result, err
}

func (service *ResourceService) Save(ctx context.Context, item *ResourceSchema) error {
	return service.EntryService.Save(ctx, item, nil)
}

func (service *ResourceService) Delete(ctx context.Context, id string) error {
	return service.EntryService.Delete(ctx, id, &ResourceSchema{})
}
