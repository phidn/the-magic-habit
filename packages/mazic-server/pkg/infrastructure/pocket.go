package infrastructure

import (
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/web"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
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
		regular.Printf("├─ REST API: %s\n", color.CyanString(config.Config.AppDomain+"/api/"))
		regular.Printf("├─ ADMIN UI: %s\n", color.CyanString(config.Config.AppDomain+"/_/"))
		regular.Printf("├─ WEB UI: %s\n", color.CyanString(config.Config.AppDomain+"/"))
		return nil
	})

	var indexFallback bool
	app.RootCmd.PersistentFlags().BoolVar(
		&indexFallback,
		"indexFallback",
		true,
		"fallback the request to index.html on missing static path (eg. when pretty urls are used with SPA)",
	)

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(web.DistDirFS, indexFallback))
		return nil
	})

	return &Pocket{app}
}

func (p *Pocket) Start() error {
	return p.PocketBase.Start()
}
