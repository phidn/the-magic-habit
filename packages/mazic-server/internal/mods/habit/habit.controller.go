package habit

import (
	"mazic/server/pkg/resp"

	"github.com/labstack/echo/v5"
)

type HabitController struct {
	HabitService HabitService
}

func NewHabitController(habitService HabitService) *HabitController {
	return &HabitController{
		HabitService: habitService,
	}
}

func (controller *HabitController) Find(c echo.Context) error {
	result, err := controller.HabitService.Find(c.Request().Context(), c.QueryParams())
	if err != nil {
		return resp.NewApplicationError(c, "Failed to get habits.", err)
	}

	return resp.NewApiPagination(c, result)
}

func (controller *HabitController) GetById(c echo.Context) error {
	recordId := c.PathParam("id")
	if recordId == "" {
		return resp.NewNotFoundError(c, "", nil)
	}
	habit, err := controller.HabitService.FindOne(c.Request().Context(), recordId)
	if err != nil || habit == nil {
		return resp.NewNotFoundError(c, "", err)
	}

	return resp.NewApiSuccess(c, habit, "")
}

func (controller *HabitController) Create(c echo.Context) error {
	habit := &Habit{}
	if err := c.Bind(habit); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := habit.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.HabitService.Create(c.Request().Context(), habit)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create habit.", err)
	}

	habit.Id = record.Id
	habit.Created = record.Created
	habit.Updated = record.Updated

	return resp.NewApiCreated(c, habit, "The habit has been created.")
}

func (controller *HabitController) Update(c echo.Context) error {
	habit := &Habit{}
	if err := c.Bind(habit); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}
	if err := habit.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}
	record, err := controller.HabitService.Update(c.Request().Context(), c.PathParam("id"), habit)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to update habit.", err)
	}

	habit.Id = record.Id
	habit.Created = record.Created
	habit.Updated = record.Updated

	return resp.NewApiSuccess(c, habit, "The habit has been updated.")
}

func (controller *HabitController) Delete(c echo.Context) error {
	habit := &Habit{}
	if err := c.Bind(&habit); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.HabitService.Delete(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete habit.", err)
	}

	return resp.NewApiDeleted(c, "The habit has been deleted.")
}
