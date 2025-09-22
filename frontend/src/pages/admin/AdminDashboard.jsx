import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

export default function AdminProducts() {
  const token = localStorage.getItem('token')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [id, setId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState(0)

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const reset = () => {
    setId(null)
    setTitle('')
    setDescription('')
    setPrice('')
    setStock(0)
    setImageFile(null)
    setImagePreview('')
    setImageLoading(false)
  }

  async function load() {
    setLoading(true); setError('')
    try {
      const arr = await api.listProducts()
      setList(arr)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  function validate() {
    if (!title || title.trim().length < 2) throw new Error('Título obrigatório (mín. 2 caracteres)')
    const p = Number(price); if (!(p >= 0)) throw new Error('Preço inválido')
    const s = Number(stock); if (!(s >= 0)) throw new Error('Estoque inválido')
    const d = String(description ?? '').trim()
    if (d.length < 10) throw new Error('Descrição deve ter pelo menos 10 caracteres')
    if (!id && !imageFile) throw new Error('Imagem do produto é obrigatória')
    if (imageLoading) throw new Error('Aguarde o upload/processamento da imagem…')
  }

  async function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return
    if (!f.type || !f.type.startsWith('image/')) { alert('Selecione uma imagem'); return }
    const MAX = 15 * 1024 * 1024
    if (f.size > MAX) { alert('Imagem acima de 15MB'); return }

    setImageLoading(true)
    try {
      setImageFile(f)
      setImagePreview(URL.createObjectURL(f))
    } finally {
      setImageLoading(false)
    }
  }

  async function save(e) {
    e.preventDefault()
    try {
      validate()
      const payload = {
        title: title.trim(),
        description: String(description ?? '').trim(),
        price: Number(price),
        stock: Number(stock),
      }

      if (id) {
        await api.updateProductMultipart(token, id, payload, imageFile || undefined)
      } else {
        await api.createProductMultipart(token, payload, imageFile)
      }

      reset()
      await load()
      alert('Produto salvo')
    } catch (err) {
      try {
        const j = JSON.parse(err.message)
        const det = Array.isArray(j.details) ? `\n• ${j.details.map(d => d.message).join('\n• ')}` : ''
        alert(`Erro: ${j.message || 'Falha ao salvar'}${det}`)
      } catch {
        alert('Erro: ' + err.message)
      }
    }
  }

  function edit(p) {
    setId(p.id)
    setTitle(p.title)
    setDescription(p.description || '')
    setPrice(p.price)
    setStock(p.stock)
    setImageFile(null)
    setImagePreview('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function del(id) {
    if (!confirm('Excluir produto #' + id + '?')) return
    try {
      await api.deleteProduct(token, id)
      await load()
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  return (
    <div>
      <form className="card" onSubmit={save}>
        <h3>{id ? 'Editar produto' : 'Novo produto'}</h3>

        <div className="row">
          <label style={{ flex: 3 }}>
            Título
            <input
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              minLength={2}
            />
          </label>

          <label style={{ flex: 1 }}>
            Preço
            <input
              className="input"
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </label>

          <label style={{ flex: 1 }}>
            Estoque
            <input
              className="input"
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Descrição
          <textarea
            className="input"
            placeholder="Descrição do produto"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            required
            minLength={10}
          />
        </label>

        <label>
          Imagem {id ? '(opcional para editar)' : '(obrigatória)'}
          <input className="input" type="file" accept="image/*" onChange={onFile} />
        </label>

        {imageLoading && <div className="badge">Processando arquivo…</div>}

        {(imagePreview) && (
          <div className="row" style={{ alignItems: 'center', gap: 12, margin: '6px 0 10px' }}>
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
            />
            <div className="badge">{imageFile?.name}</div>
            <div className="badge">{imageFile?.type || 'image/*'}</div>
          </div>
        )}

        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" type="submit" disabled={imageLoading}>
            {id ? 'Atualizar' : 'Criar'}
          </button>
          {id && (
            <button className="btn ghost" type="button" onClick={reset}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: 16 }}>Lista</h3>

      {loading ? (
        <div className="empty">Carregando...</div>
      ) : error ? (
        <div className="empty">Erro: {error}</div>
      ) : (
        <div className="grid">
          {list.map(p => (
            <div key={p.id} className="card">
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, alignItems: 'center' }}>
                <img
                  src={api.getProductImageUrl(p.id)}
                  alt={p.title}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div className="badge">R$ {Number(p.price).toFixed(2)} • Estoque {p.stock}</div>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                <button className="btn ghost" onClick={() => edit(p)}>Editar</button>
                <button className="btn" onClick={() => del(p.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
