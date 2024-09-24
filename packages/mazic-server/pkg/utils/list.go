package utils

func Contains[T comparable](slice []T, element T) bool {
	for _, e := range slice {
		if e == element {
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
