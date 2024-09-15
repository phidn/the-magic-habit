-- DropForeignKey
ALTER TABLE "sys_permission" DROP CONSTRAINT "sys_permission_action_id_fkey";

-- DropForeignKey
ALTER TABLE "sys_permission" DROP CONSTRAINT "sys_permission_resource_id_fkey";

-- AddForeignKey
ALTER TABLE "sys_permission" ADD CONSTRAINT "sys_permission_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "sys_resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_permission" ADD CONSTRAINT "sys_permission_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "sys_action"("id") ON DELETE CASCADE ON UPDATE CASCADE;
