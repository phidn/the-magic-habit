package resp

import (
	"github.com/labstack/echo/v5"
)

type ApiResponse map[string]any

func NewApiSuccess(c echo.Context, code int, data interface{}) error {
	response := ApiResponse{
		"success": true,
		"code":    code,
	}

	if dataMap, ok := data.(map[string]interface{}); ok {
		for key, value := range dataMap {
			response[key] = value
		}
	}

	return c.JSON(code, response)
}
