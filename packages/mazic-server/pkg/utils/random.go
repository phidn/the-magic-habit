package utils

import (
	cryptoRand "crypto/rand"
	"math/big"
	"strconv"

	mathRand "math/rand"

	"github.com/godruoyi/go-snowflake"
)

const (
	DefaultIdLength       = 15
	DefaultIdAlphabet     = "abcdefghijklmnopqrstuvwxyz0123456789"
	DefaultRandomAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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

func PseudorandomString(length int) string {
	return PseudorandomStringWithAlphabet(length, DefaultRandomAlphabet)
}

func PseudorandomStringWithAlphabet(length int, alphabet string) string {
	b := make([]byte, length)
	max := len(alphabet)

	for i := range b {
		b[i] = alphabet[mathRand.Intn(max)]
	}

	return string(b)
}
