package check_in

import (
	"github.com/golangthang/mazic-habit/pkg/resp"
	"github.com/golangthang/mazic-habit/pkg/schema"

	"github.com/labstack/echo/v5"
)

type CheckInController struct {
	CheckInService CheckInService
}

func NewCheckInController(checkInService CheckInService) *CheckInController {
	return &CheckInController{
		CheckInService: checkInService,
	}
}

func (controller *CheckInController) CheckIn(c echo.Context) error {
	checkInEntry := &schema.CheckIn{}
	if err := c.Bind(checkInEntry); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	if err := checkInEntry.Validate(); err != nil {
		return resp.NewBadRequestError(c, "Failed to validate request data.", err)
	}

	userId := c.Get("state.user_id").(string)

	_, err := controller.CheckInService.CheckIn(c.Request().Context(), userId, checkInEntry)
	if err != nil {
		return resp.NewApplicationError(c, "Failed to create checkIn.", err)
	}

	// checkInEntry.Id = record.Id
	// checkInEntry.Created = record.Created
	// checkInEntry.Updated = record.Updated

	return resp.NewApiCreated(c, checkInEntry, "The checkIn has been checked in.")
}

func (controller *CheckInController) DeleteCheckIn(c echo.Context) error {
	checkIn := &schema.CheckIn{}
	if err := c.Bind(&checkIn); err != nil {
		return resp.NewBadRequestError(c, "Failed to read request data.", err)
	}

	_, err := controller.CheckInService.DeleteCheckIn(c.Request().Context(), c.PathParam("id"))
	if err != nil {
		return resp.NewApplicationError(c, "Failed to delete checkIn.", err)
	}

	return resp.NewApiDeleted(c, "The checkIn has been deleted.")
}
