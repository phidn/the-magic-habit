package action

import (
	"context"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/util"
)

type ActionService struct {
	EntryService *entry_common.EntryService
}

func NewActionService(entryService *entry_common.EntryService) *ActionService {
	return &ActionService{
		EntryService: entryService,
	}
}

func (service *ActionService) GetList(ctx context.Context, params ActionParamsSchema, pagination util.PaginationPage) ([]ActionSchema, int64, error) {
	var items []ActionSchema
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

func (service *ActionService) GetById(ctx context.Context, id string) (*ActionSchema, error) {
	var result ActionSchema
	if err := service.EntryService.GetById(ctx, &result, id, nil); err != nil {
		return nil, err
	}
	return &result, nil
}

func (service *ActionService) Upsert(ctx context.Context, item *ActionSchema) error {
	if err := service.EntryService.Save(ctx, item, nil); err != nil {
		return err
	}
	return nil
}

func (service *ActionService) Delete(ctx context.Context, id string) error {
	if err := service.EntryService.Delete(ctx, id, &ActionSchema{}); err != nil {
		return err
	}
	return nil
}

