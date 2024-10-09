prisma-pull:
	@echo "Starting prisma pull..."
	npx prisma db pull
	@echo "Prisma pull done."

prisma-init:
	@echo "Starting prisma diff..."
	mkdir -p prisma/migrations/0_init && \
	npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
	@echo "Prisma diff done."

prisma-init-apply:
	@echo "Starting prisma init apply..."
	npx prisma migrate resolve --applied 0_init
	@echo "Prisma init apply done."
