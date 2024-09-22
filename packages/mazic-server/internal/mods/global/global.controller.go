package global

import (
	"mazic/server/pkg/resp"
	"mazic/server/pkg/utils"

	"github.com/labstack/echo/v5"
)

type GlobalController struct {
	GlobalService *GlobalService
}

func NewGlobalController(userService *GlobalService) *GlobalController {
	return &GlobalController{
		GlobalService: userService,
	}
}

func (controller *GlobalController) ListOptions(c echo.Context) error {
	queryParams := c.QueryParams()
	resource := resourceMap[queryParams.Get("resource")]

	if resource.Table == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	if resource.FieldLabel == "" || resource.FieldValue == "" {
		return resp.NewApplicationError(c, "", nil)
	}

	if queryParams.Get("search") != "" {
		resource.SearchKeyword = queryParams.Get("search")
	}
	if queryParams.Get("limit") != "" {
		resource.Limit = utils.ParseInt64(queryParams.Get("limit"))
	}

	options, err := controller.GlobalService.ListOptions(resource)
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}

	return resp.NewApiSuccess(c, options)
}

func (controller *GlobalController) Upload(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}
	link, err := controller.GlobalService.Upload(file)
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}

	return resp.NewApiSuccess(c, link)
}
