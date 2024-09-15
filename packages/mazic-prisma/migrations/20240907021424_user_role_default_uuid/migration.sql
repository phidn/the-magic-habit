/*
  Warnings:

  - You are about to drop the column `created_at` on the `sys_role_permission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sys_role_permission` table. All the data in the column will be lost.
  - Made the column `created_at` on table `md_close_reason` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sys_action` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `sys_action` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `sys_action` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sys_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `sys_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `sys_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sys_resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `sys_resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `sys_resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sys_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `sys_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `sys_role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `sys_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by` on table `sys_user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "md_close_reason" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "sys_action" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "sys_permission" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "sys_resource" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL;

-- AlterTable
ALTER TABLE "sys_role" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" DROP DEFAULT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL;

-- AlterTable
ALTER TABLE "sys_role_permission" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "sys_user" ADD COLUMN     "is_delete" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "created_by" SET NOT NULL;

-- CreateTable
CREATE TABLE "sys_user_role" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "sys_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_user_role_user_id_role_id_key" ON "sys_user_role"("user_id", "role_id");

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
