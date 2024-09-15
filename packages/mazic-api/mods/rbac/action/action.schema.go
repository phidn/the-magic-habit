package action

import (
	schema_common "mazic/mazicapi/common/schema"
)

type ActionSchema struct {
	schema_common.BaseFields

	Name        string `json:"name"`
	Code        string `json:"code"`
	Description string `json:"description"`
}

type ActionParamsSchema struct {
	schema_common.Filter
}

func (a *ActionSchema) TableName() string {
	return "sys_action"
}
