# ===== PRE-DEV ======== #

LTS_NODE_VER=20
NODE_VER=$(shell node -v)
ifeq ($(patsubst v$(LTS_NODE_VER).%,matched,$(NODE_VER)), matched)
	NODE_LTS=true
else
	NODE_LTS=false
endif

check-node-version:
	@$(NODE_LTS) || echo Build requires nodejs v$(LTS_NODE_VER)
	@$(NODE_LTS) && echo Check nodejs passed v$(LTS_NODE_VER)

switch-node-version:
	@current_ver=$$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1); \
	if [ "$$current_ver" -eq "$(LTS_NODE_VER)" ]; then \
		echo "Check nodejs passed v$(LTS_NODE_VER)"; \
	else \
		echo "Build requires nodejs v$(LTS_NODE_VER)"; \
		echo "Switching to nodejs v$(LTS_NODE_VER)..."; \
		nvm use $(LTS_NODE_VER); \
		echo "Switched to nodejs v$(LTS_NODE_VER)"; \
	fi

# ===== UTILS ======== #

kill-port:
	yarn kill-port 4200
	yarn kill-port 5005
	yarn kill-port 8090

cd-pb:
	cd packages/mazic-pocketbase && bash -c "exec bash"
cd-server:
	cd packages/mazic-server && bash -c "exec bash"
cd-prisma:
	cd packages/mazic-prisma && bash -c "exec bash"


clear:
	make clear-nx && \
	make clear-vite && \
	make clear-debug && \
	taskkill //IM node.exe //F

clear-vite:
	rm -rf node_modules/.vite

nx-clear: clear-nx
clear-nx:
	rm -rf .nx && \
	yarn nx reset

clear-debug:
	@echo "Clearing debug files..."
	rm -f packages/mazic-server/__debug_bin*.exe
	@echo "Debug files cleared."

# ===== NX ======== #

automate-updating-dependencies:
	@echo "Automating updating dependencies..."
	yarn nx migrate latest
	@echo "Dependencies updated."

graph:
	@echo "Generating graph..."
	yarn nx graph
	@echo "Graph generated."

gen-lib:
	@echo "Generating package..."
	yarn nx generate @nx/js:library --name=$(name) --directory=packages/mazic-$(name) --importPath=@mazic-$(name) --projectNameAndRootFormat=as-provided --no-interactive
	@echo "Package generated."


# ===== WEB ======== #

web: switch-node-version
	@echo "Starting web..."
	yarn nx run mazic:serve
web-build: switch-node-version
	@echo "Building web..."
	# yarn nx run mazic:build --skip-nx-cache && \
	yarn nx run mazic:build && \
	rm -rf packages/mazic-server/web/dist && \
	cp -rf dist/packages/mazic packages/mazic-server/web/dist
	@echo "Web built."

# ===== SERVER ======== #

swagger:
	@echo "Starting generate api docs..."
	cd packages/mazic-api && \
	swag init -g main.go
	@echo "Done generate api docs..."

server:
	@echo "Starting server..."
	export APP_ENV=development && \
	cd packages/mazic-server && \
	wgo run -xdir pb_data --verbose main.go serve
	@echo "Successfully started server..."

server-start:
	@echo "Starting server..."
	export APP_ENV=development && \
	cd packages/mazic-server && \
	go run main.go serve
	@echo "Successfully started server..."

server-build:
	@echo "Building server..."
	export APP_ENV=production && \
	cd packages/mazic-server && \
	go build main.go
	@echo "Server built."


# ===== GENERATE ======== #


shadcn:
	@echo "Starting shadcn..."
	# npx shadcn@latest add tabs
	npx shadcn@latest add $(c)
	@echo "Shadcn generated."

gen-index:
	@echo "Starting generate design system..."
	node scripts/generate-index.js
	@echo "Icons generated."

gen-schema:
	@echo "Starting generate typescript..."
	node scripts/generate-schema.js
	@echo "Typescript generated."

# ===== DOCKER ======== #

build:
	@echo "Building docker..."
	docker build -f ./packages/mazic-docker/Dockerfile -t phidndev/dev:mazic_server_v0 .
	@echo "Docker built."
push:
	@echo "Push docker image..."
	docker push phidndev/dev:mazic_server_v0
	@echo "Docker image pushed."
build-log:
	@echo "Building docker..."
	docker build --progress=plain -f ./packages/mazic-docker/Dockerfile -t phidndev/dev:mazic_server_v0 .
	@echo "Docker built."
build-no-cache:
	@echo "Building docker..."
	docker build --no-cache --progress=plain -f ./packages/mazic-docker/Dockerfile -t mazic/server:latest .
	@echo "Docker built."

build-up: build
	@echo "Running docker-compose..."
	cd packages/mazic-docker && \
	docker rm -f mazic-docker-mazic-server-1 && \
	docker-compose up -d
	@echo "Docker-compose running."
