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
		new_criterions := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "nthueekk",
			"name": "criterions",
			"type": "relation",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"collectionId": "ifqezc49lewaupo",
				"cascadeDelete": false,
				"minSelect": null,
				"maxSelect": null,
				"displayFields": null
			}
		}`), new_criterions); err != nil {
			return err
		}
		collection.Schema.AddField(new_criterions)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("g8x48kl0jmq18zf")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("nthueekk")

		return dao.SaveCollection(collection)
	})
}
