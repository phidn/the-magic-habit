-- AlterTable
ALTER TABLE "sys_user" ADD COLUMN     "created_by" UUID,
ADD COLUMN     "updated_by" UUID;
