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

kill:
	- yarn kill-port 4200
	- yarn kill-port 5005
	- yarn kill-port 8090
	- taskkill /f /im node.exe
	- taskkill /f /im java.exe
	- taskkill /f /im adb.exe
	- taskkill /f /im clang++.exe
	- taskkill /f /im ninja.exe
	- taskkill /f /im watchman.exe


cd-server:
	cd packages/mazic-server && bash -c "exec bash"
cd-prisma:
	cd packages/mazic-prisma && bash -c "exec bash"
cd-mobile:
	cd packages/mazic-mobile && bash -c "exec bash"
cd-m: cd-mobile

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
	yarn nx run mazic:serve --verbose

web-build: switch-node-version
	@echo "Building web..."
	yarn nx run mazic:build --skip-nx-cache && \
	# yarn nx run mazic:build && \
	rm -rf packages/mazic-server/web/dist && \
	cp -rf dist/packages/mazic packages/mazic-server/web/dist
	@echo "Web built."

web-lint: switch-node-version
	@echo "Checking web..."
	yarn nx run mazic:lint
	@echo "Web checked."

web-lint-fix: switch-node-version
	@echo "Checking web..."
	yarn nx run mazic:lint --fix
	@echo "Web checked."

web-ts: switch-node-version
	@echo "Checking web typescript..."
	yarn tsc -b ./packages/mazic/tsconfig.app.json
	@echo "Web typescript checked."

web-format: switch-node-version
	@echo "Formatting web..."
	yarn nx run mazic:format
	@echo "Web formatted."

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
	wgo run -xdir pb_data -xdir web -xdir migrations --verbose main.go serve
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
	@echo "Starting generate all index files..."
	node scripts/generate-index.js
	@echo "Index files generated."

gen-schema:
	@echo "Starting generate typescript..."
	node scripts/generate-schema.js
	@echo "Typescript generated."

# ===== DOCKER ======== #

docker-build:
	@echo "Building docker..."
	docker build -f ./packages/mazic-docker/Dockerfile.local -t phidndev/dev:mazic_server_v0 .
	@echo "Docker built."
docker-push:
	@echo "Push docker image..."
	docker push phidndev/dev:mazic_server_v0
	@echo "Docker image pushed."
docker-build-log:
	@echo "Building docker..."
	docker build --progress=plain -f ./packages/mazic-docker/Dockerfile -t phidndev/dev:mazic_server_v0 .
	@echo "Docker built."
docker-build-no-cache:
	@echo "Building docker..."
	docker build --no-cache --progress=plain -f ./packages/mazic-docker/Dockerfile -t mazic/server:latest .
	@echo "Docker built."

docker-build-up: build
	@echo "Running docker-compose..."
	cd packages/mazic-docker && \
	docker rm -f mazic-docker-mazic-server-1 && \
	docker-compose up -d
	@echo "Docker-compose running."

docker-docker-up:
	@echo "Running docker-compose..."
	docker rm -f mazic-habit-mazic-server && \
	docker image rm -f phidndev/dev:mazic_server_v0 && \
	cd packages/mazic-docker && \
	docker-compose up -d
	@echo "Docker-compose running."

# ===== MOBILE ======== #

emulator:
	@echo "Starting emulator..."
	cd C:/Users/phidn/AppData/Local/Android/Sdk/emulator && ./emulator.exe -avd Pixel_7_API_35
	@echo "Emulator started."

mobile:
	@echo "Starting mobile..."
	cd packages/mazic-mobile && \
	make start
	@echo "Mobile started."

mobile-rc:
	@echo "Starting mobile..."
	cd packages/mazic-mobile && \
	make start-rc
	@echo "Mobile started."
