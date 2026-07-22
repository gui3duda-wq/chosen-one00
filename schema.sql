-- CHOSEN ONE — Script SQL para criar tabelas no Neon/PostgreSQL
-- Cole no SQL Editor do Neon e clique em Run

CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '',
    "sizes" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Coleção',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '{}',
    "adminUser" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_entity_action_idx" ON "AuditLog"("entity", "action");

CREATE TABLE IF NOT EXISTS "ProductClick" (
    "id" TEXT PRIMARY KEY,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ProductClick_createdAt_idx" ON "ProductClick"("createdAt");
CREATE INDEX IF NOT EXISTS "ProductClick_productId_type_idx" ON "ProductClick"("productId", "type");
CREATE INDEX IF NOT EXISTS "ProductClick_productName_idx" ON "ProductClick"("productName");

-- Pronto! As tabelas foram criadas.
-- NÃO insira produtos nem admin aqui.
-- Após o deploy, acesse: https://SEU-SITE.vercel.app/api-setup
-- Clique em "Restaurar acesso admin" para criar o admin com senha admin123.
