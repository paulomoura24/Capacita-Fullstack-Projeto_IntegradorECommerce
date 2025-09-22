import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastCtx = createContext({ toast: () => { } })

export function ToastProvider({ children }) {
    const [msg, setMsg] = useState('')
    const toast = useCallback((m) => setMsg(m), [])
    useEffect(() => {
        if (!msg) return
        const t = setTimeout(() => setMsg(''), 2500)
        return () => clearTimeout(t)
    }, [msg])
    return (
        <ToastCtx.Provider value={{ toast }}>
            {children}
            {msg && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, background: '#1e2230',
                    color: '#fff', padding: '12px 16px', borderRadius: 12, border: '1px solid #333',
                    boxShadow: '0 8px 24px rgba(0,0,0,.35)', zIndex: 9999
                }}>
                    {msg}
                </div>
            )}
        </ToastCtx.Provider>
    )
}

export const useToast = () => useContext(ToastCtx)
