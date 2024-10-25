package utils

import "reflect"

func Contains[T comparable](slice []T, element T) bool {
	for _, e := range slice {
		if e == element {
			return true
		}
	}
	return false
}

func ExistInSlice[T comparable](item T, list []T) bool {
	for _, v := range list {
		if v == item {
			return true
		}
	}

	return false
}

func SliceEqual[T comparable](slice1 []T, slice2 []T) bool {
	if len(slice1) != len(slice2) {
		return false
	}

	for i, e := range slice1 {
		if e != slice2[i] {
			return false
		}
	}

	return true
}

func ToInterfaceSlice[T any](list []T) []any {
	result := make([]any, len(list))

	for i := range list {
		result[i] = list[i]
	}

	return result
}

func ExtractFieldToSlice[T any](list []T, key string) []interface{} {
	result := []interface{}{}
	for _, item := range list {
		val := reflect.ValueOf(item)
		if val.Kind() == reflect.Ptr {
			val = val.Elem()
		}
		field := val.FieldByName(key)
		if field.IsValid() {
			result = append(result, field.Interface())
		}
	}
	return result
}

func ConvertToStringSlice(input []interface{}) []string {
	result := []string{}
	for _, item := range input {
		if str, ok := item.(string); ok {
			result = append(result, str)
		}
	}
	return result
}

func ConvertToIntSlice(input []interface{}) []int {
	result := []int{}
	for _, item := range input {
		if i, ok := item.(int); ok {
			result = append(result, i)
		}
	}
	return result
}

func ConvertToFloat64Slice(input []interface{}) []float64 {
	result := []float64{}
	for _, item := range input {
		if f, ok := item.(float64); ok {
			result = append(result, f)
		}
	}
	return result
}

func Reduce[T, M any](s []T, f func(M, T) M, initValue M) M {
	acc := initValue
	for _, v := range s {
		acc = f(acc, v)
	}
	return acc
}

func Min(list []interface{}) float64 {
	_list := ConvertToFloat64Slice(list)
	if len(_list) == 0 {
		return 0
	}
	min := _list[0]
	for _, v := range _list {
		if v < min {
			min = v
		}
	}
	return min
}

func Max(list []interface{}) float64 {
	_list := ConvertToFloat64Slice(list)
	if len(_list) == 0 {
		return 0
	}
	max := _list[0]
	for _, v := range _list {
		if v > max {
			max = v
		}
	}
	return max
}

func Avg(list []interface{}) float64 {
	_list := ConvertToFloat64Slice(list)
	sum := Reduce(_list, func(acc float64, v float64) float64 {
		return acc + float64(v)
	}, 0.0)
	return sum / float64(len(list))
}
