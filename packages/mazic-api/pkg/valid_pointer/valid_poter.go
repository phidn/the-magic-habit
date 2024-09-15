package valid_pointer

import "time"

func Bool(in *bool) bool {
	if in == nil {
		return false
	}
	return *in
}

func String(in *string) string {
	if in == nil {
		return ""
	}
	return *in
}

func PointerString(in string) *string {
	if in == "" {
		return nil
	}
	return &in
}

func Int(in *int) int {
	if in == nil {
		return 0
	}
	return *in
}

func PointerInt(in int) *int {
	return &in
}

func Time(in *time.Time) time.Time {
	if in == nil {
		return time.Time{}
	}
	return *in
}

func PointerTime(in time.Time) *time.Time {
	return &in
}
