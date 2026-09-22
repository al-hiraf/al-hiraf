#!/bin/bash

echo "═══════════════════════════════════════════════════════════"
echo "🚀 نشر الحرف المتكاملة على Cloudflare"
echo "═══════════════════════════════════════════════════════════"
echo ""

ACCOUNT_ID="6c5bc6be6d26c3d335c49909b524c93e"
API_DOMAIN="al-hiraf-api.${ACCOUNT_ID}.workers.dev"
PAGES_DOMAIN="al-hiraf.pages.dev"

echo "📊 إعدادات النشر:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Account ID:      $ACCOUNT_ID"
echo "✅ Backend Domain:  https://$API_DOMAIN"
echo "✅ Frontend Domain: https://$PAGES_DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔑 الخطوات المطلوبة:"
echo ""
echo "1️⃣  تأكد من تثبيت wrangler:"
echo "    npm install -g @cloudflare/wrangler"
echo ""

echo "2️⃣  تسجيل الدخول (مرة واحدة فقط):"
echo "    wrangler login"
echo ""

echo "3️⃣  نشر Backend (من مجلد المشروع):"
echo "    wrangler publish"
echo ""

echo "4️⃣  نشر Frontend:"
echo "    cd frontend"
echo "    wrangler pages publish . --project-name al-hiraf"
echo ""

echo "5️⃣  اختبر بعد النشر:"
echo "    curl https://$API_DOMAIN/api/health"
echo "    curl https://$PAGES_DOMAIN"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "📝 ملفات التكوين جاهزة:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ wrangler.toml (Backend)"
echo "✅ frontend/wrangler.toml (Frontend)"
echo "✅ backend/worker.js (Cloudflare Workers handler)"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "🎯 بعد النشر الناجح:"
echo "  - Backend يعمل على: $API_DOMAIN"
echo "  - Frontend يعمل على: $PAGES_DOMAIN"
echo "  - يمكنك إضافة دومين مخصص لاحقاً من Cloudflare Dashboard"
echo ""
echo "✨ استمتع بالنشر!"
