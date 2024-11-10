swagger:
	@echo "Starting generate api docs..."
	swag init -g main.go
	@echo "Done generate api docs..."

server:
	@echo "Starting server..."
	export APP_ENV=development && \
	wgo run -xdir pb_data -xdir web -xdir migrations --verbose main.go serve
	@echo "Successfully started server..."

server-start:
	@echo "Starting server..."
	export APP_ENV=development && \
	go run main.go serve
	@echo "Successfully started server..."

server-build:
	@echo "Building server..."
	export APP_ENV=production && \
	go build main.go
	@echo "Server built."
