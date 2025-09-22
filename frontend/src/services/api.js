const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, { method = 'GET', body, token, headers } = {}) {
  const isForm = body instanceof FormData
  const url = API_URL.replace(/\/$/, '') + path

  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      body: isForm ? body : (body ? JSON.stringify(body) : undefined),
    })

    // HTTP != 2xx
    if (!res.ok) {
      const ct = res.headers.get('content-type') || ''
      let errMsg = res.statusText
      if (ct.includes('application/json')) {
        let j = null
        try { j = await res.json() } catch { }
        if (j) errMsg = j.error?.message || j.error || j.message || j.msg || JSON.stringify(j)
      } else {
        const t = await res.text().catch(() => '')
        if (t) errMsg = t
      }
      throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg))
    }

    // OK
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return res.json()
    return res

  } catch (e) {
    // Erro de REDE (CORS, DNS, servidor offline, mixed content, etc.)
    // TypeError: Failed to fetch, NetworkError...
    console.error('[NETWORK ERROR]', { url, method, isForm, e })
    throw new Error(`Falha de rede ao acessar ${url}: ${e.message}`)
  }
}

const pickProducts = (p) => Array.isArray(p) ? p : (p?.products ?? [])
const pickOrders = (p) => Array.isArray(p) ? p : (p?.orders ?? [])

function normalizeProduct(it = {}) {
  const priceRaw = it.price ?? it.unitPrice ?? it.amount ?? it.valor ?? 0
  const stockRaw = it.stock ?? it.qty ?? it.quantity ?? it.available ?? it.availableStock ?? 0
  return {
    id: Number(it.id),
    title: it.title ?? it.name ?? 'Produto',
    description: typeof it.description === 'string' ? it.description : '',
    price: Number(priceRaw),
    stock: Number(stockRaw),
    ownerId: it.ownerId,
    createdAt: it.createdAt,
    _raw: it
  }
}

export const api = {

  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  me: (token) => request('/users/me', { token }),


  listProducts: async () => { const r = await request('/products'); return pickProducts(r).map(normalizeProduct) },
  getProduct: async (id) => normalizeProduct((await request(`/products/${id}`)).product ?? await request(`/products/${id}`)),

  getProductImageUrl: (id) => `${API_URL}/products/${id}/image`,


  createProductMultipart: (token, { title, description, price, stock }, file) => {
    const fd = new FormData()
    fd.append('title', String(title ?? ''))
    fd.append('description', String(description ?? ''))
    fd.append('price', String(Number(price ?? 0)))
    fd.append('stock', String(Number(stock ?? 0)))


    if (file) {
      fd.append('image', file)
      fd.append('file', file)
    }
    return request('/products', { method: 'POST', token, body: fd })
  },


  updateProductMultipart: (token, id, { title, description, price, stock }, file) => {
    const fd = new FormData()
    if (title != null) fd.append('title', String(title))
    if (description != null) fd.append('description', String(description))
    if (price != null) fd.append('price', String(Number(price)))
    if (stock != null) fd.append('stock', String(Number(stock)))
    if (file) {
      fd.append('image', file)
      fd.append('file', file)
    }
    return request(`/products/${id}`, { method: 'PUT', token, body: fd })
  },

  deleteProduct: (token, id) => request(`/products/${id}`, { method: 'DELETE', token }),


  myOrders: async (token) => pickOrders(await request('/orders', { token })),
  createOrder: (token, payload) => request('/orders', { method: 'POST', token, body: payload }),
}
