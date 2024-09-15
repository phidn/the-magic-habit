db-push:
	@echo "Pushing Prisma schema to database..."
	@go run github.com/steebchen/prisma-client-go db push
	@echo "Database schema pushed successfully."

create-migration:
	@echo "Creating migration..."
	@go run github.com/steebchen/prisma-client-go migrate dev --create-only --name $(name)
	@echo "Migration created successfully."

migrate-dev:
	@echo "Sync migration..."
	@go run github.com/steebchen/prisma-client-go migrate dev
	@echo "Synced successfully."

