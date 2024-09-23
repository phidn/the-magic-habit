package entry

import (
	"errors"
	"mazic/pocketbase/models"
	"reflect"
)

func (entry *Entry) getModelFromSlice(slices any) (models.Model, error) {
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
