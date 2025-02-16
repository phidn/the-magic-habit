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

		collection, err := dao.FindCollectionByNameOrId("ypaql8j0r6u4rcq")
		if err != nil {
			return err
		}

		// add
		new_timezone := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "zccejsne",
			"name": "timezone",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_timezone); err != nil {
			return err
		}
		collection.Schema.AddField(new_timezone)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ypaql8j0r6u4rcq")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("zccejsne")

		return dao.SaveCollection(collection)
	})
}
