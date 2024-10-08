-- CreateTable
CREATE TABLE "_admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "avatar" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "tokenKey" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "lastResetSentAt" TEXT NOT NULL DEFAULT '',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "_collections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "system" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'base',
    "name" TEXT NOT NULL,
    "schema" json NOT NULL DEFAULT "[]",
    "indexes" json NOT NULL DEFAULT "[]",
    "listRule" TEXT,
    "viewRule" TEXT,
    "createRule" TEXT,
    "updateRule" TEXT,
    "deleteRule" TEXT,
    "options" json NOT NULL DEFAULT "{}",
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "_externalAuths" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    CONSTRAINT "_externalAuths_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "_collections" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_migrations" (
    "file" TEXT NOT NULL PRIMARY KEY,
    "applied" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_params" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" json,
    "created" TEXT NOT NULL DEFAULT '',
    "updated" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "sys_action" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "name" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "sys_permission" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "name" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "action_id" TEXT NOT NULL DEFAULT '',
    "resource_id" TEXT NOT NULL DEFAULT '',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "sys_resource" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "name" TEXT NOT NULL DEFAULT '',
    "code" TEXT NOT NULL DEFAULT '',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "actions" json NOT NULL DEFAULT '[]',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "sys_role" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "sys_role_permission" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "role_id" TEXT NOT NULL DEFAULT '',
    "permission_id" TEXT NOT NULL DEFAULT '',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "sys_user" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "email" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL DEFAULT '',
    "password_hash" TEXT NOT NULL DEFAULT '',
    "first_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "roles" json NOT NULL DEFAULT '[]',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "mz_habits" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "check_in_type" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '',
    "metric" TEXT NOT NULL DEFAULT '',
    "order" DECIMAL NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL DEFAULT '',
    "week_start" TEXT NOT NULL DEFAULT '',
    "user_id" TEXT NOT NULL DEFAULT '',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "api_key" TEXT NOT NULL DEFAULT '',
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "mz_statistics" (
    "habit_id" TEXT NOT NULL DEFAULT '',
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "stat_type" TEXT NOT NULL DEFAULT '',
    "value" DECIMAL NOT NULL DEFAULT 0,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "mz_streaks" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "habit_id" TEXT NOT NULL DEFAULT '',
    "current_streak" DECIMAL NOT NULL DEFAULT 0,
    "longest_streak" DECIMAL NOT NULL DEFAULT 0,
    "streak_days" json,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ'))
);

-- CreateTable
CREATE TABLE "mz_check_in" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '''r''||lower(hex(randomblob(7)))',
    "habit_id" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "journal" TEXT NOT NULL DEFAULT '',
    "value" DECIMAL NOT NULL DEFAULT 0,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "created" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    "updated" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')),
    CONSTRAINT "mz_check_in_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "mz_habits" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex__admins_2" ON "_admins"("email");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex__admins_3" ON "_admins"("tokenKey");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex__collections_2" ON "_collections"("name");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "_externalAuths_collection_provider_idx" ON "_externalAuths"("collectionId", "provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "_externalAuths_record_provider_idx" ON "_externalAuths"("collectionId", "recordId", "provider");

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex__params_2" ON "_params"("key");
Pragma writable_schema=0;

-- CreateIndex
CREATE UNIQUE INDEX "idx_Xj8ydPd" ON "sys_action"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_AJtI1FK" ON "sys_action"("code");

-- CreateIndex
CREATE UNIQUE INDEX "idx_cL4UgWL" ON "sys_permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_Wk0bqVU" ON "sys_permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "idx_5XTOxWW" ON "sys_permission"("resource_id", "action_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_p2vQkRr" ON "sys_resource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_rK2pHv9" ON "sys_resource"("code");

-- CreateIndex
CREATE UNIQUE INDEX "idx_eyiCi8a" ON "sys_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "idx_WKLjlJK" ON "sys_role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_3q5O1p3" ON "sys_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "idx_1IHlFNg" ON "sys_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "idx_N6naouA" ON "mz_statistics"("habit_id", "stat_type");

-- CreateIndex
CREATE UNIQUE INDEX "idx_6nFVz4F" ON "mz_check_in"("habit_id", "date");
