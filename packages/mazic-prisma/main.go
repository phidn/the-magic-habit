package main

import (
	"context"
	"fmt"

	"mazic/prisma/db"
	"mazic/server/pkg/utils"
)

func main() {
	if err := run(); err != nil {
		panic(err)
	}
}

func run() error {
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		return err
	}

	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	ctx := context.Background()

	// #region: Seed root admin
	_, err := client.SysUser.FindFirst(db.SysUser.Email.Equals("phidndev@gmail.com")).Exec(ctx)
	if err == db.ErrNotFound {
		_, err := client.SysUser.CreateOne(
			db.SysUser.ID.Set(utils.RandomString()),
			db.SysUser.FirstName.Set("Phi"),
			db.SysUser.LastName.Set("Dang"),
			db.SysUser.Email.Set("phidndev@gmail.com"),
			db.SysUser.Username.Set("phidndev"),
			db.SysUser.PasswordHash.Set("$2a$10$n7vV4o4uwg5JesgYMlPsN.LlbJwH4B37GEvlAL.dbnX2EgR3R.xyC"),
			db.SysUser.Verified.Set(true),
		).Exec(ctx)
		if err != nil {
			return err
		}
	}
	fmt.Println(">> Root admin created")
	// #endregion: Seed root admin

	// #region: seed action
	actions := []struct {
		Name string
		Code string
	}{
		{"Create", "create"},
		{"Update", "update"},
		{"Delete", "delete"},
		{"View", "view"},
	}
	for _, action := range actions {
		// Check if the action already exists
		_, err := client.SysAction.FindUnique(
			db.SysAction.Code.Equals(action.Code),
		).Exec(ctx)

		if err == db.ErrNotFound {
			// Create the action if it doesn't exist
			_, err = client.SysAction.CreateOne(
				db.SysAction.ID.Set(utils.RandomString()),
				db.SysAction.Name.Set(action.Name),
				db.SysAction.Code.Set(action.Code),
				db.SysAction.IsActive.Set(true),
			).Exec(ctx)
			if err != nil {
				return err
			}
		} else if err != nil {
			return err
		}
		// If the action already exists, do nothing
	}
	fmt.Println(">> Action created")
	// #endregion: seed action

	// #region: seed role
	roles := []struct {
		Name string
		Code string
	}{
		{"Admin", "admin"},
		{"User", "user"},
	}
	for _, role := range roles {
		_, err := client.SysRole.FindUnique(
			db.SysRole.Name.Equals(role.Name),
		).Exec(ctx)
		if err == db.ErrNotFound {
			_, err = client.SysRole.CreateOne(
				db.SysRole.ID.Set(utils.RandomString()),
				db.SysRole.Name.Set(role.Name),
				db.SysRole.IsActive.Set(true),
			).Exec(ctx)
			if err != nil {
				return err
			}
		} else if err != nil {
			return err
		}
	}
	fmt.Println(">> Role created")
	// #endregion: seed role

	// #region: seed role_action

	return nil
}
