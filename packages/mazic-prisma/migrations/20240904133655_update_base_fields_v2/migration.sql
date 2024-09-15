-- AlterTable
ALTER TABLE "md_close_reason" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_action" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_permission" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_resource" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_role" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_role_permission" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "sys_user" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "created_at" DROP DEFAULT;
