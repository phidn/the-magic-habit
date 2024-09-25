create-migration:
	@echo "Creating migration..."
	@go run github.com/steebchen/prisma-client-go migrate dev --create-only --name $(name)
	@echo "Migration created successfully."

# just re-generate the Go client
generate:
	go run github.com/steebchen/prisma-client-go generate

# sync the database with your schema for development
push:
	go run github.com/steebchen/prisma-client-go db push

# create a prisma schema from your existing database
pull:
	go run github.com/steebchen/prisma-client-go db pull

# for production use, create a migration locally
dev:
	go run github.com/steebchen/prisma-client-go migrate dev

# sync your production database with your migrations
deploy:
	go run github.com/steebchen/prisma-client-go migrate deploy
