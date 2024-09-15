package permission

import (
	"fmt"
	"mazic/mazicapi/cmd/infrastructure"
	schema_common "mazic/mazicapi/common/schema"
	"mazic/mazicapi/mods/rbac/action"
	"mazic/mazicapi/mods/rbac/resource"
	"mazic/mazicapi/util"

	"gorm.io/gorm"
)

type PermissionRepository struct {
	DB *infrastructure.Database
}

func NewPermissionRepository(db *infrastructure.Database) *PermissionRepository {
	return &PermissionRepository{
		DB: db,
	}
}

func (repo *PermissionRepository) Seed(createdBy string) error {
	var resources []resource.ResourceSchema
	if err := repo.DB.Where("is_active = ?", true).Find(&resources).Error; err != nil {
		return err
	}

	var actions []action.ActionSchema
	if err := repo.DB.Where("is_active = ?", true).Find(&actions).Error; err != nil {
		return err
	}

	for _, resource := range resources {
		for _, action := range actions {
			permissionCode := fmt.Sprintf("%s.%s", resource.Code, action.Code)
			permissionName := fmt.Sprintf("%s %s", action.Name, resource.Name)

			var existingPermission PermissionSchema
			result := repo.DB.Where("code = ?", permissionCode).First(&existingPermission)
			if result.Error != nil {
				if result.Error == gorm.ErrRecordNotFound {
					newPermission := PermissionSchema{
						BaseFields: schema_common.BaseFields{
							Id:        util.NewUuid(),
							IsActive:  true,
							CreatedBy: createdBy,
						},
						Name:        permissionName,
						Code:        permissionCode,
						Description: fmt.Sprintf("Permission to %s %s", action.Name, resource.Name),
						ResourceId:  resource.Id,
						ActionId:    action.Id,
					}

					if err := repo.DB.Create(&newPermission).Error; err != nil {
						return err
					}
				} else {
					return result.Error
				}
			}
			// If permission exists, do nothing
		}
	}

	return nil
}
