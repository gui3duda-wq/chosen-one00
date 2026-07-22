# CHOSEN ONE — Deploy na Vercel (Passo a Passo)

## ⚠️ LEIA ISTO PRIMEIRO — IMPORTANTE!

Após fazer o deploy na Vercel, você PRECISA acessar a página de setup para criar o admin:
```
https://SEU-SITE.vercel.app/api-setup
```
Clique em **"Configurar Admin"**. Só depois disso o login vai funcionar!

---

## Pré-requisitos
- Conta no GitHub (ou usar Vercel CLI sem GitHub)
- Os arquivos desta pasta

---

## PASSO 1: Subir os arquivos para o GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `chosen-one`
3. Marque **Private**
4. Clique em **Create repository**
5. Clique em **"uploading an existing file"**
6. **Arraste TODOS os arquivos desta pasta** (não a pasta inteira)
7. Commit changes

---

## PASSO 2: Criar banco PostgreSQL grátis (Neon)

1. Acesse https://neon.tech → Sign up (entre com GitHub)
2. New Project:
   - Name: `chosen-one`
   - Region: a mais próxima
3. Copie a **Connection String**:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## PASSO 3: Criar as tabelas no banco

1. No painel do Neon, vá em **"SQL Editor"**
2. Abra o arquivo `schema.sql` desta pasta
3. Copie TODO o conteúdo
4. Cole no SQL Editor e clique em **Run**
5. As tabelas serão criadas

---

## PASSO 4: Deploy na Vercel

1. Acesse https://vercel.com/signup (entre com GitHub)
2. "Add New..." → "Project"
3. Selecione o repositório `chosen-one`
4. Em **Environment Variables**, adicione:
   - **Nome**: `DATABASE_URL`
   - **Valor**: cole a connection string do Neon
5. Clique em **Deploy**
6. Aguarde 2-3 minutos

---

## PASSO 5: ⚠️ CONFIGURAR O ADMIN (MUITO IMPORTANTE!)

**Não pule este passo ou o login não vai funcionar!**

1. Após o deploy, acesse:
   ```
   https://SEU-SITE.vercel.app/api-setup
   ```
2. Clique em **"Configurar Admin"**
3. Vai aparecer uma mensagem de sucesso
4. Agora o admin está criado com a senha padrão

---

## PASSO 6: Acessar o painel admin

1. Acesse: `https://SEU-SITE.vercel.app`
2. Clique em **"Admin"** no topo
3. Login:
   - **Usuário**: `admin`
   - **Senha**: `admin123`
4. ⚠️ **TROQUE A SENHA IMEDIATAMENTE** em "Conta & Senha"

---

## PASSO 7: Configurar a loja

No painel admin, configure:

### Em "Aparência & Conteúdo":
- **Número do WhatsApp**: troque `5511999999999` pelo seu número real
- Formato: código do país + DDD + número (ex: `5511987654321`)

### Em "Produtos":
- Clique em **"Novo produto"**
- Adicione suas camisetas com fotos (frente e costas)
- Configure preço, tamanhos, categoria

---

## PASSO 8 (Opcional): Domínio próprio

1. Compre um domínio (Registro.br, Namecheap, etc.)
2. Na Vercel: Settings → Domains → Add
3. Configure o DNS no painel do domínio:
   - Registro **A** → `76.76.21.21`
   - Ou **CNAME** → `cname.vercel-dns.com`
4. Aguarde 5-30 minutos
5. HTTPS gerado automaticamente

---

## 🆘 PROBLEMAS COMUNS

### "Senha incorreta" no login
1. Acesse `https://SEU-SITE.vercel.app/api-setup`
2. Clique em "Configurar Admin"
3. Tente login novamente com admin / admin123

### Site não carrega
1. Verifique se a `DATABASE_URL` está correta na Vercel
2. Verifique se o schema.sql foi rodado no Neon
3. Acesse `/api-setup` para garantir que o admin existe

### Erro de build na Vercel
1. Verifique se o `prisma/schema.prisma` tem `provider = "postgresql"`
2. O `postinstall: prisma generate` está no package.json (já configurado)

---

## 📁 Estrutura dos arquivos

```
chosen-one/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── setup/        ← ENDPOINT DE SETUP (cria admin)
│   │   │   ├── auth/         ← login, logout, troca de senha
│   │   │   ├── products/     ← CRUD de produtos
│   │   │   ├── settings/     ← configurações da loja
│   │   │   ├── analytics/    ← gráficos
│   │   │   ├── audit/        ← histórico
│   │   │   └── click/        ← tracking
│   │   ├── api-setup/        ← PÁGINA DE SETUP
│   │   ├── page.tsx          ← página principal
│   │   └── layout.tsx
│   ├── components/
│   │   ├── storefront/       ← vitrine pública
│   │   └── admin/            ← painel admin
│   └── lib/
│       ├── auth.ts           ← autenticação
│       ├── db.ts             ← banco
│       ├── audit.ts          ← auditoria
│       ├── whatsapp.ts       ← WhatsApp
│       └── session.ts        ← sessão
├── prisma/
│   ├── schema.prisma         ← PostgreSQL
│   ├── seed.ts               ← seed (admin + settings)
│   └── auto-restore.ts
├── public/uploads/           ← logo + imagens
├── schema.sql                ← criar tabelas no Neon
├── package.json
├── next.config.ts
└── README-VERCEL.md          ← este arquivo
```

---

## ✅ Checklist final

- [ ] Arquivos subidos para o GitHub
- [ ] Banco Neon criado
- [ ] schema.sql rodado no Neon
- [ ] Deploy na Vercel concluído
- [ ] Variável DATABASE_URL configurada
- [ ] **/api-setup acessado e admin criado**
- [ ] Login com admin/admin123 funcionando
- [ ] Senha trocada
- [ ] Número do WhatsApp configurado
- [ ] Produtos adicionados

Pronto! Sua loja CHOSEN ONE está no ar! 🎉
