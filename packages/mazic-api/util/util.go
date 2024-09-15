package util

import (
	"reflect"
	"slices"
)

func StructToMap(input interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	// Use reflect to get the value and type of the input
	val := reflect.ValueOf(input)
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	// Ensure the input is a struct
	if val.Kind() != reflect.Struct {
		return result
	}

	typ := val.Type()

	// Iterate over struct fields
	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldType := typ.Field(i)

		// Skip unexported fields
		if !field.CanInterface() {
			continue
		}

		// Handle embedded structs by recursion
		if field.Kind() == reflect.Struct {
			// Convert nested struct to map
			nestedMap := StructToMap(field.Interface())
			for k, v := range nestedMap {
				result[k] = v
			}
		} else {
			// Add field name and value to the map
			result[fieldType.Name] = field.Interface()
		}
	}

	return result
}

func RemoveNilValues(input map[string]interface{}) map[string]interface{} {
	for key, value := range input {
		// Check if the value is nil or if the value's kind is Ptr or Interface and its value is nil
		if value == nil || (reflect.ValueOf(value).Kind() == reflect.Ptr && reflect.ValueOf(value).IsNil()) {
			delete(input, key)
		}
	}
	return input
}

func StructsToInterfaceArray[T any](structs []T, excludeFields []string) [][]interface{} {
	interfaces := make([][]interface{}, len(structs))
	for i, s := range structs {
		v := reflect.ValueOf(s)
		interfaces[i] = make([]interface{}, v.NumField()-len(excludeFields))
		for j := 0; j < v.NumField(); j++ {
			field := v.Field(j)
			fieldType := v.Type().Field(j)
			if slices.Contains(excludeFields, fieldType.Name) {
				continue
			}
			interfaces[i][j] = field.Interface()
		}
	}
	return interfaces
}

func Contains(arr interface{}, elem interface{}) bool {
	switch reflect.TypeOf(arr).Kind() {
	case reflect.Slice:
		s := reflect.ValueOf(arr)
		for i := 0; i < s.Len(); i++ {
			if s.Index(i).Interface() == elem {
				return true
			}
		}
	}
	return false
}
