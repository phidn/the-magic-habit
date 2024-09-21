package schema

type Pagination struct {
	Page      int `json:"page"`
	PageCount int `json:"pageCount"`
	PageSize  int `json:"pageSize"`
	Total     int `json:"total"`
}

type ResultPagination struct {
	Pagination
	Items any `json:"items"`
}
