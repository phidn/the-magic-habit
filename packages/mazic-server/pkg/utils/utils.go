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

func If[T any](condition bool, ifTrue T, ifFalse T) T {
	if condition {
		return ifTrue
	}
	return ifFalse
}

func IfFn[T any](condition bool, ifTrue func() T, ifFalse func() T) T {
	if condition {
		return ifTrue()
	}
	return ifFalse()
}

