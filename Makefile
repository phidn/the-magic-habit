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

kill-port:
	yarn kill-port 4200
	yarn kill-port 5005
	yarn kill-port 8090

cd-pb:
	cd packages/mazic-pocketbase && bash -c "exec bash"
cd-server:
	cd packages/mazic-api && bash -c "exec bash"
cd-prisma:
	cd packages/mazic-api && bash -c "exec bash"

# ===== NX ======== #

graph:
	@echo "Generating graph..."
	yarn nx graph
	@echo "Graph generated."

clear:
	rm -rf .nx && \
	rm -rf node_modules/.vite && \
	yarn nx reset

gen-package-js:
	@echo "Generating package..."
	yarn nx generate @nx/js:library --name=common --directory=packages/common --importPath=@mazic-common --projectNameAndRootFormat=as-provided --no-interactive
	@echo "Package generated."

gen-package-go:
	@echo "Generating package..."
	nx g @nx-go/nx-go:application ui
	@echo "Package generated."


# ===== WEB ======== #

web: switch-node-version
	@echo "Starting web..."
	yarn nx run mazic:serve

shadcn:
	@echo "Starting shadcn..."
	# npx shadcn@latest add tabs
	npx shadcn@latest add $(c)
	@echo "Shadcn generated."

gen-index:
	@echo "Starting generate design system..."
	node scripts/generate-index.js
	@echo "Icons generated."

# ===== SERVER ======== #

swagger:
	@echo "Starting generate api docs..."
	cd packages/mazic-api && \
	swag init -g main.go
	@echo "Done generate api docs..."

api:
	@echo "Starting server..."
	export GO_ENV=development && \
	cd packages/mazic-api && \
	wgo run --verbose main.go
	@echo "Successfully started server..."
server:
	@echo "Starting server..."
	export GO_ENV=development && \
	cd packages/mazic-api && \
	wgo run -tags pq --verbose main.go
	@echo "Successfully started server..."

pocketbase:
	@echo "Starting pocketbase server..."
	cd packages/mazic-pocketbase && \
	wgo run -tags pq ./examples/base serve
	@echo "Successfully started pocketbase server..."

