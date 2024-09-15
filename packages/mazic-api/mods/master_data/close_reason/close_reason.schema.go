package close_reason

import (
	schema_common "mazic/mazicapi/common/schema"
)

type CloseReasonSchema struct {
	schema_common.BaseFields
	Type      string  `json:"type"`
	Value     string  `json:"value"`
	CompanyId *string `json:"company_id"`
}

type CloseReasonParamsSchema struct {
	schema_common.Filter
	Type *string `query:"type"`
}

func (a *CloseReasonSchema) TableName() string {
	return "md_close_reason"
}
