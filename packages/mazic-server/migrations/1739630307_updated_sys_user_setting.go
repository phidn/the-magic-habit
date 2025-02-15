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
		new_telegram_bot_token := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ofuwiaxv",
			"name": "telegram_bot_token",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_telegram_bot_token); err != nil {
			return err
		}
		collection.Schema.AddField(new_telegram_bot_token)

		// add
		new_telegram_chat_id := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "ronzr4c2",
			"name": "telegram_chat_id",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_telegram_chat_id); err != nil {
			return err
		}
		collection.Schema.AddField(new_telegram_chat_id)

		// add
		new_telegram_time := &schema.SchemaField{}
		if err := json.Unmarshal([]byte(`{
			"system": false,
			"id": "kiosayqz",
			"name": "telegram_time",
			"type": "text",
			"required": false,
			"presentable": false,
			"unique": false,
			"options": {
				"min": null,
				"max": null,
				"pattern": ""
			}
		}`), new_telegram_time); err != nil {
			return err
		}
		collection.Schema.AddField(new_telegram_time)

		return dao.SaveCollection(collection)
	}, func(db dbx.Builder) error {
		dao := daos.New(db);

		collection, err := dao.FindCollectionByNameOrId("ypaql8j0r6u4rcq")
		if err != nil {
			return err
		}

		// remove
		collection.Schema.RemoveField("ofuwiaxv")

		// remove
		collection.Schema.RemoveField("ronzr4c2")

		// remove
		collection.Schema.RemoveField("kiosayqz")

		return dao.SaveCollection(collection)
	})
}
