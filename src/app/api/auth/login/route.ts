import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuário e senha obrigatórios' }, { status: 400 })
    }

    // Verificar se o banco está acessível
    let admin
    try {
      admin = await db.admin.findUnique({ where: { username } })
    } catch (dbError) {
      console.error('[login] Erro de banco:', dbError)
      return NextResponse.json({
        error: 'Erro ao conectar com o banco de dados. Verifique se a DATABASE_URL está configurada e se as tabelas foram criadas (rode o schema.sql no Neon). Acesse /api-setup para configurar.',
      }, { status: 500 })
    }

    if (!admin || !verifyPassword(password, admin.password)) {
      return NextResponse.json({ error: 'Credenciais inválidas. Acesse /api-setup para restaurar o acesso.' }, { status: 401 })
    }

    const token = createSessionToken(admin.username)
    const res = NextResponse.json({ success: true, username: admin.username, token })

    const forwardedProto = req.headers.get('x-forwarded-proto') || ''
    const isHttps = forwardedProto.includes('https') || req.nextUrl.protocol === 'https:'
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    })
    return res
  } catch (error) {
    console.error('[login] Erro inesperado:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor. Tente acessar /api-setup primeiro.',
    }, { status: 500 })
  }
}
