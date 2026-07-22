import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

/**
 * GET /api/setup — garante acesso ao admin + diagnostica problemas.
 *
 * Este endpoint é à prova de falhas:
 * - Retorna diagnóstico se o banco não conectar
 * - Cria admin com senha admin123 se não existir
 * - Redefine senha para admin123 se estiver corrompida
 * - Cria configurações se faltarem
 */
export async function GET() {
  const results: string[] = []
  let dbOk = false

  // 1. Testar conexão com o banco
  try {
    await db.$queryRaw`SELECT 1`
    dbOk = true
    results.push('✅ Conexão com banco de dados: OK')
  } catch (e) {
    console.error('[setup] Erro de banco:', e)
    return NextResponse.json({
      success: false,
      error: 'Não foi possível conectar ao banco de dados.',
      diagnosis: 'Verifique se a variável DATABASE_URL está configurada na Vercel e se as tabelas foram criadas (rode o schema.sql no Neon).',
      details: e instanceof Error ? e.message : String(e),
    }, { status: 500 })
  }

  try {
    // 2. Garantir admin com senha admin123
    const existingAdmin = await db.admin.findUnique({ where: { username: 'admin' } })

    if (!existingAdmin) {
      await db.admin.create({
        data: { username: 'admin', password: hashPassword('admin123') },
      })
      results.push('✅ Admin criado com senha admin123')
    } else {
      const senhaOk = verifyPassword('admin123', existingAdmin.password)
      if (!senhaOk) {
        await db.admin.update({
          where: { username: 'admin' },
          data: { password: hashPassword('admin123') },
        })
        results.push('✅ Senha do admin REDEFINIDA para admin123')
      } else {
        results.push('✅ Admin já existe e a senha admin123 funciona')
      }
    }

    // 3. Garantir configurações
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
      message: 'Setup concluído! Agora você pode fazer login.',
      results,
      login: {
        username: 'admin',
        password: 'admin123',
        url: '/',
      },
    })
  } catch (e) {
    console.error('[setup] Erro:', e)
    return NextResponse.json({
      success: false,
      error: 'Erro ao configurar admin.',
      diagnosis: 'O banco conectou, mas houve erro ao criar o admin. Tente rodar o schema.sql no Neon primeiro.',
      details: e instanceof Error ? e.message : String(e),
    }, { status: 500 })
  }
}
