package util

import (
	"bytes"
	"encoding/json"
	"io"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/pkg/valid_pointer"

	"github.com/labstack/echo/v4"
)

func ParseQuery(c echo.Context, params interface{}) error {
	if err := c.Bind(params); err != nil {
		return errors.BadRequest("", "Failed to parse query: %s", err.Error())
	}
	return nil
}

func ParsePagination(c echo.Context, pagination *PaginationPage) error {
	if err := c.Bind(pagination); err != nil {
		return errors.BadRequest("", "Failed to parse pagination: %s", err.Error())
	}

	if pagination.Page == 0 {
		pagination.Page = 1
	}
	if pagination.PageSize == 0 {
		pagination.PageSize = 10
	}

	return nil
}

func ParseJSON(c echo.Context, data interface{}) error {
	if err := c.Bind(data); err != nil {
		return errors.BadRequest("", "Failed to parse json: %s", err.Error())
	}
	return nil
}

func ParseUpsert(c echo.Context, data interface{}) error {
	var raw map[string]interface{}
	if err := json.NewDecoder(c.Request().Body).Decode(&raw); err != nil {
		return errors.BadRequest("", "Failed to parse json: %s", err.Error())
	}

	userID, ok := c.Get("state.user_id").(string)
	if !ok {
		return errors.BadRequest("", "User ID not found in context")
	}

	if raw["id"] == nil || raw["id"] == "" {
		raw["id"] = NewUuid()
		raw["created_by"] = userID
	} else {
		raw["updated_by"] = valid_pointer.PointerString(userID)
	}

	modifiedJSON, err := json.Marshal(raw)
	if err != nil {
		return errors.BadRequest("", "Failed to encode json: %s", err.Error())
	}

	// Replace the request body with the modified JSON
	c.Request().Body = io.NopCloser(bytes.NewBuffer(modifiedJSON))

	if err := c.Bind(data); err != nil {
		return errors.BadRequest("", "Failed to parse json: %s", err.Error())
	}
	return nil
}

func ParseParamsPagination(c echo.Context, params interface{}, pagination *PaginationPage) error {
	if err := ParseQuery(c, params); err != nil {
		return errors.BadRequest("", "Failed to parse query: %s", err.Error())
	}
	if err := ParsePagination(c, pagination); err != nil {
		return errors.BadRequest("", "Failed to parse pagination: %s", err.Error())
	}
	return nil
}
