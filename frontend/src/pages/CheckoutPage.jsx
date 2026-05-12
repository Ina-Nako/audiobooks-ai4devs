import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useCart } from '../context/CartContext'

function CheckoutPage() {
  const navigate = useNavigate()
  const { refreshCart } = useCart()
  const [form, setForm] = useState({ shipping_name: '', shipping_address: '', shipping_address_line2: '', shipping_city: '', shipping_state: '', shipping_zip: '', shipping_country: 'US' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await api.post('/orders', form)
    if (res.ok) {
      refreshCart()
      navigate('/orders')
    } else {
      const d = await res.json()
      setError(d.error || 'Checkout failed')
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header"><h1>Checkout</h1></div>

      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input required value={form.shipping_name} onChange={update('shipping_name')} />
        </div>
        <div className="form-group">
          <label>Address *</label>
          <input required value={form.shipping_address} onChange={update('shipping_address')} />
        </div>
        <div className="form-group">
          <label>Address Line 2</label>
          <input value={form.shipping_address_line2} onChange={update('shipping_address_line2')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>City *</label>
            <input required value={form.shipping_city} onChange={update('shipping_city')} />
          </div>
          <div className="form-group">
            <label>State/Province</label>
            <input value={form.shipping_state} onChange={update('shipping_state')} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div className="form-group">
            <label>ZIP/Postal Code *</label>
            <input required value={form.shipping_zip} onChange={update('shipping_zip')} />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <select required value={form.shipping_country} onChange={update('shipping_country')}>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="AL">Albania</option>
              <option value="XK">Kosovo</option>
              <option value="IT">Italy</option>
              <option value="GR">Greece</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-lg)' }}>
          Place Order
        </button>
      </form>
    </div>
  )
}

export default CheckoutPage
