package utils

import (
	cryptoRand "crypto/rand"
	"math/big"
	"strconv"

	"github.com/godruoyi/go-snowflake"
)

const (
	// DefaultIdLength is the default length of the generated model id.
	DefaultIdLength = 15

	// DefaultIdAlphabet is the default characters set used for generating the model id.
	DefaultIdAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
)

func RandomSnowflakeId() string {
	id := snowflake.ID()
	return strconv.FormatUint(id, 10)
}

func RandomStringWithAlphabet(length int, alphabet string) string {
	b := make([]byte, length)
	max := big.NewInt(int64(len(alphabet)))

	for i := range b {
		n, err := cryptoRand.Int(cryptoRand.Reader, max)
		if err != nil {
			panic(err)
		}
		b[i] = alphabet[n.Int64()]
	}

	return string(b)
}

func RandomString() string {
	return RandomStringWithAlphabet(DefaultIdLength, DefaultIdAlphabet)
}
