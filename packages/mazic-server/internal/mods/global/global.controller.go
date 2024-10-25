package global

import (
	"github.com/golangthang/mazic-habit/pkg/infrastructure"
	"github.com/golangthang/mazic-habit/pkg/resp"
	"github.com/golangthang/mazic-habit/pkg/utils"

	"github.com/labstack/echo/v5"
)

type GlobalController struct {
	GlobalService GlobalService
	S3            *infrastructure.S3Storage
}

func NewGlobalController(globalService GlobalService, s3 *infrastructure.S3Storage) *GlobalController {
	return &GlobalController{
		GlobalService: globalService,
		S3:            s3,
	}
}

func (controller *GlobalController) ListOptions(c echo.Context) error {
	queryParams := c.QueryParams()
	resource := resourceMap[queryParams.Get("resource")]

	if resource.Table == "" {
		return resp.NewApplicationError(c, "", nil)
	}

	if queryParams.Get("search") != "" {
		resource.SearchKeyword = queryParams.Get("search")
	}
	if queryParams.Get("limit") != "" {
		resource.Limit = utils.ParseInt64(queryParams.Get("limit"))
	}

	options, err := controller.GlobalService.ListOptions(c.Request().Context(), resource)
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}

	return resp.NewApiSuccess(c, options, "")
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

	return resp.NewApiSuccess(c, link, "")
}

func (controller *GlobalController) UploadS3(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}
	link, err := controller.GlobalService.UploadS3(file)
	if err != nil {
		return resp.NewApplicationError(c, "", err)
	}

	return resp.NewApiSuccess(c, link, "")
}

func (controller *GlobalController) GetFile(c echo.Context) error {
	fileName := c.PathParam("file_name")
	return controller.S3.Serve(c.Response(), c.Request(), "uploads/"+fileName, fileName)
}
