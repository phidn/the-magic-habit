package config

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"

	permissions_schema "github.com/golangthang/mazic-habit/shared/src/config/permissions"
)

type Config struct {
	Permissions permissions_schema.Permissions
}

func (config *Config) LoadConfig() error {
	path, err := filepath.Abs(filepath.Join("../mazic-shared", "src", "config", "permissions", "permissions.json"))
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

func (config *Config) GetPermissionCode(resource, action string) string {
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
