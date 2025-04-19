package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models/schema"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("l05ydbhubwy3li9")
		if err != nil {
			return err
		}

		if err := json.Unmarshal([]byte(`[
			"CREATE UNIQUE INDEX ` + "`" + `idx_6nFVz4F` + "`" + ` ON ` + "`" + `mz_check_in` + "`" + ` (\n  ` + "`" + `habit_id` + "`" + `,\n  ` + "`" + `date` + "`" + `,\n  ` + "`" + `criterion_id` + "`" + `\n)"
		]`), &collection.Indexes); err != nil {
			return err
		}

		// add
		new_criterion_id := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "txerxnv2",
			"name": "criterion_id",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "ifqezc49lewaupo",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": 1,
				"displayFields": null
			}
		}`), new_criterion_id); err != nil {
			return err
		}
		collection.Schema.AddField(new_criterion_id)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("l05ydbhubwy3li9")
		if err != nil {
			return err
		}

		if err := json.Unmarshal([]byte(`[
			"CREATE UNIQUE INDEX ` + "`" + `idx_6nFVz4F` + "`" + ` ON ` + "`" + `mz_check_in` + "`" + ` (\n  ` + "`" + `habit_id` + "`" + `,\n  ` + "`" + `date` + "`" + `\n)"
		]`), &collection.Indexes); err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("txerxnv2")

		return dao.SaveCollection(collection)
	})
}
