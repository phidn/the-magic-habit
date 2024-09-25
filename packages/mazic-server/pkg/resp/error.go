package resp

import (
	"mazic/server/config"
	"mazic/server/pkg/utils"
	"net/http"
	"strings"

	"github.com/labstack/echo/v5"
)

type Error struct {
	Code    int    `json:"code,omitempty"`
	TraceId string `json:"trace_id,omitempty"`
	Detail  any    `json:"detail,omitempty"`
}

type ApiError struct {
	Success bool   `json:"success"`
	Name    string `json:"name,omitempty"`
	Message string `json:"message,omitempty"`
	Error   Error  `json:"error,omitempty"`
}

func NewApplicationError(c echo.Context, message string, err any) error {
	message = utils.If(message == "", "An application error occurred.s", message)
	return NewApiError(c, http.StatusInternalServerError, "ApplicationError", message, err)
}

func NewNotFoundError(c echo.Context, message string, err any) error {
	message = utils.If(message == "", "Resource not found.", message)
	return NewApiError(c, http.StatusNotFound, "NotFoundError", message, err)
}

func NewBadRequestError(c echo.Context, message string, err any) error {
	message = utils.If(message == "", "Bad request.", message)
	return NewApiError(c, http.StatusBadRequest, "BadRequestError", message, err)
}

func NewForbiddenError(c echo.Context, message string, err any) error {
	message = utils.If(message == "", "Forbidden access.", message)
	return NewApiError(c, http.StatusForbidden, "ForbiddenError", message, err)
}

func NewUnauthorizedError(c echo.Context, message string, err any) error {
	message = utils.If(message == "", "Unauthorized", message)
	return NewApiError(c, http.StatusUnauthorized, "UnauthorizedError", message, err)
}

func NewApiError(c echo.Context, code int, name, message string, err any) error {
	traceId := utils.RandomString()
	if utils.IsError(err) {
		err = err.(error).Error()
	}
	// TODO: Log error

	return c.JSON(code, ApiError{
		Success: false,
		Name:    utils.If(name == "", "ApplicationError", name),
		Message: strings.TrimSpace(message),
		Error: Error{
			Code:    code,
			TraceId: traceId,
			Detail:  utils.If(config.Config.IsDevelopment, err, nil),
		},
	})
}
