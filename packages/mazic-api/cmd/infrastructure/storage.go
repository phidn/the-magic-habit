package infrastructure

import (
	"fmt"
	"mazic/mazicapi/pkg/storages/supabase_storage"
	"mazic/mazicapi/server/config"
)

type Storage struct {
	*supabase_storage.Client
	Bucket string
}

func NewSupabaseStorage() *Storage {
	client := supabase_storage.NewClient(config.Config.SupabaseUrl, config.Config.SupabaseServiceRole, nil)

	fmt.Println("🚀 Successfully created supabase client")
	return &Storage{client, config.Config.SupabaseBucket}
}
