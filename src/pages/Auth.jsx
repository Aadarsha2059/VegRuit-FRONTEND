import React, { useMemo, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const useAuthImages = () => {
  const images = useMemo(() => {
    const modules = import.meta.glob('../assets/login_signup_images/*', {
      eager: true,
      as: 'url'
    })
    const map = {}
    Object.entries(modules).forEach(([path, url]) => {
      map[path.toLowerCase()] = url
    })
    return map
  }, [])

  const getImageUrl = (mode, userType) => {
    const modeKeys = mode === 'login' ? ['login'] : ['sign up', 'signup']
    const typeKey = userType
    const match = Object.entries(images).find(([key]) => {
      const hasType = key.includes(typeKey)
      const hasMode = modeKeys.some((mk) => key.includes(mk))
      return hasType && hasMode
    })
    return match ? match[1] : undefined
  }

  return { getImageUrl }
}

const Toggle = ({ labelLeft, labelRight, value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm ${value === 'buyer' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{labelLeft}</span>
      <button
        type="button"
        onClick={() => onChange(value === 'buyer' ? 'seller' : 'buyer')}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-200 transition-colors duration-300"
        aria-label="Flip buyer/seller"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${value === 'buyer' ? 'translate-x-1' : 'translate-x-5'}`}
        />
      </button>
      <span className={`text-sm ${value === 'seller' ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{labelRight}</span>
    </div>
  )
}

const Field = ({ id, label, type = 'text', value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
    />
  </div>
)

const Auth = ({ initialMode = 'login' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [userType, setUserType] = useState('buyer') // 'buyer' | 'seller'
  const { getImageUrl } = useAuthImages()

  useEffect(() => {
    if (location.pathname.includes('/signup')) setMode('signup')
    if (location.pathname.includes('/login')) setMode('login')
  }, [location.pathname])

  const isLogin = mode === 'login'
  const headerTitle = isLogin
    ? `Welcome to ${userType === 'buyer' ? 'Buyer' : 'Seller'} Login Page`
    : `Welcome to ${userType === 'buyer' ? 'Buyer' : 'Seller'} Sign Up Page`

  // Form state
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    contact: '',
    address: '',
    shopName: '',
    shopAddress: ''
  })

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for API integration later
    // For now, just navigate to home
    navigate('/')
  }

  const sideImageUrl = getImageUrl(mode, userType)

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 px-4 pt-24 pb-16 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Toggle
              labelLeft="Buyer"
              labelRight="Seller"
              value={userType}
              onChange={setUserType}
            />
            <div className="text-sm text-gray-600">
              {isLogin ? (
                <span>
                  Don’t have an account?{' '}
                  <Link className="text-green-600 hover:underline" to="/signup" onClick={() => setMode('signup')}>
                    Sign Up
                  </Link>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <Link className="text-green-600 hover:underline" to="/login" onClick={() => setMode('login')}>
                    Login
                  </Link>
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">{headerTitle}</h1>
          <p className="text-gray-600 mb-8">Fruits and Vegetables Buy/Sell platform</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Common fields */}
            <Field id="username" label="Username" value={form.username} onChange={(v) => setField('username', v)} placeholder="Enter username" />
            <Field id="email" label="Email" type="email" value={form.email} onChange={(v) => setField('email', v)} placeholder="you@example.com" />
            <Field id="password" label="Password" type="password" value={form.password} onChange={(v) => setField('password', v)} placeholder="••••••••" />

            {/* Mode-specific fields */}
            {isLogin ? null : (
              <>
                <Field id="contact" label="Contact Number" value={form.contact} onChange={(v) => setField('contact', v)} placeholder="98XXXXXXXX" />
                {userType === 'buyer' ? (
                  <Field id="address" label="Address" value={form.address} onChange={(v) => setField('address', v)} placeholder="Your address" />
                ) : (
                  <>
                    <Field id="shopName" label="Shop Name" value={form.shopName} onChange={(v) => setField('shopName', v)} placeholder="Your shop name" />
                    <Field id="shopAddress" label="Shop Address" value={form.shopAddress} onChange={(v) => setField('shopAddress', v)} placeholder="Shop full address" />
                  </>
                )}
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between -mt-1">
                <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  Remember me
                </label>
                <button type="button" className="text-sm text-green-700 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex justify-center items-center rounded-md bg-green-600 px-4 py-3 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors shadow"
            >
              {isLogin
                ? `Login as ${userType === 'buyer' ? 'Buyer' : 'Seller'}`
                : `Sign Up as ${userType === 'buyer' ? 'Buyer' : 'Seller'}`}
            </button>

            <button
              type="button"
              onClick={() => setUserType(userType === 'buyer' ? 'seller' : 'buyer')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isLogin
                ? `Flip to Login ${userType === 'buyer' ? 'Seller' : 'Buyer'}`
                : `Flip to Sign Up ${userType === 'buyer' ? 'Seller' : 'Buyer'}`}
            </button>
          </form>
        </div>

        {/* Side / Background Image */}
        <div className="relative hidden lg:block overflow-hidden rounded-2xl border border-white shadow-xl">
          {sideImageUrl ? (
            <img src={sideImageUrl} alt="Auth visual" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-green-100 to-green-200" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
            <div className="text-white">
              <p className="text-sm opacity-90">Fresh from local farmers</p>
              <p className="text-lg font-semibold">Eat healthy, live better</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth


