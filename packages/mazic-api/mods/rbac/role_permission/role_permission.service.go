package role_permission

import (
	"context"
	entry_common "mazic/mazicapi/common/entry"
	util "mazic/mazicapi/util"

	"gorm.io/gorm/clause"
)

type RolePermissionService struct {
	EntryService *entry_common.EntryService
}

func NewRolePermissionService(entryService *entry_common.EntryService) *RolePermissionService {
	return &RolePermissionService{
		EntryService: entryService,
	}
}

func (service *RolePermissionService) GetList(ctx context.Context) ([]RolePermissionSchema, error) {
	rawQuery := `
	SELECT
		rp.id AS id,
		res.id AS resource_id,
        res.name AS resource_name,
        r.id AS role_id,
        r.name AS role_name,
        r.role_key AS role_key,
        p.id AS permission_id,
        p.name AS permission_name,
        act.id AS action_id,
        act.name AS action_name,
        CASE
            WHEN rp.id IS NOT NULL THEN true
            ELSE false
        END AS is_access
    FROM
        sys_resource res
        LEFT JOIN sys_permission p ON res.id = p.resource_id
        LEFT JOIN sys_action act ON p.action_id = act.id
        CROSS JOIN sys_role r
        LEFT JOIN sys_role_permission rp ON r.id = rp.role_id AND p.id = rp.permission_id
    WHERE p.id IS NOT NULL
    ORDER BY res.name, r.name, act.name;
	`
	var result []RolePermissionSchema
	err := service.EntryService.DB(ctx).Raw(rawQuery).Scan(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (service *RolePermissionService) Update(ctx context.Context, records []RolePermissionUpsertSchema) error {
	tx := service.EntryService.DB(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	toDelete := util.StructsToInterfaceArray(records, nil)
	err := tx.Where("(role_id, permission_id) NOT IN ?", toDelete).Delete(new(RolePermissionSchema)).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, record := range records {
		err = tx.Clauses(clause.OnConflict{DoNothing: true}).Create(&record).Error
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}
