package util

import (
	"mazic/mazicapi/constants"
	"mazic/mazicapi/pkg/errors"
	"unicode"
)

func ValidatePassword(value interface{}) error {
	pass := value.(string)
	var (
		upp, low, num, sym bool
		tot                uint8
	)

	for _, char := range pass {
		switch {
		case unicode.IsUpper(char):
			upp = true
			tot++
		case unicode.IsLower(char):
			low = true
			tot++
		case unicode.IsNumber(char):
			num = true
			tot++
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			sym = true
			tot++
		default:
			return errors.BadRequest("", constants.ERR_PASSWORD_INVALID)
		}
	}

	if !upp || !low || !num || !sym || tot < 8 {
		return errors.BadRequest("", constants.ERR_PASSWORD_INVALID)

	}

	return nil
}
