package close_reason

import (
	schema_common "mazic/mazicapi/common/schema"
	"mazic/pocketbase/models"
)

type CloseReasonSchema struct {
	models.BaseModel
	Type      string  `json:"type"`
	Name      string  `json:"name"`
	CompanyId *string `json:"company_id"`
}

type CloseReasonParamsSchema struct {
	schema_common.Filter
	Name *string `query:"name"`
}

func (a *CloseReasonSchema) TableName() string {
	return "md_close_reason"
}
