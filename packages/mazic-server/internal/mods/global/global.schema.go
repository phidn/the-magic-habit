package global

import "mazic/pocketbase/tools/types"

type ResourceOption struct {
	Table         string
	FieldLabel    string
	FieldValue    string
	ExtraFields   []string
	SearchFields  []string
	SearchKeyword string
	Limit         int64
	OrderBy       string
}

type Option struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Code  string `json:"code,omitempty"`

	Actions types.JsonArray[any] `json:"actions"`
}
