# Astrology Application

A full-stack astrology application with Google OAuth authentication and Prokerala API integration for generating astrological charts.

## 🚀 Features

- **Google OAuth Authentication** - Secure login with Google accounts
- **Astrological Chart Generation** - Rasi and Navamsa charts using Prokerala API
- **User Dashboard** - Personalized astrology results display
- **Admin Panel** - Data management for administrators
- **Responsive Design** - Modern UI with React and Vite

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **JWT** for token-based auth
- **Prokerala API** for astrological calculations

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Google OAuth** integration
- **Modern CSS** with inline styles

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials
- Prokerala API credentials

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
MONGO_URI=mongodb://localhost:27017/astrology_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Prokerala API Configuration
PROKERALA_USER_ID=your_prokerala_user_id
PROKERALA_API_KEY=your_prokerala_api_key

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
1. Sign up at [Prokerala](https://prokerala.com/)
2. Get your API credentials
3. Add them to your backend `.env` file

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

## 📁 Project Structure

```
astrology/
├── astrology-backend/
│   ├── config/
│   │   ├── db.js          # Database connection
│   │   │   └── passport.js    # Passport configuration
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT authentication
│   │   │   └── adminAuth.js   # Admin authorization
│   │   ├── models/
│   │   │   ├── User.js        # User model
│   │   │   └── AstrologyData.js # Astrology data model
│   │   ├── routes/
│   │   │   ├── auth.js        # Authentication routes
│   │   │   ├── astrology.js   # Astrology calculation routes
│   │   │   └── admin.js       # Admin routes
│   │   └── index.js           # Main server file
├── astrology-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AstrologyForm.jsx
│   │   │   ├── ChartDisplay.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔒 Security Features

- JWT token-based authentication
- Google OAuth integration
- Protected routes
- Admin role-based access
- CORS protection
- Input validation
- Error handling

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Update API base URL in environment
2. Build the application: `npm run build`
3. Deploy to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please check the issues section or contact the development team. # astro-app
