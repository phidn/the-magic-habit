package infrastructure

import (
	"go.uber.org/fx"
)

var Modules = fx.Options(
	fx.Provide(NewSupaStorage),
	fx.Provide(NewS3Storage),
	fx.Provide(NewMailer),
	fx.Provide(NewPocket),
	fx.Invoke(func(pocket *Pocket) error {
		return pocket.Start()
	}),
)
