package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "2098056105782411264",
				"created": "2024-09-25 08:34:14.915Z",
				"updated": "2024-09-25 08:34:14.915Z",
				"name": "sys_action",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "ghqqsask",
						"name": "name",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "w3cvdgae",
						"name": "code",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "2pqwlvfk",
						"name": "is_active",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_Xj8ydPd ON sys_action (name)",
					"CREATE UNIQUE INDEX idx_AJtI1FK ON sys_action (code)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2098058556417769472",
				"created": "2024-09-25 08:34:14.917Z",
				"updated": "2024-09-25 08:34:14.917Z",
				"name": "sys_permission",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "t33sbw8a",
						"name": "name",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "bpmchlkk",
						"name": "code",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "nxxqtzlh",
						"name": "description",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "6pog4x8p",
						"name": "resource_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098056344316674048",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "naexzklb",
						"name": "action_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098056105782411264",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "p2dfo9ps",
						"name": "is_active",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_5XTOxWW ON sys_permission (\n  resource_id,\n  action_id\n)",
					"CREATE UNIQUE INDEX idx_cL4UgWL ON sys_permission (name)",
					"CREATE UNIQUE INDEX idx_Wk0bqVU ON sys_permission (code)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2098056344316674048",
				"created": "2024-09-25 08:34:14.921Z",
				"updated": "2024-09-25 08:34:14.921Z",
				"name": "sys_resource",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "hd6mwptd",
						"name": "name",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "8o393etj",
						"name": "code",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "h9w0sf80",
						"name": "is_active",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "eimxnbw7",
						"name": "actions",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098056105782411264",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": null,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_p2vQkRr ON sys_resource (name)",
					"CREATE UNIQUE INDEX idx_rK2pHv9 ON sys_resource (code)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2098056565679456256",
				"created": "2024-09-25 08:34:14.923Z",
				"updated": "2024-09-25 08:34:14.923Z",
				"name": "sys_role",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "xmbgbykt",
						"name": "name",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "k0en5ltm",
						"name": "description",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "hdtguzrn",
						"name": "is_active",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_eyiCi8a ON sys_role (name)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2100628286043324416",
				"created": "2024-09-25 08:34:14.931Z",
				"updated": "2024-09-25 08:34:14.931Z",
				"name": "sys_role_permission",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "etssexnt",
						"name": "role_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098056565679456256",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "qduxyy1l",
						"name": "permission_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098058556417769472",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_WKLjlJK ON sys_role_permission (\n  role_id,\n  permission_id\n)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "2098443258622377984",
				"created": "2024-09-25 08:34:14.939Z",
				"updated": "2024-09-25 08:34:14.939Z",
				"name": "sys_user",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "fcqbvdjc",
						"name": "first_name",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "svounc1g",
						"name": "last_name",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "3cltpfmy",
						"name": "email",
						"type": "email",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"exceptDomains": [],
							"onlyDomains": []
						}
					},
					{
						"system": false,
						"id": "fyprojx5",
						"name": "username",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "cya1kw0b",
						"name": "password_hash",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "oxvzfuja",
						"name": "verified",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "qopfdg1t",
						"name": "avatar",
						"type": "file",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"mimeTypes": [],
							"thumbs": [],
							"maxSelect": 1,
							"maxSize": 5242880,
							"protected": false
						}
					},
					{
						"system": false,
						"id": "ni03nvgo",
						"name": "roles",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098056565679456256",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": null,
							"displayFields": null
						}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX idx_3q5O1p3 ON sys_user (email)",
					"CREATE UNIQUE INDEX idx_1IHlFNg ON sys_user (username)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "g8x48kl0jmq18zf",
				"created": "2024-09-25 09:28:54.012Z",
				"updated": "2024-10-06 17:03:59.007Z",
				"name": "mz_habits",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "u7n8fwe5",
						"name": "title",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "xswmoioe",
						"name": "metric",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "jujewn4z",
						"name": "week_start",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "tpgnktdg",
						"name": "color",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "a7mdomju",
						"name": "order",
						"type": "number",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"noDecimal": false
						}
					},
					{
						"system": false,
						"id": "hxu8e7ll",
						"name": "user_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "2098443258622377984",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "i9oroiux",
						"name": "is_deleted",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "mz4bhxgc",
						"name": "is_private",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "qmvlhr6t",
						"name": "check_in_type",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "fkpqa2ku",
						"name": "api_key",
						"type": "text",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"indexes": [],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			},
			{
				"id": "l05ydbhubwy3li9",
				"created": "2024-09-25 09:31:32.304Z",
				"updated": "2024-10-06 15:43:24.048Z",
				"name": "mz_check_in",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "qslfzkn4",
						"name": "habit_id",
						"type": "relation",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"collectionId": "g8x48kl0jmq18zf",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": null
						}
					},
					{
						"system": false,
						"id": "ojn9vjcc",
						"name": "date",
						"type": "date",
						"required": true,
						"presentable": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "4mnq0ect",
						"name": "value",
						"type": "number",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"noDecimal": false
						}
					},
					{
						"system": false,
						"id": "4tmkdpzi",
						"name": "journal",
						"type": "text",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "dbskuh2z",
						"name": "is_done",
						"type": "bool",
						"required": false,
						"presentable": false,
						"unique": false,
						"options": {}
					}
				],
				"indexes": [
					"CREATE UNIQUE INDEX ` + "`" + `idx_6nFVz4F` + "`" + ` ON ` + "`" + `mz_check_in` + "`" + ` (\n  ` + "`" + `habit_id` + "`" + `,\n  ` + "`" + `date` + "`" + `\n)"
				],
				"listRule": null,
				"viewRule": null,
				"createRule": null,
				"updateRule": null,
				"deleteRule": null,
				"options": {}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
