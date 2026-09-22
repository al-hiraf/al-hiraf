#!/bin/bash

echo "🎨 الحرف المتكاملة | Comprehensive Crafts System"
echo "=================================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت المكتبات... Installing dependencies..."
    npm install
fi

echo ""
echo "🔨 تهيئة قاعدة البيانات... Initializing database..."
npm run init-db

echo ""
echo "✅ البدء... Starting server..."
echo ""
echo "🌐 الخادم: http://localhost:3001"
echo "📊 التطبيق: http://localhost:3001/frontend/"
echo ""
echo "اضغط Ctrl+C لإيقاف الخادم | Press Ctrl+C to stop"
echo ""

npm run dev
