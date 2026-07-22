import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

/**
 * GET /api/setup — garante que o admin existe com a senha padrão (admin123).
 *
 * USE ESTE ENDPOINT UMA VEZ APÓS O DEPLOY:
 * Acesse https://seu-site.vercel.app/api/setup no navegador.
 * Ele vai:
 *   1. Verificar se o admin "admin" existe
 *   2. Se não existir, criar com a senha "admin123"
 *   3. Se existir mas a senha estiver corrompida, redefinir para "admin123"
 *   4. Também cria as configurações padrão se faltarem
 *
 * Após acessar, faça login com admin / admin123 e TROQUE A SENHA imediatamente.
 */
export async function GET() {
  try {
    const results: string[] = []

    // 1. Garantir admin com senha admin123
    const existingAdmin = await db.admin.findUnique({ where: { username: 'admin' } })
    if (!existingAdmin) {
      await db.admin.create({
        data: { username: 'admin', password: hashPassword('admin123') },
      })
      results.push('✅ Admin criado com senha padrão (admin/admin123)')
    } else {
      // Verificar se a senha admin123 funciona
      const senhaOk = verifyPassword('admin123', existingAdmin.password)
      if (!senhaOk) {
        // Redefinir para admin123
        await db.admin.update({
          where: { username: 'admin' },
          data: { password: hashPassword('admin123') },
        })
        results.push('✅ Senha do admin redefinida para padrão (admin/admin123)')
      } else {
        results.push('✅ Admin já existe e a senha admin123 funciona')
      }
    }

    // 2. Garantir configurações padrão
    const settingsCount = await db.siteSetting.count()
    if (settingsCount === 0) {
      const defaults = [
        { key: 'storeName', value: 'CHOSEN ONE' },
        { key: 'storeTagline', value: 'O escolhido não erra. Apenas decide.' },
        { key: 'heroTitle', value: 'SEJA O\nESCOLHIDO.' },
        { key: 'heroSubtitle', value: 'Streetwear para quem não pede licença. Cada peça é uma declaração. O resto é barulho.' },
        { key: 'heroBadge', value: 'COLEÇÃO 01 — DESTINO' },
        { key: 'whatsappNumber', value: '5511999999999' },
        { key: 'whatsappMessage', value: 'Olá! Tenho interesse na peça {product} (Tam: {size}) — valor R$ {price}. Quero finalizar a compra.' },
        { key: 'contactEmail', value: 'contato@chosenone.com.br' },
        { key: 'contactInstagram', value: '@chosenone' },
        { key: 'footerText', value: 'CHOSEN ONE — Nascemos para ser escolhidos, não para ser mais um.' },
        { key: 'logoImage', value: '/uploads/co-logo-red.png' },
        { key: 'marqueeText', value: 'CHOSEN ONE • O ESCOLHIDO NÃO ERRA • VOCÊ DECIDE QUANDO TERMINA • UM PASSO DE CADA VEZ • NÃO NASCEMOS PARA SER MAIS UM •' },
      ]
      for (const s of defaults) {
        await db.siteSetting.create({ data: s })
      }
      results.push(`✅ ${defaults.length} configurações criadas`)
    } else {
      results.push(`✅ ${settingsCount} configurações já existem`)
    }

    return NextResponse.json({
      success: true,
      message: 'Setup concluído com sucesso!',
      results,
      nextSteps: [
        '1. Acesse a página inicial do site',
        '2. Clique em "Admin" no topo',
        '3. Faça login: usuário "admin" / senha "admin123"',
        '4. Vá em "Conta & Senha" e TROQUE a senha imediatamente',
        '5. Configure seu número de WhatsApp em "Aparência & Conteúdo"',
        '6. Adicione suas camisetas em "Produtos"',
      ],
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Erro no setup',
    }, { status: 500 })
  }
}
