package global

import "regexp"

var resourceMap = map[string]ResourceOption{
	"ROLE": {
		Table:        "sys_role",
		FieldLabel:   "name",
		FieldValue:   "id",
		SearchFields: []string{"name"},
	},
	"ACTION": {
		Table:        "sys_action",
		FieldLabel:   "name",
		FieldValue:   "id",
		SearchFields: []string{"name"},
	},
}

var (
	allowedMimeRegex = []string{
		"image/*",
	}
)

func validateMimeType(mimeType string, allowedMimeRegex []string) bool {
	for _, regex := range allowedMimeRegex {
		if !regexp.MustCompile(regex).MatchString(mimeType) {
			return false
		}
	}
	return true
}
