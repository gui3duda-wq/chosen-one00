# CHOSEN ONE — Deploy na Vercel

## ⚠️ LEIA ISTO PRIMEIRO!

Após o deploy, você PRECISA acessar a página de setup para criar o admin:
```
https://SEU-SITE.vercel.app/api-setup
```

---

## PASSO 1: Subir para o GitHub

1. Crie um repositório no GitHub (https://github.com/new)
2. Nome: `chosen-one`
3. Clique em "uploading an existing file"
4. Arraste TODOS os arquivos desta pasta (não a pasta inteira)
5. Commit changes

## PASSO 2: Criar banco PostgreSQL (Neon)

1. Acesse https://neon.tech → Sign up
2. New Project → nome: `chosen-one`
3. Copie a Connection String

## PASSO 3: Criar tabelas

1. No painel do Neon → SQL Editor
2. Cole o conteúdo do arquivo `schema.sql`
3. Clique em Run

## PASSO 4: Deploy na Vercel

1. Acesse https://vercel.com → Signup (entre com GitHub)
2. "Add New" → "Project"
3. Selecione o repositório `chosen-one`
4. Em Environment Variables, adicione:
   - DATABASE_URL = (cole a string do Neon)
5. Clique em Deploy

## PASSO 5: ⚠️ CONFIGURAR O ADMIN (OBRIGATÓRIO!)

1. Após o deploy, acesse: `https://SEU-SITE.vercel.app/api-setup`
2. Clique em "🔓 Restaurar acesso admin"
3. Vai aparecer: "Admin criado com senha admin123"

## PASSO 6: Acessar o site

1. Acesse `https://SEU-SITE.vercel.app`
2. Clique em "Admin" no topo
3. Login: admin / admin123
4. TROQUE A SENHA em "Conta & Senha"

---

## 🆘 PROBLEMAS?

### Senha não funciona
Acesse: `https://SEU-SITE.vercel.app/api-setup` e clique em "Restaurar acesso admin"

### Logo não carrega
A logo está em `public/uploads/co-logo-red.png`. Verifique se o arquivo está no GitHub.

### Erro de build
Verifique se a variável DATABASE_URL está configurada na Vercel.
