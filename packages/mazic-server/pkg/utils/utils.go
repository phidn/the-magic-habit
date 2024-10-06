package utils

import (
	"strconv"
	"strings"
)

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

func ParseInt64(str string) int64 {
	i, _ := strconv.ParseInt(str, 10, 64)
	return i
}

func SplitString(str string, sep string) (string, string) {
	s := strings.Split(str, sep)
	return s[0], s[1]
}
