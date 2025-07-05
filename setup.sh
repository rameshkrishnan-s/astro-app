#!/bin/bash

echo "🚀 Setting up Astrology Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Backend setup
echo "📦 Setting up backend..."
cd astrology-backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating backend .env file..."
    cp env.example .env
    echo "⚠️  Please edit astrology-backend/.env with your credentials"
else
    echo "✅ Backend .env file already exists"
fi

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd astrology-frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating frontend .env file..."
    cp env.example .env
    echo "⚠️  Please edit astrology-frontend/.env with your credentials"
else
    echo "✅ Frontend .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit astrology-backend/.env with your credentials"
echo "2. Edit astrology-frontend/.env with your credentials"
echo "3. Start MongoDB"
echo "4. Run 'cd astrology-backend && npm run dev'"
echo "5. Run 'cd astrology-frontend && npm run dev'"
echo ""
echo "📖 See README.md for detailed setup instructions" 