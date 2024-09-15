package util

import (
	"net/http"

	json "mazic/mazicapi/pkg/encoding"
	"mazic/mazicapi/pkg/errors"

	"github.com/labstack/echo/v4"
)

type ResponseSchema struct {
	Success bool          `json:"success"`
	Data    interface{}   `json:"data,omitempty"`
	Meta    *Meta         `json:"meta,omitempty"`
	Error   *errors.Error `json:"error,omitempty"`
}

type Meta struct {
	Pagination *PaginationPage `json:"pagination,omitempty"`
}

type PaginationPage struct {
	Total     int64 `json:"total" query:"total"`
	Page      int   `json:"page" query:"page" default:"1"`
	PageCount int   `json:"pageCount" query:"pageCount"`
	PageSize  int   `json:"pageSize" query:"pageSize" default:"10"`
}

func ResJSON(c echo.Context, status int, v interface{}) error {
	buf, err := json.Marshal(v)
	if err != nil {
		return err
	}
	if err := c.JSONBlob(status, buf); err != nil {
		return err
	}
	return nil
}

func ResSuccess(c echo.Context, data interface{}) error {
	return ResJSON(c, http.StatusOK, ResponseSchema{
		Success: true,
		Data:    data,
	})
}

func ResPagination(c echo.Context, data interface{}, pagination PaginationPage) error {
	pagination.PageCount = int(pagination.Total) / pagination.PageSize
	if pagination.Total%int64(pagination.PageSize) > 0 {
		pagination.PageCount++
	}
	return ResJSON(c, http.StatusOK, ResponseSchema{
		Success: true,
		Data:    data,
		Meta:    &Meta{Pagination: &pagination},
	})
}

func ResError(c echo.Context, err error, status ...int) error {
	var ierr *errors.Error
	if e, ok := errors.As(err); ok {
		ierr = e
	} else {
		ierr = errors.FromError(errors.InternalServerError("", err.Error()))
	}

	code := int(ierr.StatusCode)
	if len(status) > 0 {
		code = status[0]
	}
	ierr.StatusCode = int32(code)
	return ResJSON(c, code, ResponseSchema{Error: ierr})
}

func ResOK(c echo.Context) error {
	return ResJSON(c, http.StatusOK, ResponseSchema{
		Success: true,
	})
}
