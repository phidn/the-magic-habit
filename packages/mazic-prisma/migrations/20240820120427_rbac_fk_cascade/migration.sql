-- AddForeignKey
ALTER TABLE "sys_permission" ADD CONSTRAINT "sys_permission_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "sys_resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_permission" ADD CONSTRAINT "sys_permission_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "sys_action"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_permission" ADD CONSTRAINT "sys_role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_permission" ADD CONSTRAINT "sys_role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "sys_permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
