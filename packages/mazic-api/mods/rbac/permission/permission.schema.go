package permission

import schema_common "mazic/mazicapi/common/schema"

type PermissionSchema struct {
	schema_common.BaseFields
	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
	ResourceId  string `json:"resource_id"`
	ActionId    string `json:"action_id"`
}

type PermissionParamsSchema struct {
	schema_common.Filter
}

func (a *PermissionSchema) TableName() string {
	return "sys_permission"
}
