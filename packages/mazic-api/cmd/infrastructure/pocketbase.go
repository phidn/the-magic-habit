package infrastructure

import (
	"log"
	"mazic/pocketbase"
)

type PocketbaseApp struct {
	*pocketbase.PocketBase
}

func NewPocketbaseApp() *PocketbaseApp {
	app := pocketbase.New()
	err := app.Bootstrap()

	if err != nil {
		log.Fatalf("Error bootstrapping app: %v", err)
	}

	return &PocketbaseApp{app}
}
