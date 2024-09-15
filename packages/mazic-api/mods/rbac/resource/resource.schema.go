package resource

import (
	schema_common "mazic/mazicapi/common/schema"
)

type ResourceSchema struct {
	schema_common.BaseFields

	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
}

type ResourceParamsSchema struct {
	schema_common.Filter
}

func (a *ResourceSchema) TableName() string {
	return "sys_resource"
}
