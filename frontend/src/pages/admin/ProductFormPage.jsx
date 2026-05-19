import { useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Upload, X, Plus, Check, ImageIcon, AlertCircle
} from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { useAuthStore } from '../../store/useAuthStore'
import { formatPrice } from '../../data/products'
import clsx from 'clsx'

const CATEGORIES = ['mates', 'termos', 'bombillas', 'combos', 'accesorios']
const BADGES = [
  { value: '', label: 'Sin badge' },
  { value: 'bestseller', label: 'Más vendido' },
  { value: 'new', label: 'Nuevo' },
  { value: 'sale', label: 'Oferta' },
]

const EMPTY_FORM = {
  name: '',
  category: 'mates',
  subcategory: '',
  price: '',
  originalPrice: '',
  description: '',
  badge: '',
  weight: '',
  dimensions: '',
  inStock: true,
  images: [],
  featuresList: [''],
  variants: [],
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-white/40 flex items-center gap-1">
        {label}
        {required && <span className="text-olive-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  )
}

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addProduct = useAdminStore((s) => s.addProduct)
  const updateProduct = useAdminStore((s) => s.updateProduct)
  const adminProducts = useAdminStore((s) => s.adminProducts)
  const token = useAuthStore((s) => s.token)
  const fileRef = useRef()

  const existing = id ? adminProducts.find((p) => p.id === Number(id)) : null

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        ...EMPTY_FORM,
        ...existing,
        price: String(existing.price),
        originalPrice: existing.originalPrice ? String(existing.originalPrice) : '',
        featuresList: existing.features?.length ? existing.features : [''],
        variants: existing.variants || [],
      }
    }
    return EMPTY_FORM
  })

  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  // ── Image handling ───────────────────────────────────────────────────────────
  const addImageByUrl = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    set('images', [...form.images, url])
    setImageUrlInput('')
  }

  const addImageByFile = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        set('images', [...form.images, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (i) => {
    set('images', form.images.filter((_, idx) => idx !== i))
  }

  // ── Features ────────────────────────────────────────────────────────────────
  const setFeature = (i, value) => {
    const list = [...form.featuresList]
    list[i] = value
    set('featuresList', list)
  }

  const addFeature = () => set('featuresList', [...form.featuresList, ''])
  const removeFeature = (i) => set('featuresList', form.featuresList.filter((_, idx) => idx !== i))

  // ── Variants ────────────────────────────────────────────────────────────────
  const addVariant = () =>
    set('variants', [...form.variants, { label: '', value: '', available: true }])

  const setVariant = (i, field, value) => {
    const list = [...form.variants]
    list[i] = { ...list[i], [field]: value }
    set('variants', list)
  }

  const removeVariant = (i) => set('variants', form.variants.filter((_, idx) => idx !== i))

  // ── Validate ────────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es requerido'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Ingresá un precio válido'
    if (!form.description.trim()) errs.description = 'La descripción es requerida'
    return errs
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      features: form.featuresList.filter((f) => f.trim()),
      images: form.images.length ? form.images : [`https://picsum.photos/seed/product-${Date.now()}/600/750`],
    }

    try {
      if (existing) {
        await updateProduct(existing.id, data, token)
      } else {
        await addProduct(data, token)
      }
      setSaved(true)
      setTimeout(() => navigate('/admin/productos'), 1200)
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  const price = Number(form.price) || 0
  const originalPrice = Number(form.originalPrice) || 0
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/admin/productos"
          className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">
            {existing ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-white/30 text-sm mt-0.5">
            {existing ? `Editando: ${existing.name}` : 'Completá los campos para agregar un producto a la tienda.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Basic info */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Información básica</h2>

              <Field label="Nombre del producto" required error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Ej: Mate Imperial Palo Santo"
                  className="admin-input"
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Categoría" required>
                  <select value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1A1A1A] capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Subcategoría">
                  <input
                    type="text"
                    value={form.subcategory}
                    onChange={(e) => set('subcategory', e.target.value)}
                    placeholder="Ej: imperial, camionero..."
                    className="admin-input"
                  />
                </Field>
              </div>

              <Field label="Descripción" required error={errors.description}>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describí el producto: materiales, usos, cuidados..."
                  className="admin-input resize-none"
                />
              </Field>
            </div>

            {/* Images */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Imágenes</h2>

              {/* Preview grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover rounded-xl border border-white/10"
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/prev-${i}/200/200` }}
                      />
                      {i === 0 && (
                        <span className="absolute bottom-1 left-1 bg-olive-600 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* URL input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageByUrl())}
                    placeholder="https://... URL de la imagen"
                    className="admin-input pl-9"
                  />
                </div>
                <button
                  type="button"
                  onClick={addImageByUrl}
                  className="px-4 py-2.5 rounded-xl bg-olive-600/20 hover:bg-olive-600/30 border border-olive-600/30 text-olive-400 text-sm font-medium transition-all duration-200"
                >
                  Agregar
                </button>
              </div>

              {/* File upload */}
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={addImageByFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-white/10 hover:border-olive-500/40 text-white/30 hover:text-white/60 transition-all duration-200 text-sm"
                >
                  <Upload size={18} />
                  Subir imagen desde tu computadora
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Características del producto</h2>
              <div className="flex flex-col gap-2">
                {form.featuresList.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={f}
                      onChange={(e) => setFeature(i, e.target.value)}
                      placeholder={`Característica ${i + 1}`}
                      className="admin-input flex-1"
                    />
                    {form.featuresList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all duration-200"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 text-sm text-olive-400 hover:text-olive-300 transition-colors duration-200 self-start"
              >
                <Plus size={14} />
                Agregar característica
              </button>
            </div>

            {/* Variants */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Variantes</h2>
              {form.variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.label}
                        onChange={(e) => setVariant(i, 'label', e.target.value)}
                        placeholder="Nombre (ej: Color negro)"
                        className="admin-input flex-1"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={v.available}
                          onChange={(e) => setVariant(i, 'available', e.target.checked)}
                          className="w-3.5 h-3.5 accent-olive-600"
                        />
                        Disponible
                      </label>
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all duration-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-sm text-olive-400 hover:text-olive-300 transition-colors duration-200 self-start"
              >
                <Plus size={14} />
                Agregar variante
              </button>
            </div>
          </div>

          {/* Right column (1/3) */}
          <div className="flex flex-col gap-5">

            {/* Pricing */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Precio</h2>

              <Field label="Precio (ARS)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="0"
                    className="admin-input pl-7"
                  />
                </div>
              </Field>

              <Field label="Precio original (antes del descuento)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)}
                    placeholder="Dejar vacío si no hay descuento"
                    className="admin-input pl-7"
                  />
                </div>
              </Field>

              {price > 0 && (
                <div className="rounded-xl bg-white/3 border border-white/5 p-4 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-white/40">
                    <span>Precio final</span>
                    <span className="text-white font-semibold">{formatPrice(price)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-white/40">
                      <span>Descuento</span>
                      <span className="text-red-400 font-semibold">{discount}% OFF</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status & Badge */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Estado</h2>

              <Field label="Badge">
                <select value={form.badge} onChange={(e) => set('badge', e.target.value)} className="admin-input">
                  {BADGES.map((b) => (
                    <option key={b.value} value={b.value} className="bg-[#1A1A1A]">{b.label}</option>
                  ))}
                </select>
              </Field>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/60 text-sm">En stock</span>
                <div
                  onClick={() => set('inStock', !form.inStock)}
                  className={clsx(
                    'w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer',
                    form.inStock ? 'bg-olive-600' : 'bg-white/10'
                  )}
                >
                  <div className={clsx(
                    'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
                    form.inStock ? 'translate-x-5' : 'translate-x-1'
                  )} />
                </div>
              </label>
            </div>

            {/* Dimensions */}
            <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Dimensiones</h2>
              <Field label="Peso">
                <input type="text" value={form.weight} onChange={(e) => set('weight', e.target.value)}
                  placeholder="Ej: 180g" className="admin-input" />
              </Field>
              <Field label="Dimensiones">
                <input type="text" value={form.dimensions} onChange={(e) => set('dimensions', e.target.value)}
                  placeholder="Ej: 12cm altura" className="admin-input" />
              </Field>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={clsx(
                'w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-300',
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-olive-600 hover:bg-olive-500 text-white shadow-lg shadow-olive-600/20 hover:-translate-y-0.5'
              )}
            >
              {saved ? <><Check size={16} /> ¡Guardado! Redirigiendo...</> : <>{existing ? 'Guardar cambios' : 'Crear producto'}</>}
            </button>

            <Link
              to="/admin/productos"
              className="text-center text-sm text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
