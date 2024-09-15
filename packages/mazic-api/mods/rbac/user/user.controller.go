package user

import (
	"net/http"

	entry_common "mazic/mazicapi/common/entry"
	"mazic/mazicapi/pkg/valid_pointer"
	util "mazic/mazicapi/util"

	"github.com/labstack/echo/v4"
)

type UserController struct {
	UserService  *UserService
	EntryService *entry_common.EntryService
}

func NewUserController(userService *UserService, entryService *entry_common.EntryService) *UserController {
	return &UserController{
		UserService:  userService,
		EntryService: entryService,
	}
}

func (controller *UserController) GetList(c echo.Context) error {
	params := UserParamsSchema{}
	pagination := util.PaginationPage{}
	if err := util.ParseParamsPagination(c, &params, &pagination); err != nil {
		return util.ResError(c, err)
	}
	items, total, err := controller.UserService.GetList(c.Request().Context(), params, pagination)

	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	pagination.Total = total
	return util.ResPagination(c, items, pagination)
}

// @Router /api/users/:id [get]
func (controller *UserController) GetById(c echo.Context) error {
	item, err := controller.UserService.GetById(c.Request().Context(), c.Param("id"))
	if err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, item)
}

// @Router /api/users [post]
func (controller *UserController) CreateUser(c echo.Context) error {
	ctx := c.Request().Context()
	item := new(UserSchema)
	if err := util.ParseUpsert(c, item); err != nil {
		return util.ResError(c, err)
	}
	if err := item.Validate(); err != nil {
		return util.ResError(c, err, http.StatusBadRequest)
	}
	if err := controller.UserService.CreateUser(ctx, item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}

	return util.ResSuccess(c, item.Id)
}

// @Router /api/users/:id [put]
func (controller *UserController) UpdateUser(c echo.Context) error {
	ctx := c.Request().Context()
	item := new(UserSchema)
	if err := util.ParseJSON(c, item); err != nil {
		return util.ResError(c, err)
	}
	if err := item.Validate(); err != nil {
		return util.ResError(c, err, http.StatusBadRequest)
	}

	item.UpdatedBy = valid_pointer.PointerString(c.Get("state.user_id").(string))

	if err := controller.UserService.UpdateUser(ctx, c.Param("id"), item); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}

	return util.ResSuccess(c, nil)
}

// @Router /api/users/:id [delete]
func (controller *UserController) DeleteUser(c echo.Context) error {
	if err := controller.EntryService.Delete(c.Request().Context(), c.Param("id"), &UserSchema{}); err != nil {
		return util.ResError(c, err, http.StatusInternalServerError)
	}
	return util.ResSuccess(c, nil)
}
