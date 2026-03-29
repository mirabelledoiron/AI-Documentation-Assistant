#!/bin/bash

# 🚀 AI Design System Deployment Script
# This script builds and prepares your application for cPanel deployment

echo "🎨 AI Design System - Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Build the application
echo "🔨 Building production version..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the error messages above"
    exit 1
fi

# Check build output
echo "📁 Build output:"
ls -la dist/
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
if [ -d "deploy" ]; then
    rm -rf deploy
fi

mkdir deploy
cp -r dist/* deploy/
cp CPANEL_DEPLOYMENT.md deploy/
cp SETUP_GUIDE.md deploy/

# Create a simple upload script
cat > deploy/upload-instructions.txt << 'EOF'
🚀 UPLOAD INSTRUCTIONS FOR CPANEL

1. Log into your cPanel
2. Go to File Manager
3. Navigate to public_html/ (or your desired directory)
4. Upload ALL files from this folder to your web root
5. Maintain the folder structure exactly as shown

IMPORTANT: Keep the assets/ folder structure intact!

After upload, visit your domain to test the application.
EOF

echo "✅ Deployment package created in 'deploy/' folder"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of 'deploy/' folder to your cPanel"
echo "2. Follow the instructions in CPANEL_DEPLOYMENT.md"
echo "3. Test your application at your domain"
echo ""
echo "🎉 Your AI Design System is ready for deployment!"
echo ""
echo "📁 Files to upload:"
ls -la deploy/
