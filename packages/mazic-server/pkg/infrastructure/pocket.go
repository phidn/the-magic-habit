package infrastructure

import (
	"mazic/pocketbase"
)

type Pocket struct {
	*pocketbase.PocketBase
}

func NewPocket() *Pocket {
	app := pocketbase.New()
	return &Pocket{app}
}

func (p *Pocket) Start() error {
	return p.PocketBase.Start()
}
