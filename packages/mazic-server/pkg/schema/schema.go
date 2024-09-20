package schema

type ResultMeta struct {
	Page      int `json:"page"`
	PageCount int `json:"pageCount"`
	PageSize  int `json:"pageSize"`
	Total     int `json:"total"`
}

type Result struct {
	ResultMeta
	Items any `json:"items"`
}
