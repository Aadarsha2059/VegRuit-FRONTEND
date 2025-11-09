import React, { useState } from 'react'
import './DeliveryTab.css'

const DeliveryTab = ({ user, orders }) => {
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    district: '',
    landmark: '',
    isDefault: false
  })

  // Mock addresses - in real app, fetch from backend
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: user?.firstName + ' ' + user?.lastName || 'John Doe',
      phone: user?.phone || '9841234567',
      street: 'Thamel, Ward 26',
      city: 'Kathmandu',
      district: 'Kathmandu',
      landmark: 'Near Garden of Dreams',
      isDefault: true
    }
  ])

  const handleAddAddress = () => {
    setShowAddressForm(true)
    setEditingAddress(null)
    setAddressForm({
      fullName: user?.firstName + ' ' + user?.lastName || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      district: '',
      landmark: '',
      isDefault: false
    })
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressForm(address)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== addressId))
    }
  }

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })))
  }

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addressForm, id: addr.id } : addr
      ))
    } else {
      setAddresses([...addresses, { ...addressForm, id: Date.now() }])
    }
    setShowAddressForm(false)
  }

  const getRecentDeliveries = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .slice(0, 5)
  }

  return (
    <div className="delivery-tab">
      <div className="delivery-header">
        <h2>🚚 Delivery Management</h2>
        <p>Manage your delivery addresses and track orders</p>
      </div>

      {/* Delivery Addresses */}
      <div className="delivery-section">
        <div className="section-header">
          <h3>📍 Delivery Addresses</h3>
          <button className="btn btn-primary" onClick={handleAddAddress}>
            ➕ Add New Address
          </button>
        </div>

        <div className="addresses-grid">
          {addresses.map((address) => (
            <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              {address.isDefault && (
                <div className="default-badge">✓ Default</div>
              )}
              
              <div className="address-icon">📍</div>
              
              <div className="address-info">
                <h4>{address.fullName}</h4>
                <p className="address-phone">📞 {address.phone}</p>
                <p className="address-details">
                  {address.street}<br />
                  {address.city}, {address.district}<br />
                  {address.landmark && `Landmark: ${address.landmark}`}
                </p>
              </div>

              <div className="address-actions">
                {!address.isDefault && (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditAddress(address)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Address Form */}
      {showAddressForm && (
        <div className="address-form-modal">
          <div className="address-form-container">
            <div className="form-header">
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="close-btn" onClick={() => setShowAddressForm(false)}>×</button>
            </div>

            <div className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                  placeholder="House no., Street name, Area"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>District *</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                    placeholder="Enter district"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                  placeholder="Nearby landmark for easy delivery"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  />
                  <span>Set as default address</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn-outline" onClick={() => setShowAddressForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveAddress}>
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Deliveries */}
      <div className="delivery-section">
        <h3>📦 Recent Deliveries</h3>
        {getRecentDeliveries().length > 0 ? (
          <div className="deliveries-list">
            {getRecentDeliveries().map((order) => (
              <div key={order._id} className="delivery-item">
                <div className="delivery-icon">✅</div>
                <div className="delivery-info">
                  <h4>Order #{order.orderNumber}</h4>
                  <p>Delivered on {new Date(order.deliveredAt || order.updatedAt).toLocaleDateString()}</p>
                  <p className="delivery-address">
                    📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                </div>
                <div className="delivery-amount">
                  Rs. {order.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-deliveries">
            <p>No delivered orders yet</p>
          </div>
        )}
      </div>

      {/* Delivery Info */}
      <div className="delivery-info-section">
        <h3>ℹ️ Delivery Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">🚚</div>
            <h4>Fast Delivery</h4>
            <p>Same-day delivery available in Kathmandu Valley</p>
          </div>
          <div className="info-item">
            <div className="info-icon">📦</div>
            <h4>Secure Packaging</h4>
            <p>All products are carefully packed to ensure freshness</p>
          </div>
          <div className="info-item">
            <div className="info-icon">💯</div>
            <h4>Quality Guarantee</h4>
            <p>100% fresh products or money back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryTab
