package migrations

import (
	"github.com/pocketbase/dbx"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		_, err := db.NewQuery("UPDATE mz_habits SET check_in_type = 'DONE_NOTE' WHERE check_in_type = 'CHECKBOX'").Execute()
		if err != nil {
			return err
		}
		_, err = db.NewQuery("UPDATE mz_habits SET check_in_type = 'INPUT_NUMBER' WHERE check_in_type = 'NUMBER'").Execute()
		if err != nil {
			return err
		}
		return nil
	}, func(db dbx.Builder) error {
		return nil
	})
}
