import React, { useState } from 'react'
import VaaniAI from './vaani-ai.jsx'

// ── API KEY GATE ─────────────────────────────────────────────
// Vaani AI needs an Anthropic API key to work.
// Key is saved in localStorage so user only enters it once.

function ApiKeyGate({ children }) {
  const stored = localStorage.getItem('vaani_api_key') || ''
  const [key, setKey]     = useState(stored)
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  if (key) return children

  const save = () => {
    const k = input.trim()
    if (!k.startsWith('sk-ant-')) {
      setError('API key should start with "sk-ant-" — please check and try again.')
      return
    }
    localStorage.setItem('vaani_api_key', k)
    // Patch fetch so the key is always sent
    const origFetch = window.fetch
    window._vaaniKey = k
    setKey(k)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0B0D12', fontFamily: 'Inter, sans-serif',
      padding: 20,
    }}>
      <div style={{
        background: '#131720', border: '1px solid #1F2535',
        borderRadius: 16, padding: '36px 32px', maxWidth: 440, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,.5)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13,
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: '#fff',
          }}>✦</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#E6EAF4', letterSpacing: -.5 }}>Vaani AI</div>
            <div style={{ fontSize: 11, color: '#5B8AF0', fontWeight: 700 }}>India's Best AI Chatbot</div>
          </div>
        </div>

        <div style={{ fontSize: 14, color: '#7D8BA3', marginBottom: 24, lineHeight: 1.7 }}>
          Vaani AI uses the <strong style={{ color: '#E6EAF4' }}>Anthropic API</strong> to power its responses.
          Enter your API key below to get started. Your key is saved only in your browser.
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#7D8BA3', letterSpacing: .5, textTransform: 'uppercase' }}>
            Anthropic API Key
          </label>
          <input
            type="password"
            placeholder="sk-ant-api03-..."
            value={input}
            onChange={e => { setInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && save()}
            style={{
              display: 'block', width: '100%', marginTop: 8,
              background: '#0B0D12', border: '1.5px solid #252C3A',
              borderRadius: 10, padding: '12px 14px',
              color: '#E6EAF4', fontSize: 14, fontFamily: 'Fira Code, monospace',
              outline: 'none',
            }}
          />
          {error && <div style={{ fontSize: 12, color: '#F87171', marginTop: 6 }}>{error}</div>}
        </div>

        <button onClick={save} style={{
          width: '100%', marginTop: 16, padding: '13px',
          background: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
          border: 'none', borderRadius: 10, color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 4px 14px rgba(37,99,235,.4)',
        }}>
          Start Using Vaani AI →
        </button>

        <div style={{ marginTop: 16, fontSize: 12, color: '#3E4A5C', textAlign: 'center' }}>
          Get your API key from{' '}
          <a href="https://console.anthropic.com" target="_blank" rel="noreferrer"
            style={{ color: '#5B8AF0', textDecoration: 'none' }}>
            console.anthropic.com
          </a>
        </div>
      </div>
    </div>
  )
}

// Patch fetch to auto-inject API key for Anthropic calls
const origFetch = window.fetch
window.fetch = function(url, opts = {}) {
  const key = localStorage.getItem('vaani_api_key')
  if (key && typeof url === 'string' && url.includes('api.anthropic.com')) {
    opts = { ...opts, headers: { ...opts.headers, 'x-api-key': key } }
  }
  return origFetch(url, opts)
}

export default function App() {
  return (
    <ApiKeyGate>
      <VaaniAI />
    </ApiKeyGate>
  )
}
