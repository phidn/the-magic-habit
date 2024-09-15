package permission

import (
	"context"
	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/util"
)

type PermissionService struct {
	PermissionRepository *PermissionRepository
	EntryService         *entry_common.EntryService
}

func NewPermissionService(permissionRepository *PermissionRepository, entryService *entry_common.EntryService) *PermissionService {
	return &PermissionService{
		PermissionRepository: permissionRepository,
		EntryService:         entryService,
	}
}

func (service *PermissionService) GetList(ctx context.Context, params PermissionParamsSchema, pagination util.PaginationPage) ([]PermissionSchema, int64, error) {
	var items []PermissionSchema
	total, err := service.EntryService.GetList(ctx, &items, pagination, &entry_common.Filters{
		Search: map[string]interface{}{
			"name": params.Search,
		},
		Filters: map[string]interface{}{
			"is_active": params.IsActive,
		},
		Sort: params.Sort,
	})
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (service *PermissionService) GetById(ctx context.Context, id string) (*PermissionSchema, error) {
	var result PermissionSchema
	if err := service.EntryService.GetById(ctx, &result, id, nil); err != nil {
		return nil, err
	}
	return &result, nil
}

func (service *PermissionService) Upsert(ctx context.Context, item *PermissionSchema) error {
	if err := service.EntryService.Save(ctx, item, nil); err != nil {
		return err
	}
	return nil
}

func (service *PermissionService) Delete(ctx context.Context, id string) error {
	if err := service.EntryService.Delete(ctx, id, &PermissionSchema{}); err != nil {
		return err
	}
	return nil
}

func (service *PermissionService) Seed(createdBy string) error {
	return service.PermissionRepository.Seed(createdBy)
}
