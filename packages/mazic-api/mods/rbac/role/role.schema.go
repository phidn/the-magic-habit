package role

import (
	schema_common "mazic/mazicapi/common/schema"
)

type RoleSchema struct {
	schema_common.BaseFields
	Name        string `json:"name"`
	RoleKey     string `json:"role_key"`
	Description string `json:"description"`
}

type RoleParamsSchema struct {
	schema_common.Filter
}

func (a *RoleSchema) TableName() string {
	return "sys_role"
}
