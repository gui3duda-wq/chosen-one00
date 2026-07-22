'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runSetup = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/setup')
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ success: false, error: e instanceof Error ? e.message : 'desconhecido' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-stone-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-stone-900">Configurar Admin</h1>
          <p className="text-sm text-stone-500 mt-1">
            Clique no botão abaixo para garantir seu acesso ao painel admin.
          </p>
        </div>

        <button
          onClick={runSetup}
          disabled={loading}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-base hover:bg-red-700 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? 'Configurando...' : '🔓 Restaurar acesso admin'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded-xl border ${result.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            {result.success ? (
              <>
                <p className="font-bold text-emerald-800 mb-2">{result.message}</p>
                <div className="text-xs text-emerald-700 space-y-1 mb-3">
                  {result.results?.map((r: string, i: number) => (
                    <p key={i}>{r}</p>
                  ))}
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs font-bold text-stone-700 mb-1">Credenciais de acesso:</p>
                  <p className="text-sm text-stone-900">Usuário: <strong>admin</strong></p>
                  <p className="text-sm text-stone-900">Senha: <strong>admin123</strong></p>
                </div>
                <a href="/" className="block mt-4 w-full bg-stone-900 text-white text-center py-3 rounded-xl font-bold text-sm hover:bg-stone-800">
                  Ir para o site →
                </a>
              </>
            ) : (
              <p className="text-red-800 text-sm">❌ {result.error}</p>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-stone-500 space-y-1 border-t border-stone-100 pt-4">
          <p className="font-bold text-stone-700">Como usar:</p>
          <p>1. Clique em "Restaurar acesso admin"</p>
          <p>2. Volte para o site e clique em "Admin"</p>
          <p>3. Login: <strong>admin</strong> / Senha: <strong>admin123</strong></p>
          <p>4. Troque a senha em "Conta & Senha"</p>
        </div>
      </div>
    </div>
  )
}
