//go:build pq

package core

import (
	"os"
	"strings"

	_ "github.com/lib/pq"
	"github.com/pocketbase/dbx"
)

func connectDB(dbPath string) (*dbx.DB, error) {
	if strings.Contains(dbPath, "logs.db") {
		return dbx.MustOpen("postgres", os.Getenv("DB_POCKETBASE_LOGS"))
	}
	dbUrl := os.Getenv("DB_POCKETBASE")
	return dbx.MustOpen("postgres", dbUrl)
}
