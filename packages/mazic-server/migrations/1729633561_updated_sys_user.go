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

		collection, err := dao.FindCollectionByNameOrId("2098443258622377984")
		if err != nil {
			return err
		}

		// add
		new_verification_code := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "n2yxbwgv",
			"name": "verification_code",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_verification_code); err != nil {
			return err
		}
		collection.Schema.AddField(new_verification_code)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("2098443258622377984")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("n2yxbwgv")

		return dao.SaveCollection(collection)
	})
}
