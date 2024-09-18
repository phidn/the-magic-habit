package auth

import (
	"fmt"
	"mazic/pocketbase/core"
	"mazic/server/pkg/infrastructure"
	"net/http"

	"github.com/labstack/echo/v5"
)

type Auth struct {
	app *infrastructure.Pocket
}

func NewAuth(app *infrastructure.Pocket) *Auth {
	return &Auth{app: app}
}

func (a *Auth) Login(c echo.Context) error {
	record, _ := a.app.Dao().FindRecordById("sys_user", "2098074934189228032")
	return c.JSON(http.StatusOK, record)
}

func (a *Auth) SetupRoutes() {
	fmt.Println(">>> Registering auth routes")

	a.app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/mazic/auth/login", a.Login)
		return nil
	})
}
