package migrations

import (
	"fmt"

	"mazic/pocketbase/daos"
	"mazic/pocketbase/models"
	"mazic/pocketbase/models/schema"

	"github.com/pocketbase/dbx"
)

// Normalizes old single and multiple values of MultiValuer fields (file, select, relation).
func init() {
	AppMigrations.Register(func(db dbx.Builder) error {
		return normalizeMultivaluerFields(db)
	}, func(db dbx.Builder) error {
		return nil
	})
}

func normalizeMultivaluerFields(db dbx.Builder) error {
	dao := daos.New(db)

	collections := []*models.Collection{}
	if err := dao.CollectionQuery().All(&collections); err != nil {
		return err
	}

	for _, c := range collections {
		if c.IsView() {
			// skip view collections
			continue
		}

		for _, f := range c.Schema.Fields() {
			opt, ok := f.Options.(schema.MultiValuer)
			if !ok {
				continue
			}

			var updateQuery *dbx.Query
			// !CHANGED: We write json functions for postgres in migration files to support json equivalent operations from Pocketbase.
			if opt.IsMultiple() {
				updateQuery = dao.DB().NewQuery(fmt.Sprintf(
					`UPDATE {{%s}} set [[%s]] = (
						CASE
							WHEN COALESCE([[%s]], '') = ''
							THEN '[]'
							ELSE (
								CASE
								WHEN json_valid([[%s]]) = true AND json_array_length([[%s]]::json) > 0
								THEN [[%s]]
								ELSE jsonb_build_array([[%s]])
								END
							)
						END
					)`,
					c.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
				))
			} else {
				updateQuery = dao.DB().NewQuery(fmt.Sprintf(
					// !CHANGED: set-returning functions are not allowed in UPDATE at character
					`UPDATE {{%s}} SET [[%s]] = (
						CASE
							WHEN COALESCE([[%s]], '[]') = '[]'
							THEN ''
							ELSE (
								CASE
								WHEN json_valid([[%s]]) = true AND json_array_length([[%s]]::json) > 0
									THEN (SELECT COALESCE([[%s]]::json->>0, '')::text)
									ELSE [[%s]]
								END
							)
						END
					)`,
					c.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
					f.Name,
				))
			}

			if _, err := updateQuery.Execute(); err != nil {
				return err
			}
		}
	}

	// trigger view query update after the records normalization
	// (ignore save error in case of invalid query to allow users to change it from the UI)
	for _, c := range collections {
		if !c.IsView() {
			continue
		}

		dao.SaveCollection(c)
	}

	return nil
}
