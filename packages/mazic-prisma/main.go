package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	// client := db.NewClient()
	// if err := client.Prisma.Connect(); err != nil {
	// 	return err
	// }

	// defer func() {
	// 	if err := client.Prisma.Disconnect(); err != nil {
	// 		panic(err)
	// 	}
	// }()

	// ctx := context.Background()

	// #region: Seed root admin
	// _, err := client.SysUser.FindFirst(db.SysUser.Email.Equals("phidndev@gmail.com")).Exec(ctx)
	// if err == db.ErrNotFound {
	// 	_, err := client.SysUser.CreateOne(
	// 		db.SysUser.ID.Set("00000000-0000-0000-0000-000000000000"),
	// 		db.SysUser.Email.Set("phidndev@gmail.com"),
	// 		db.SysUser.Password.Set("$2a$10$n7vV4o4uwg5JesgYMlPsN.LlbJwH4B37GEvlAL.dbnX2EgR3R.xyC"),
	// 		db.SysUser.CreatedAt.Set(time.Now()),
	// 		db.SysUser.CreatedBy.Set("00000000-0000-0000-0000-000000000000"),
	// 		db.SysUser.FirstName.Set("Phi"),
	// 		db.SysUser.LastName.Set("Dang"),
	// 		db.SysUser.IsActive.Set(true),
	// 		db.SysUser.IsDelete.Set(false),
	// 	).Exec(ctx)
	// 	if err != nil {
	// 		return err
	// 	}
	// }
	fmt.Println(">> Root admin created")
	// #endregion: Seed root admin

	// #region: seed action
	// actions := []struct {
	// 	ID   string
	// 	Name string
	// 	Code string
	// }{
	// 	{"00000000-0000-0000-0000-000000000001", "Create", "create"},
	// 	{"00000000-0000-0000-0000-000000000002", "Update", "update"},
	// 	{"00000000-0000-0000-0000-000000000003", "Delete", "delete"},
	// 	{"00000000-0000-0000-0000-000000000004", "View", "view"},
	// }
	// for _, action := range actions {
	// 	// Check if the action already exists
	// 	_, err := client.SysAction.FindUnique(
	// 		db.SysAction.Code.Equals(action.Code),
	// 	).Exec(ctx)

	// 	if err == db.ErrNotFound {
	// 		// Create the action if it doesn't exist
	// 		_, err = client.SysAction.CreateOne(
	// 			db.SysAction.ID.Set(action.ID),
	// 			db.SysAction.Name.Set(action.Name),
	// 			db.SysAction.Code.Set(action.Code),
	// 			db.SysAction.CreatedAt.Set(time.Now()),
	// 			db.SysAction.CreatedBy.Set("00000000-0000-0000-0000-000000000000"),
	// 			db.SysAction.IsActive.Set(true),
	// 			db.SysAction.IsDelete.Set(false),
	// 		).Exec(ctx)
	// 		if err != nil {
	// 			return err
	// 		}
	// 	} else if err != nil {
	// 		return err
	// 	}
	// 	// If the action already exists, do nothing
	// }
	fmt.Println(">> Action created")
	// #endregion: seed action

	// #region: seed role
	// roles := []struct {
	// 	ID   string
	// 	Name string
	// 	Code string
	// }{
	// 	{"00000000-0000-0000-0000-000000000001", "Admin", "admin"},
	// 	{"00000000-0000-0000-0000-000000000002", "User", "user"},
	// }
	// for _, role := range roles {
	// 	_, err := client.SysRole.FindUnique(
	// 		db.SysRole.Name.Equals(role.Name),
	// 	).Exec(ctx)
	// 	if err == db.ErrNotFound {
	// 		_, err = client.SysRole.CreateOne(
	// 			db.SysRole.ID.Set(role.ID),
	// 			db.SysRole.Name.Set(role.Name),
	// 			db.SysRole.CreatedAt.Set(time.Now()),
	// 			db.SysRole.CreatedBy.Set("00000000-0000-0000-0000-000000000000"),
	// 			db.SysRole.RoleKey.Set(role.Code),
	// 			db.SysRole.IsActive.Set(true),
	// 			db.SysRole.IsDelete.Set(false),
	// 		).Exec(ctx)
	// 		if err != nil {
	// 			return err
	// 		}
	// 	} else if err != nil {
	// 		return err
	// 	}
	// }
	fmt.Println(">> Role created")
	// #endregion: seed role

	// #region: seed role_action

	return nil
}
