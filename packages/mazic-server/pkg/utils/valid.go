package utils

import (
	"fmt"
	"math"
	"strconv"
	"time"
)

func IsNumber(value any) bool {
	switch value.(type) {
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64:
		return true
	default:
		return false
	}
}

func IsValidBool(v any) bool {
	switch v.(type) {
	case bool:
		return true
	default:
		return false
	}
}

func IsValidTime(v any) bool {
	timeStringValue, ok := v.(string)
	if !ok {
		return false
	}

	_, err1 := time.Parse(time.RFC3339, timeStringValue)
	_, err2 := time.Parse(time.DateTime, timeStringValue)

	return err1 == nil || err2 == nil
}

func IsValidString(v any) bool {
	switch v.(type) {
	case string:
		return true
	default:
		return false
	}
}

func IsValidFloat(v any) bool {
	switch v.(type) {
	case float32, float64:
		return true
	default:
		if _, err := strconv.ParseFloat(fmt.Sprintf("%v", v), 64); err != nil {
			return false
		}
		return true
	}
}

func IsValidInt(v any) bool {
	switch v.(type) {
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64:
		return true
	default:
		floatValue, err := strconv.ParseFloat(fmt.Sprintf("%v", v), 64)
		if err != nil {
			return false
		}
		if math.Trunc(floatValue) != floatValue {
			return false
		}
		return true
	}
}

func IsValidUInt(v any) bool {
	if ok := IsValidInt(v); !ok {
		return false
	}

	switch v.(type) {
	case uint, uint8, uint16, uint32, uint64:
		return true
	case int, int8, int16, int32, int64:
		intValue, err := strconv.ParseInt(fmt.Sprintf("%v", v), 10, 64)
		if err != nil {
			return false
		}
		return intValue >= 0
	default:
		if floatValue, err := strconv.ParseFloat(fmt.Sprintf("%v", v), 64); err == nil {
			return floatValue >= 0
		}
	}

	return false
}
