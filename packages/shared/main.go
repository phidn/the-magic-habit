package main

import (
	"fmt"
	shared_config "mazic/shared/src"
)

func main() {
	err := shared_config.Config.LoadConfig()
	if err != nil {
		fmt.Println("Failed to load config:", err)
		return
	}

	fmt.Println("Config loaded successfully:", shared_config.Config.Permissions)
	fmt.Print("Administration: ", shared_config.Config.Permissions.Administration.AllActions)
}
