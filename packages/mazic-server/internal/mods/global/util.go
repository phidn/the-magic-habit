package global

import (
	"regexp"
)

/*
Default: FieldLabel = "name", FieldValue = "id", SearchFields = ["name"]
*/
var resourceMap = map[string]ResourceOption{
	"ROLE": {
		Table: "sys_role",
	},
	"ACTION": {
		Table:       "sys_action",
		ExtraFields: []string{"code"},
	},
	"RESOURCE": {
		Table:       "sys_resource",
		ExtraFields: []string{"code", "actions"},
	},
	"RESOURCE_NAME": {
		Table:       "sys_resource",
		FieldValue:  "name",
		ExtraFields: []string{"code", "actions"},
	},
}

func validateMimeType(mimeType string, regexArray ...string) bool {
	for _, regex := range regexArray {
		if regexp.MustCompile(regex).MatchString(mimeType) {
			return true
		}
	}
	return false
}
