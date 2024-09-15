package entry_common

type ResourceFields struct {
	Table  string
	Fields []string
}

var resourceMap = map[string]ResourceFields{
	"ROLE": {
		Table:  "sys_role",
		Fields: []string{"id", "name"},
	},
}

var (
	allowedMimeRegex = []string{
		"image/*",
	}
)
