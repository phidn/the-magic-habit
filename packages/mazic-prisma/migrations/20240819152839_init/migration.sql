-- CreateTable
CREATE TABLE "md_close_reason" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR NOT NULL,
    "value" TEXT NOT NULL,
    "company_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" UUID,

    CONSTRAINT "md_close_reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_action" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(128) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1024),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "sys_action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(128) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1024),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "resource_id" UUID,
    "action_id" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "sys_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_resource" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" VARCHAR(20),
    "name" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(32),
    "description" VARCHAR(1024),
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "code" VARCHAR(255) NOT NULL,
    "created_by" UUID,
    "is_active" BOOLEAN DEFAULT true,
    "updated_by" UUID,

    CONSTRAINT "sys_resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(1024),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "role_key" VARCHAR(255),
    "is_active" BOOLEAN DEFAULT true,
    "created_by" UUID,
    "updated_by" UUID,

    CONSTRAINT "sys_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_role_permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sys_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sys_user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "first_name" VARCHAR(128),
    "last_name" VARCHAR(128),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "username" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "sys_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_action_name_key" ON "sys_action"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_action_code_key" ON "sys_action"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_permission_name_key" ON "sys_permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_permission_code_key" ON "sys_permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_resource_name_key" ON "sys_resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_role_name_key" ON "sys_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sys_role_permission_role_id_permission_id_key" ON "sys_role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_user_email_key" ON "sys_user"("email");
