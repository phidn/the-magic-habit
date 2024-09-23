package resp

import (
	"mazic/server/pkg/schema"
	"mazic/server/pkg/utils"
	"net/http"

	"github.com/labstack/echo/v5"
)

type Meta struct {
	schema.Pagination `json:"pagination,omitempty"`
}

type ApiResponse struct {
	Success bool   `json:"success,omitempty"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
	Meta    *Meta  `json:"meta,omitempty"`
}

func NewApiSuccess(c echo.Context, data interface{}, message string) error {
	return c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func NewApiPagination(c echo.Context, result *schema.ListItems) error {
	return c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    result.Items,
		Meta:    &Meta{Pagination: result.Pagination},
	})
}

func NewApiCreated(c echo.Context, data interface{}, message string) error {
	return c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Message: utils.If(message != "", message, "The resource has been created."),
		Data:    data,
	})
}

func NewApiDeleted(c echo.Context, message string) error {
	return c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Message: utils.If(message != "", message, "The resource has been deleted."),
	})
}
