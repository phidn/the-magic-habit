package resp

import (
	"mazic/server/pkg/schema"
	"net/http"

	"github.com/labstack/echo/v5"
)

type Meta struct {
	schema.Pagination
}

type ApiResponse struct {
	Success bool   `json:"success,omitempty"`
	Message string `json:"message,omitempty"`
	Data    any    `json:"data,omitempty"`
	Meta    Meta   `json:"meta,omitempty"`
}

func NewApiSuccess(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    data,
	})
}

func NewApiPagination(c echo.Context, result *schema.ResultPagination) error {
	return c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    result.Items,
		Meta:    Meta{Pagination: result.Pagination},
	})
}

func NewApiCreated(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Message: "the resource has been created",
		Data:    data,
	})
}

func NewApiDeleted(c echo.Context) error {
	return c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Message: "the resource has been deleted",
	})
}
