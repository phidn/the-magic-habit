package global

type ResourceOption struct {
	Table         string
	FieldLabel    string
	FieldValue    string
	SearchFields  []string
	SearchKeyword string
	Limit         int64
	OrderBy       string
}

type Option struct {
	Label string `json:"label"`
	Value string `json:"value"`
}
