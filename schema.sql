-- ============================================
-- CHOSEN ONE — Script SQL para criar tabelas no Neon/PostgreSQL
-- ============================================
-- Cole este script no SQL Editor do Neon e clique em Run

-- Tabela de produtos
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

-- Tabela de admin
CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);

-- Tabela de logs de auditoria
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

-- Tabela de cliques (analytics)
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

-- ============================================
-- NÃO INSERIR PRODUTOS NEM ADMIN AQUI.
-- Após o deploy, acesse /api/setup no navegador para criar o admin.
-- ============================================

-- Pronto! As tabelas foram criadas.
-- Próximo passo: faça deploy na Vercel e acesse:
--   https://SEU-SITE.vercel.app/api-setup
-- OU
--   https://SEU-SITE.vercel.app/api/setup
