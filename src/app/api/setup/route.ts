import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

/**
 * GET /api/setup — SEMPRE garante acesso ao admin.
 *
 * Este endpoint é à prova de falhas:
 * - Se não tem admin → cria com senha admin123
 * - Se tem admin mas a senha não é admin123 → REDEFINE para admin123
 * - Se já está correto → mantém
 *
 * Acesse https://seu-site.vercel.app/api-setup SEMPRE que tiver problema de login.
 */
export async function GET() {
  try {
    const results: string[] = []

    // 1. SEMPRE garantir que o admin existe com senha admin123
    const existingAdmin = await db.admin.findUnique({ where: { username: 'admin' } })

    if (!existingAdmin) {
      // Criar admin do zero
      await db.admin.create({
        data: { username: 'admin', password: hashPassword('admin123') },
      })
      results.push('✅ Admin criado com senha admin123')
    } else {
      // Admin existe — verificar se a senha admin123 funciona
      const senhaOk = verifyPassword('admin123', existingAdmin.password)
      if (!senhaOk) {
        // REDEFINIR para admin123 (sobrescreve qualquer senha que não funcione)
        await db.admin.update({
          where: { username: 'admin' },
          data: { password: hashPassword('admin123') },
        })
        results.push('✅ Senha do admin REDEFINIDA para admin123 (acesso restaurado)')
      } else {
        results.push('✅ Admin já existe e a senha admin123 funciona')
      }
    }

    // 2. Garantir configurações padrão (não sobrescreve existentes)
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
        { key: 'marqueeText', value: 'CHOSEN ONE • O ESCOLHIDO NÃO ERRRA • VOCÊ DECIDE QUANDO TERMINA • UM PASSO DE CADA VEZ • NÃO NASCEMOS PARA SER MAIS UM •' },
      ]
      for (const s of defaults) {
        await db.siteSetting.create({ data: s })
      }
      results.push(`✅ ${defaults.length} configurações criadas`)
    } else {
      results.push(`✅ ${settingsCount} configurações já existem (preservadas)`)
    }

    return NextResponse.json({
      success: true,
      message: 'Setup concluído! Agora você pode fazer login.',
      results,
      login: {
        username: 'admin',
        password: 'admin123',
        url: '/',
      },
      nextSteps: [
        '1. Volte para a página inicial',
        '2. Clique em "Admin" no topo',
        '3. Login: admin / admin123',
        '4. Troque a senha em "Conta & Senha"',
      ],
    })
  } catch (e) {
    console.error('[setup] Erro:', e)
    return NextResponse.json({
      success: false,
      error: e instanceof Error ? e.message : 'Erro no setup',
    }, { status: 500 })
  }
}
