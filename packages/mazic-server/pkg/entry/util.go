package entry

import (
	"errors"
	"reflect"

	"github.com/pocketbase/pocketbase/models"
)

func (entry *entry) getModelFromSlice(slices any) (models.Model, error) {
	sliceType := reflect.TypeOf(slices)
	if sliceType.Kind() != reflect.Ptr || sliceType.Elem().Kind() != reflect.Slice {
		return nil, errors.New("expected a pointer to a slice")
	}

	elemType := sliceType.Elem().Elem()

	if elemType.Kind() == reflect.Ptr {
		modelPointer := reflect.New(elemType.Elem()).Interface()
		if model, ok := modelPointer.(models.Model); ok {
			return model, nil
		}
	} else {
		modelPointer := reflect.New(elemType).Interface()
		if model, ok := modelPointer.(models.Model); ok {
			return model, nil
		}
	}

	return nil, errors.New("unable to infer model from slice")
}

func Filter[T any](slice []T, predicate func(T) bool) []T {
	var result []T
	for _, e := range slice {
		if predicate(e) {
			result = append(result, e)
		}
	}
	return result
}
