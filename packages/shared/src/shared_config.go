package shared_config

import (
	"encoding/json"
	"fmt"
	permissions_schema "mazic/shared/src/config/permissions"
	"os"
	"path/filepath"
	"reflect"
)

type SharedConfig struct {
	Permissions permissions_schema.Permissions
}

var Config SharedConfig

func (config *SharedConfig) LoadConfig() error {
	path, err := filepath.Abs(filepath.Join("../shared", "src", "config", "permissions", "permissions.json"))
	if err != nil {
		return fmt.Errorf("error getting absolute path: %w", err)
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("error reading permissions file: %w", err)
	}
	err = json.Unmarshal(data, &config.Permissions)
	if err != nil {
		return fmt.Errorf("error unmarshalling permissions: %w", err)
	}

	return nil
}

func (config *SharedConfig) GetPermissionCode(resource, action string) string {
	permissionsValue := reflect.ValueOf(config.Permissions)

	resourceField := permissionsValue.FieldByName(resource)
	if !resourceField.IsValid() {
		return ""
	}
	actionField := resourceField.FieldByName(action)
	if !actionField.IsValid() {
		return ""
	}

	return actionField.String()
}
