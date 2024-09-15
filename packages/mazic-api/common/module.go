package common

import (
	entry_common "mazic/mazicapi/common/entry"

	"go.uber.org/fx"
)

var Module = fx.Options(fx.Provide(
	entry_common.NewEntryService,
	entry_common.NewEntryController,
))
