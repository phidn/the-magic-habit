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

		collection, err := dao.FindCollectionByNameOrId("g8x48kl0jmq18zf")
		if err != nil {
			return err
		}

		// add
		new_template := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "sxcslvfb",
			"name": "template",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_template); err != nil {
			return err
		}
		collection.Schema.AddField(new_template)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("g8x48kl0jmq18zf")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("sxcslvfb")

		return dao.SaveCollection(collection)
	})
}
