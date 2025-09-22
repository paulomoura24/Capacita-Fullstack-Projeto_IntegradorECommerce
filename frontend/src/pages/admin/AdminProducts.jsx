import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'

// ---------- helpers ----------
function guessMimeByName(name = '') {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg'
  if (ext === 'png') return 'image/png'
  if (ext === 'gif') return 'image/gif'
  if (ext === 'webp') return 'image/webp'
  if (ext === 'bmp') return 'image/bmp'
  if (ext === 'svg') return 'image/svg+xml'
  return null
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      const b64 = dataUrl.includes(',') ? dataUrl.split(',').pop() : ''
      resolve(b64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
// --------------------------------

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

  const [imageBase64, setImageBase64] = useState(null)
  const [imageMime, setImageMime] = useState(null)
  const [imageName, setImageName] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const reset = () => {
    setId(null)
    setTitle('')
    setDescription('')
    setPrice('')
    setStock(0)
    setImageBase64(null)
    setImageMime(null)
    setImageName(null)
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

    // criação exige imagem completa; edição permite sem imagem
    if (!id) {
      if (!imageBase64) throw new Error('Imagem do produto é obrigatória')
      if (!imageMime) throw new Error('imageMime é obrigatório')
      if (!imageName) throw new Error('imageName é obrigatório')
      // 🔧 base64 precisa ter conteúdo suficiente (evita string vazia)
      if (typeof imageBase64 !== 'string' || imageBase64.trim().length < 50) {
        throw new Error('Imagem inválida (base64 vazio ou muito curto)')
      }
    }
    // se enviar nova imagem na edição, precisa mime/name
    if (id && imageBase64) {
      if (!imageMime) throw new Error('imageMime é obrigatório quando enviar nova imagem')
      if (!imageName) throw new Error('imageName é obrigatório quando enviar nova imagem')
      if (imageBase64.trim().length < 50) {
        throw new Error('Imagem inválida (base64 vazio ou muito curto)')
      }
    }
    if (imageLoading) throw new Error('Aguarde o processamento da imagem…')
  }

  async function onFile(e) {
    const f = e.target.files?.[0]; if (!f) return

    // validações rápidas
    const mimeFromFile = f.type
    const mimeGuessed = guessMimeByName(f.name)
    if (!mimeFromFile && !mimeGuessed) {
      alert('Selecione um arquivo de imagem válido (jpg, png, webp, etc.)')
      return
    }
    const MAX = 10 * 1024 * 1024 // 10MB (mantenha ≤ limite do backend)
    if (f.size > MAX) { alert('Imagem acima de 10MB'); return }

    setImageLoading(true)
    try {
      const b64 = await fileToBase64(f)
      const mime = mimeFromFile || mimeGuessed || 'image/jpeg'
      setImageBase64(b64)
      setImageMime(mime)
      setImageName(f.name)
      setImagePreview(URL.createObjectURL(f))
      // 🔧 debug opcional: tamanho aproximado (bytes) = base64 * 3/4
      // console.log('img:', { name: f.name, mime, size: f.size, b64Len: b64?.length })
    } catch (err) {
      console.error(err)
      alert('Falha ao ler a imagem')
      setImageBase64(null)
      setImageMime(null)
      setImageName(null)
      setImagePreview('')
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
        imageBase64: imageBase64 || null,
        imageMime: imageMime || null,
        imageName: imageName || null
      }
      // 🔧 log no console para conferir antes do POST
      console.log('POST /products payload →', {
        ...payload,
        imageBase64: payload.imageBase64 ? `(base64 length: ${payload.imageBase64.length})` : null
      })

      if (id) {
        await api.updateProductJson(token, id, payload)
      } else {
        await api.createProductJson(token, payload)
      }
      reset()
      await load()
      alert('Produto salvo')
    } catch (err) {
      // melhora a exibição das mensagens do backend (ex.: Zod)
      try {
        const j = JSON.parse(err.message)
        const det = Array.isArray(j.details) ? `\n• ${j.details.map(d => d.message).join('\n• ')}` : ''
        alert(`Erro: ${j.message || 'Falha ao salvar'}${det}`)
      } catch {
        alert('Erro: ' + err.message)
      }
    }
  }

  async function edit(p) {
    setId(p.id)
    setTitle(p.title)
    setPrice(p.price)
    setStock(p.stock)
    setImageBase64(null)
    setImageMime(null)
    setImageName(null)
    setImagePreview('')

    setDescription('')

    try {
      const full = await api.getProduct(p.id)
      setDescription(full?.description || '')
    } catch (_) {
      setDescription('')
    }

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

        {imageLoading && <div className="badge">Processando imagem…</div>}

        {(imageName || imageMime) && (
          <div className="row" style={{ alignItems: 'center', gap: 12, margin: '6px 0 10px' }}>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
              />
            )}
            <div className="badge">{imageName || '(sem nome)'}</div>
            <div className="badge">{imageMime || '(sem mime)'}</div>
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
