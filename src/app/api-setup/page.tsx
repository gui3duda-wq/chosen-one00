'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runSetup = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/setup')
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult('Erro: ' + (e instanceof Error ? e.message : 'desconhecido'))
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-stone-900">Setup CHOSEN ONE</h1>
          <p className="text-sm text-stone-500 mt-1">
            Clique no botão abaixo para configurar o admin e as configurações iniciais.
          </p>
        </div>

        <button
          onClick={runSetup}
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Configurando...' : 'Configurar Admin'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <pre className="text-xs text-stone-700 whitespace-pre-wrap break-words">
              {result}
            </pre>
          </div>
        )}

        <div className="mt-6 text-xs text-stone-500 space-y-1">
          <p className="font-bold">Após configurar:</p>
          <p>1. Volte para a página inicial</p>
          <p>2. Clique em "Admin" no topo</p>
          <p>3. Login: <strong>admin</strong> / Senha: <strong>admin123</strong></p>
          <p>4. Troque a senha imediatamente em "Conta & Senha"</p>
        </div>
      </div>
    </div>
  )
}
