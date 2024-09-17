package close_reason

import (
	"context"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/util"
)

type CloseReasonService struct {
	EntryService *entry_common.EntryService
}

func NewCloseReasonService(entryService *entry_common.EntryService) *CloseReasonService {
	return &CloseReasonService{
		EntryService: entryService,
	}
}

func (service *CloseReasonService) GetList(ctx context.Context, params CloseReasonParamsSchema, pagination util.PaginationPage) ([]CloseReasonSchema, int64, error) {
	var items []CloseReasonSchema
	filters := entry_common.Filters{
		Search: map[string]interface{}{
			"value": params.Search,
		},
		Filters: map[string]interface{}{
			"is_active": params.IsActive,
			"name":      params.Name,
		},
		Sort: params.Sort,
	}
	total, err := service.EntryService.GetList(ctx, &items, pagination, &filters)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (service *CloseReasonService) GetById(ctx context.Context, id string, closeReason *CloseReasonSchema) error {
	return service.EntryService.GetById(ctx, closeReason, id, nil)
}

func (service *CloseReasonService) Upsert(ctx context.Context, closeReason *CloseReasonSchema) error {
	return service.EntryService.Save(ctx, closeReason, nil)
}

func (service *CloseReasonService) Delete(ctx context.Context, id string) error {
	return service.EntryService.Delete(ctx, id, &CloseReasonSchema{})
}
