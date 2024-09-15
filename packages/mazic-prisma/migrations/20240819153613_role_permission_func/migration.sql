-- ----------------------------
-- Function structure for sys_role_permission_GetGroupedList
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."sys_role_permission_GetGroupedList"();
CREATE OR REPLACE FUNCTION "public"."sys_role_permission_GetGroupedList"()
  RETURNS TABLE("resource_id" uuid, "resource_name" varchar, "role_id" uuid, "role_name" varchar, "permission_id" uuid, "permission_name" varchar, "action_id" uuid, "action_name" varchar, "is_access" bool, "is_parent" bool) AS $BODY$
BEGIN
    RETURN QUERY
    WITH permission_data AS (
        SELECT
            rp.id AS id,
            res.id AS resource_id,
            res.name AS resource_name,
            r.id AS role_id,
            r.name AS role_name,
            p.id AS permission_id,
            p.name AS permission_name,
            act.id AS action_id,
            act.name AS action_name,
            CASE
                WHEN rp.id IS NOT NULL THEN true
                ELSE false
            END AS is_access
        FROM
            sys_permission p
            LEFT JOIN sys_resource res ON res.id = p.resource_id
            LEFT JOIN sys_action act ON p.action_id = act.id
            CROSS JOIN sys_role r
            LEFT JOIN sys_role_permission rp ON r.id = rp.role_id AND p.id = rp.permission_id
        WHERE p.id IS NOT NULL
    ),
    resource_access AS (
        SELECT
            resource_id,
            resource_name,
            role_id,
            role_name,
            bool_and(is_access) AS is_access
        FROM
            permission_data
        GROUP BY
            resource_id, resource_name, role_id, role_name
    )
    SELECT
        resource_id,
        resource_name,
        role_id,
        role_name,
        NULL::uuid AS permission_id,
        NULL::varchar AS permission_name,
        NULL::uuid AS action_id,
        NULL::varchar AS action_name,
        is_access,
        true AS is_parent
    FROM
        resource_access
    UNION
    SELECT
        resource_id,
        resource_name,
        role_id,
        role_name,
        permission_id,
        permission_name,
        action_id,
        action_name,
        is_access,
        false AS is_parent
    FROM
        permission_data
    ORDER BY resource_name, role_name, is_parent DESC, permission_name;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;

-- ----------------------------
-- Function structure for sys_role_permission_GetList
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."sys_role_permission_GetList"();
CREATE OR REPLACE FUNCTION "public"."sys_role_permission_GetList"()
  RETURNS TABLE("id" uuid, "resource_id" uuid, "resource_name" varchar, "role_id" uuid, "role_name" varchar, "role_key" varchar, "permission_id" uuid, "permission_name" varchar, "action_id" uuid, "action_name" varchar, "is_access" bool) AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        rp.id AS id,
        res.id AS resource_id,
        res.name AS resource_name,
        r.id AS role_id,
        r.name AS role_name,
        r.role_key AS role_key,
        p.id AS permission_id,
        p.name AS permission_name,
        act.id AS action_id,
        act.name AS action_name,
        CASE
            WHEN rp.id IS NOT NULL THEN true
            ELSE false
        END AS is_access
    FROM
        sys_resource res
        LEFT JOIN sys_permission p ON res.id = p.resource_id
        LEFT JOIN sys_action act ON p.action_id = act.id
        CROSS JOIN sys_role r
        LEFT JOIN sys_role_permission rp ON r.id = rp.role_id AND p.id = rp.permission_id
    WHERE p.id IS NOT NULL
    ORDER BY res.name, r.name, act.name;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;

-- ----------------------------
-- Function structure for sys_role_permission_Update
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."sys_role_permission_Update"("_records" jsonb);
CREATE OR REPLACE FUNCTION "public"."sys_role_permission_Update"("_records" jsonb)
  RETURNS "pg_catalog"."void" AS $BODY$
BEGIN
    -- Step 1: Delete all records not present in the input array
    DELETE FROM sys_role_permission
    WHERE (role_id, permission_id) NOT IN (
        SELECT
            (value->>'role_id')::uuid,
            (value->>'permission_id')::uuid
        FROM jsonb_array_elements(_records) AS value
    );

    -- Step 2: Insert new records if not exist
    INSERT INTO sys_role_permission (role_id, permission_id)
    SELECT
        (value->>'role_id')::uuid,
        (value->>'permission_id')::uuid
    FROM jsonb_array_elements(_records) AS value
    ON CONFLICT (role_id, permission_id) DO NOTHING;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
