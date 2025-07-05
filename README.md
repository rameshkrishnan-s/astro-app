# Astrology Application

A full-stack astrology application with Google OAuth authentication and **real astrological chart generation** using the Prokerala API for accurate planet positions and calculations.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **Real Astrological Charts** - Accurate Rasi and Navamsa charts using Prokerala API
- **Planet Positions** - Real astronomical calculations with degrees, houses, and retrograde status
- **SVG Chart Generation** - Professional South Indian style charts
- **Location Integration** - GPS coordinates for precise calculations
- **User Dashboard** - Personalized astrology results display
- **Admin Panel** - Data management for administrators
- **Responsive Design** - Modern UI with React and Material-UI

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **JWT** for token-based auth
- **Prokerala API** for real astrological calculations
- **Axios** for API integration

### Frontend
- **React 19** with Vite
- **Material-UI v7** for modern UI components
- **React Router** for navigation
- **Axios** for API calls
- **Google OAuth** integration
- **Location API** for GPS coordinates

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials
- **Prokerala API credentials** (see setup guide below)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd astrology
```

### 2. Backend Setup

```bash
cd astrology-backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

Edit `.env` file with your credentials:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/astrology_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Prokerala API Configuration
PROKERALA_API_KEY=your_prokerala_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd astrology-frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

Edit `.env` file:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Environment
VITE_NODE_ENV=development
```

### 4. Start the Application

**Backend:**
```bash
cd astrology-backend
npm run dev
```

**Frontend:**
```bash
cd astrology-frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Authentication Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - http://localhost:5173 (development)
   - http://localhost:3000 (development)
6. Add authorized redirect URIs:
   - http://localhost:5000/api/auth/google/callback

### Prokerala API Setup
**📖 See detailed setup guide: [PROKERALA_SETUP.md](./PROKERALA_SETUP.md)**

1. Sign up at [Prokerala API](https://api.prokerala.com/)
2. Get your API key from the dashboard
3. Add it to your backend `.env` file
4. Test the integration:
   ```bash
   cd astrology-backend
   node test-prokerala.js
   ```

## 🌟 New Features

### Real Astrological Calculations
- **Accurate Planet Positions**: Real astronomical calculations using Prokerala API
- **Multiple Chart Types**: Rasi, Navamsa, and more chart types supported
- **Professional SVG Charts**: South Indian style charts with proper formatting
- **Retrograde Detection**: Shows retrograde planets in calculations
- **Degree Precision**: Exact degrees and minutes for planet positions

### Enhanced User Experience
- **Location Autocomplete**: Search and select birth places with coordinates
- **GPS Integration**: Use current location for precise calculations
- **Chart Verification**: Users can verify and regenerate charts
- **Real-time Validation**: Immediate feedback on form inputs
- **Mobile Responsive**: Optimized for all device sizes

### Admin Features
- **Real Data Management**: View and manage actual astrological data
- **Chart Visualization**: View generated SVG charts in admin panel
- **Data Export**: PDF generation with chart images
- **Statistics**: Real usage statistics and analytics

## 🐛 Issues Fixed

### Critical Issues Resolved:

1. **Missing Environment Variables** ✅
   - Added environment validation
   - Created example files
   - Added startup checks

2. **Authentication Middleware Logic** ✅
   - Fixed unreachable code blocks
   - Added proper error handling
   - Improved token validation

3. **Passport.js Configuration** ✅
   - Added serializeUser/deserializeUser
   - Fixed error handling in strategy
   - Improved user creation logic

4. **Database Connection** ✅
   - Added connection pooling
   - Improved error handling
   - Added graceful shutdown

5. **API Response Handling** ✅
   - Fixed data structure mismatches
   - Added safe data extraction
   - Improved error responses

6. **Frontend Security** ✅
   - Removed hardcoded URLs
   - Added environment-based configuration
   - Improved token handling

7. **Model Schema Consistency** ✅
   - Updated schema to match actual data
   - Added flexible field definitions
   - Improved data validation

8. **CORS Configuration** ✅
   - Added proper CORS settings
   - Environment-based origins
   - Security headers

9. **Real API Integration** ✅
   - Replaced mock data with Prokerala API
   - Added proper error handling for API calls
   - Implemented SVG chart display
   - Added planet position calculations

## 📁 Project Structure

```
astrology/
├── astrology-backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── passport.js        # Passport configuration
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   └── adminAuth.js       # Admin authorization
│   ├── models/
│   │   ├── User.js            # User model
│   │   └── AstrologyData.js   # Astrology data model
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── astrology.js       # Astrology calculation routes
│   │   └── admin.js           # Admin routes
│   ├── test-prokerala.js      # API integration test
│   └── index.js               # Main server file
├── astrology-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AstrologyForm.jsx      # Birth details form
│   │   │   ├── ChartDisplay.jsx       # Chart visualization
│   │   │   ├── ProfileSection.jsx     # User profile
│   │   │   └── ProtectedRoute.jsx     # Route protection
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx      # Main dashboard
│   │   │   └── LoginPage.jsx          # Login page
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Authentication context
│   │   └── config/
│   │       └── api.js                 # API configuration
│   └── package.json
├── PROKERALA_SETUP.md         # Prokerala API setup guide
└── README.md                  # This file
```

## 🚀 Getting Started with Real Charts

1. **Set up Prokerala API** (see [PROKERALA_SETUP.md](./PROKERALA_SETUP.md))
2. **Start the application** (backend + frontend)
3. **Login with Google** OAuth
4. **Enter birth details** with location
5. **Generate real charts** with accurate planet positions
6. **View SVG charts** and planet positions
7. **Regenerate charts** if needed

## 📊 API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/logout` - Logout user

### Astrology
- `POST /api/astrology/calculate` - Generate astrological charts
- `GET /api/astrology/user-data` - Get user's astrology data

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/astrology-data` - Get all astrology data
- `DELETE /api/admin/users/:id` - Delete user
- `DELETE /api/admin/astrology-data/:id` - Delete astrology data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Prokerala API Issues**: See [PROKERALA_SETUP.md](./PROKERALA_SETUP.md)
- **General Issues**: Check the issues section or create a new one
- **Documentation**: Refer to the setup guides above

---

**🌟 Now with real astrological calculations powered by Prokerala API! 🌟**
