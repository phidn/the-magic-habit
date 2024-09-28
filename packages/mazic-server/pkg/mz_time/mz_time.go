package mz_time

import "time"

const (
	YYYYMMDD          = "YYYY-MM-DD"
	YYYYMMDDHHmmss    = "YYYY-MM-DD HH:mm:ss"
	YYYYMMDDHHmmssSSS = "YYYY-MM-DD HH:mm:ss.SSS"
)

func TimeFormat(t time.Time, format string) string {

	switch format {
	case YYYYMMDD:
		return t.Format("2006-01-02")
	case YYYYMMDDHHmmss:
		return t.Format("2006-01-02 15:04:05")
	case YYYYMMDDHHmmssSSS:
		return t.Format("2006-01-02 15:04:05.000")
	}

	return t.Format(format)
}

func StartOfWeek(t time.Time) time.Time {
	offset := int(time.Sunday - t.Weekday())
	if offset > 0 {
		offset = -6
	}
	startOfWeek := t.AddDate(0, 0, offset)
	return startOfWeek
}

func EndOfWeek(t time.Time) time.Time {
	offset := int(time.Saturday - t.Weekday())
	if offset < 0 {
		offset = 6
	}
	endOfWeek := t.AddDate(0, 0, offset)
	return endOfWeek
}
