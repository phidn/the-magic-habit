package infrastructure

import (
	"fmt"
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
	fmt.Println(">>> Starting PocketBase server")
	return p.PocketBase.Start()
}
