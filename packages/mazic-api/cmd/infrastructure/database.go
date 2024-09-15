package infrastructure

import (
	"context"
	"database/sql"
	"fmt"
	"mazic/mazicapi/server/config"
	"mazic/mazicapi/util"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Database struct {
	*gorm.DB
}

type TransFunc func(context.Context) error

func (a *Database) Exec(ctx context.Context, fn TransFunc) error {
	if _, ok := util.FromTrans(ctx); ok {
		return fn(ctx)
	}

	return a.DB.Transaction(func(db *gorm.DB) error {
		return fn(util.NewTrans(ctx, db))
	})
}

func (a *Database) GetContext(ctx context.Context) *gorm.DB {
	db := a.DB
	if tdb, ok := util.FromTrans(ctx); ok {
		db = tdb
	}
	if util.FromRowLock(ctx) {
		db = db.Clauses(clause.Locking{Strength: "UPDATE"})
	}
	return db.WithContext(ctx)
}

func NewDatabase() *Database {
	var err error
	sqlDB, err := sql.Open("postgres",
		fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			config.Config.DbHost, config.Config.DbUser, config.Config.DbPassword, config.Config.DbName, config.Config.DbPort))

	if err != nil {
		panic(err.Error())
	}

	if err := sqlDB.Ping(); err != nil {
		panic(err.Error())
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		SkipDefaultTransaction: true,
		PrepareStmt:            false,
	})

	if err != nil {
		panic(err.Error())
	}

	fmt.Println("🚀 Successfully connected to database")

	gormDB = gormDB.Debug()

	return &Database{gormDB}
}
