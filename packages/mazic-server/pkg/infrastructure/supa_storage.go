package infrastructure

import (
	"fmt"

	"github.com/golangthang/mazic-habit/config"
	"github.com/golangthang/mazic-habit/pkg/supa_storage"
)

type SupaStorage struct {
	*supa_storage.Client
	Bucket string
}

func NewSupaStorage() *SupaStorage {
	client := supa_storage.NewClient(config.Config.SupabaseUrl, config.Config.SupabaseServiceRole, nil)

	fmt.Println("🚀 Successfully connected to Supabase Storage")
	return &SupaStorage{client, config.Config.SupabaseBucket}
}
