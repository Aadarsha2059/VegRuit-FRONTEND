# TarkariShop Frontend

A modern React-based frontend for the TarkariShop application, featuring separate dashboards for buyers and sellers with full authentication capabilities.

## Features

- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **User Authentication**: Complete login and registration system for buyers and sellers
- **Separate Dashboards**: 
  - **Buyer Dashboard**: Order management, favorites, delivery addresses, reviews
  - **Seller Dashboard**: Product management, order handling, earnings analytics, farm settings
- **Toast Notifications**: User feedback using react-hot-toast
- **Protected Routes**: Role-based access control
- **Real-time API Integration**: Full MERN stack integration with backend

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

## Installation

1. Navigate to the frontend directory:
```bash
cd tarkarishop_frontend/tarkari_shop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── api/              # API service layer
├── assets/           # Static assets (images, icons)
├── auth/             # Authentication components
│   └── Auth.jsx      # Main auth modal
├── components/       # Reusable components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard-specific components
│   ├── Header.jsx    # Navigation header
│   ├── Hero.jsx      # Landing page hero
│   ├── Login.jsx     # Login form
│   ├── SignUp.jsx    # Registration form
│   └── ...           # Other components
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── pages/            # Page components
│   ├── BuyerDashboard.jsx    # Buyer dashboard
│   └── SellerDashboard.jsx   # Seller dashboard
├── routers/          # Routing configuration
├── services/         # API services
│   └── authAPI.js    # Authentication API calls
├── state_manage/     # State management
├── styles/           # CSS files
├── utils/            # Utility functions
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## Authentication Flow

### User Registration
1. **Buyer Registration**: Collects personal info, delivery address, and city
2. **Seller Registration**: Collects personal info, farm details, and location
3. **Validation**: Client-side and server-side validation
4. **Success**: Redirects to appropriate dashboard

### User Login
1. **Username/Email**: Accepts either username or email
2. **Password**: Secure password input
3. **User Type**: Automatically detects buyer/seller from credentials
4. **Success**: Redirects to appropriate dashboard

### Dashboard Access
- **Buyers**: Redirected to `/buyer-dashboard`
- **Sellers**: Redirected to `/seller-dashboard`
- **Protected Routes**: Only accessible to authenticated users

## Dashboard Features

### Buyer Dashboard
- **Overview**: Order statistics, favorites, recent activity
- **Orders**: Order history and tracking
- **Favorites**: Saved items management
- **Products**: Recent and recommended products
- **Payments**: Payment method management
- **Delivery**: Address management
- **Reviews**: Product and service reviews
- **Settings**: Account configuration

### Seller Dashboard
- **Overview**: Earnings, product stats, order summary
- **Products**: Product management and inventory
- **Orders**: Order processing and management
- **Earnings**: Financial analytics and reports
- **Customers**: Customer management and insights
- **Inventory**: Stock management and alerts
- **Farm**: Farm information and settings
- **Settings**: Account and business configuration

## API Integration

The frontend integrates with the backend through the `authAPI.js` service:

- **Base URL**: `http://localhost:50011/api/auth`
- **Endpoints**: Login, registration, profile management
- **Authentication**: JWT token-based authentication
- **Error Handling**: Comprehensive error handling with user feedback

## Key Technologies

- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **React Hot Toast**: Toast notifications
- **Vite**: Fast build tool and dev server

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Environment Variables

The frontend is configured to connect to the backend at `http://localhost:50011`. Update the `API_BASE_URL` in `src/services/authAPI.js` if needed.

## Testing the Application

1. **Start Backend**: Ensure the backend server is running on port 50011
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Test Registration**: Create both buyer and seller accounts
4. **Test Login**: Verify authentication and dashboard access
5. **Test Dashboards**: Explore buyer and seller specific features

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service
3. Update API endpoints for production
4. Configure environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
