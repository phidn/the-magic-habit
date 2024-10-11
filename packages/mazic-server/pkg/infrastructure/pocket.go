package infrastructure

import (
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/cmd"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

type Pocket struct {
	*pocketbase.PocketBase
}

func NewPocket() *Pocket {
	app := pocketbase.New()
	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	app.RootCmd.AddCommand(cmd.NewServeCommand(app, false))

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		regular := color.New()
		regular.Printf("├─ REST API: %s\n", color.CyanString("http://127.0.0.1:8090/api/"))
		regular.Printf("├─ ADMIN UI: %s\n", color.CyanString("http://127.0.0.1:8090/_/"))
		regular.Printf("├─ WEB UI: %s\n", color.CyanString("http://127.0.0.1:8090/web/"))
		return nil
	})

	return &Pocket{app}
}

func (p *Pocket) Start() error {
	return p.PocketBase.Start()
}
