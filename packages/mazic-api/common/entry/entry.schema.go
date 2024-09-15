package entry_common

type QueryOptions struct {
	SelectFields []string
	OmitFields   []string
}

type Filters struct {
	Search        map[string]interface{}
	Filters       map[string]interface{}
	Sort          *string
	SelectFields  []string
	OmitFields    []string
	PreloadFields []string
}

type Params struct {
	Page         int
	PageSize     int
	Search       map[string]interface{}
	Filters      map[string]interface{}
	Sort         *string
	SelectFields []string
	OmitFields   []string
}

type Condition struct {
	Key   string
	Value interface{}
}

type EntryOptionParams struct {
	Resource string `query:"resource"`
}

type EntryOption struct {
	Label string `json:"label"`
	Value string `json:"value"`
}
