package schema_common

import "time"

type Filter struct {
	Search   *string `query:"search"`
	Sort     *string `query:"sort"`
	IsActive *bool   `query:"is_active"`
}

type BaseFields struct {
	Id        string     `json:"id" gorm:"primaryKey"`
	IsActive  bool       `json:"is_active"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at"`
	CreatedBy string     `json:"created_by"`
	UpdatedBy *string    `json:"updated_by"`
	DeletedBy *string    `json:"deleted_by"`
}
