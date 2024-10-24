package utils

import (
	"bytes"
	"html/template"
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

func ResolveTemplateContent(data any, content ...string) (string, error) {
	if len(content) == 0 {
		return "", nil
	}

	t := template.New("inline_template")

	var parseErr error
	for _, v := range content {
		t, parseErr = t.Parse(v)
		if parseErr != nil {
			return "", parseErr
		}
	}

	var wr bytes.Buffer

	if executeErr := t.Execute(&wr, data); executeErr != nil {
		return "", executeErr
	}

	return wr.String(), nil
}
