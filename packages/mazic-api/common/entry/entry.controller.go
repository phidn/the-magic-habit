package entry_common

import (
	"mazic/mazicapi/cmd/infrastructure"
	"mazic/mazicapi/pkg/errors"
	"mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type EntryController struct {
	EntryService  *EntryService
	PocketbaseApp *infrastructure.PocketbaseApp
}

func NewEntryController(entryService *EntryService, pocketbaseApp *infrastructure.PocketbaseApp) *EntryController {
	return &EntryController{
		EntryService:  entryService,
		PocketbaseApp: pocketbaseApp,
	}
}

// @Router /api/entry/options [get]
func (controller *EntryController) GetOptions(c echo.Context) error {
	params := EntryOptionParams{}
	if err := util.ParseQuery(c, &params); err != nil {
		return util.ResError(c, err)
	}

	resource := params.Resource
	table := resourceMap[resource].Table
	if table == "" {
		return util.ResError(c, errors.BadRequest("", "resource %s not found", resource))
	}

	fields := resourceMap[resource].Fields
	if len(fields) != 2 {
		return util.ResError(c, errors.BadRequest("", "resource %s fields not found", resource))
	}

	options, err := controller.EntryService.GetOptions(c.Request().Context(), table, fields)
	if err != nil {
		return util.ResError(c, err)
	}

	return util.ResSuccess(c, options)
}

// @Router /api/entry/upload [post]
func (controller *EntryController) Upload(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return util.ResError(c, err)
	}
	link, err := controller.EntryService.Upload(c.Request().Context(), file)
	if err != nil {
		return util.ResError(c, err)
	}

	return util.ResSuccess(c, link)
}

func (controller *EntryController) GetTags(c echo.Context) error {
	dao := controller.PocketbaseApp.Dao()
	records, err := dao.FindRecordsByExpr("tags")
	if err != nil {
		return util.ResError(c, err)
	}

	return util.ResSuccess(c, records)
}
