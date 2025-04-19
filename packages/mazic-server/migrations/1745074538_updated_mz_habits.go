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
		new_goal_number := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "zwzpumcl",
			"name": "goal_number",
			"type": "number",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"noDecimal": false
			}
		}`), new_goal_number); err != nil {
			return err
		}
		collection.Schema.AddField(new_goal_number)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("g8x48kl0jmq18zf")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("zwzpumcl")

		return dao.SaveCollection(collection)
	})
}
