# VegRuit Authentication System

## Overview

This document describes the enhanced authentication system for VegRuit, a fresh fruits and vegetables marketplace focused on Kathmandu, Nepal. The system supports both buyers and sellers with separate login and registration flows.

## Features

### 🔐 Dual Authentication System
- **Buyer Login/Signup**: For customers who want to purchase fresh produce
- **Seller Login/Signup**: For farmers and vendors who want to sell their products

### 🎨 Professional UI/UX
- Modern, responsive design with smooth animations
- User type toggle buttons for easy switching
- Professional color scheme representing freshness
- Mobile-first responsive design

### 🖼️ Dynamic Image Display
- Different images for buyer and seller modes
- Uses assets from `src/assets/login_signup_images/`
- Contextual messaging based on user type

### 🔄 Seamless Mode Switching
- Toggle between buyer and seller modes
- Maintains form state when switching
- Consistent user experience across modes

## Demo Credentials

### Buyer Accounts
```
Username: buyer123
Password: password

Username: aadarsha123
Password: password
```

### Seller Accounts
```
Username: farmer123
Password: password

Username: seller123
Password: password
```

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Auth.jsx          # Main auth container component
│   ├── Login.jsx             # Enhanced login component
│   └── SignUp.jsx            # Enhanced signup component
├── services/
│   └── authAPI.js            # Authentication API service
├── styles/
│   └── Auth.css              # Authentication styles
└── assets/
    └── login_signup_images/  # Login/signup background images
```

## Components

### 1. Auth.jsx
Main container component that handles switching between login and signup modes.

**Props:**
- `onClose`: Function to close the auth modal
- `onSuccess`: Function called on successful authentication

### 2. Login.jsx
Enhanced login component with buyer/seller toggle.

**Features:**
- User type selection (Buyer/Seller)
- Username and password fields
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social login options
- Dynamic content based on user type

### 3. SignUp.jsx
Enhanced signup component with buyer/seller toggle.

**Features:**
- User type selection (Buyer/Seller)
- Comprehensive registration form
- Form validation
- Dynamic field labels based on user type
- City selection dropdown
- Terms and conditions acceptance

## API Integration

### Current Implementation
The system currently uses mock API calls that simulate real backend responses. This makes it easy to test and develop the frontend while preparing for backend integration.

### Future MERN Stack Integration
The `authAPI.js` service is designed to easily switch from mock data to real API calls:

```javascript
// Current mock implementation
const response = await authAPI.loginBuyer(credentials)

// Future real API implementation
// The same function calls will work with real backend endpoints
```

### API Endpoints (Future)
```
POST /api/auth/buyer/login
POST /api/auth/seller/login
POST /api/auth/buyer/register
POST /api/auth/seller/register
POST /api/auth/logout
GET  /api/auth/verify-token
```

## Styling

### CSS Classes
- `.user-type-toggle`: Container for buyer/seller toggle buttons
- `.toggle-btn`: Individual toggle button styles
- `.toggle-btn.active`: Active state styling
- `.login-image`, `.signup-image`: Background image styling

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized for tablets and phones

## Usage

### 1. Opening the Auth Modal
```javascript
const [showAuth, setShowAuth] = useState(false)

const handleAuthClick = () => {
  setShowAuth(true)
}

// In JSX
{showAuth && (
  <Auth
    onClose={() => setShowAuth(false)}
    onSuccess={handleAuthSuccess}
  />
)}
```

### 2. Handling Authentication Success
```javascript
const handleAuthSuccess = (userData) => {
  setUser(userData)
  setShowAuth(false)
  
  // Redirect based on user type
  if (userData.userType === 'buyer') {
    navigate('/dashboard')
  } else {
    navigate('/seller-dashboard')
  }
}
```

### 3. User State Management
```javascript
const [user, setUser] = useState(null)

useEffect(() => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  
  if (userData && token) {
    setUser(JSON.parse(userData))
  }
}, [])
```

## Testing

### Manual Testing
1. Click "Login / Sign Up" button in header
2. Test buyer login with demo credentials
3. Test seller login with demo credentials
4. Test switching between buyer and seller modes
5. Test signup flow for both user types
6. Test form validation and error handling

### Demo Scenarios
- **Buyer Journey**: Login → Dashboard → Browse Products
- **Seller Journey**: Login → Seller Dashboard → Manage Products
- **New User**: Signup → Account Creation → Welcome Flow

## Future Enhancements

### 1. Real Backend Integration
- Replace mock API calls with real endpoints
- Implement JWT token authentication
- Add password hashing and security measures

### 2. Enhanced Features
- Email verification
- Password recovery
- Two-factor authentication
- Social login integration (Google, Facebook)

### 3. User Management
- Profile editing
- Account settings
- Order history
- Payment integration

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Lazy loading of auth components
- Optimized image assets
- Minimal bundle size impact
- Fast modal transitions

## Security Considerations

### Current (Development)
- Mock authentication for development
- Local storage for user data
- Basic form validation

### Production Ready
- HTTPS enforcement
- JWT token management
- Secure password handling
- CSRF protection
- Rate limiting

## Support

For questions or issues with the authentication system, please refer to the main project documentation or contact the development team.

---

**VegRuit** - Bringing fresh, local produce from Kathmandu Valley to your doorstep! 🌱🍎🥬
