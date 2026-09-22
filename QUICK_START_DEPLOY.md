# نشر الحرف المتكاملة على Cloudflare | Quick Start Deployment Guide

**الهدف:** نشر نظام الحرف المتكاملة بالكامل على Cloudflare في أقل من 30 دقيقة  
**Target:** Deploy Al-Hiraf to Cloudflare in under 30 minutes

---

## 🚀 النشر السريع | Quick Deploy (5 steps)

### 1️⃣ **التثبيت** (2 min)

```bash
# تثبيت wrangler
npm install -g @cloudflare/wrangler

# تسجيل الدخول
wrangler login
```

### 2️⃣ **جمع المعلومات** (3 min)

اذهب إلى https://dash.cloudflare.com وانسخ:
- **Account ID** (من الشريط الجانبي)
- **Zone ID** (من صفحة الدومين)

### 3️⃣ **تحديث التكوين** (5 min)

```bash
# Backend
sed -i 's/YOUR_ACCOUNT_ID/YOUR_ACTUAL_ACCOUNT_ID/g' wrangler.toml
sed -i 's/YOUR_ZONE_ID/YOUR_ACTUAL_ZONE_ID/g' wrangler.toml

# Frontend
cd frontend
sed -i 's/YOUR_ACCOUNT_ID/YOUR_ACTUAL_ACCOUNT_ID/g' wrangler.toml
sed -i 's/YOUR_ZONE_ID/YOUR_ACTUAL_ZONE_ID/g' wrangler.toml
cd ..
```

### 4️⃣ **النشر** (10 min)

```bash
# Backend
cd backend
wrangler publish --env production

# Frontend
cd ../frontend
wrangler pages publish . --project-name al-hiraf
```

### 5️⃣ **التحقق** (2 min)

```bash
# اختبر
curl https://api.al-hiraf.com/api/health
curl https://al-hiraf.com
```

**خلاصة:** تم! ✅

---

## 📋 المتطلبات الأساسية | Basic Requirements

```bash
✓ Node.js v18+
✓ npm أو yarn
✓ حساب Cloudflare
✓ دومين (al-hiraf.com)
```

---

## 🔧 التفاصيل الكاملة

للإرشادات الكاملة والتفاصيل، اتبع: **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)**

---

## ⚠️ الأخطاء الشائعة

| الخطأ | الحل |
|------|------|
| `account_id not found` | تأكد من `wrangler login` |
| `zone_id invalid` | استخدم Zone ID من صفحة الدومين |
| `database not bound` | أعد إنشاء D1 database |
| `CORS error` | تحقق من CORS headers في worker.js |

---

## 🎯 بعد النشر | After Deployment

- [ ] اختبر من جهازك
- [ ] اختبر من موبايل
- [ ] فعّل Analytics (اختياري)
- [ ] أضف SSL/TLS (تلقائي)
- [ ] اختبر API endpoints
- [ ] أضف البيانات الأولية

---

## 📊 الأداء المتوقع

| المقياس | القيمة |
|--------|--------|
| تحميل الصفحة | < 1 sec |
| API response | < 100 ms |
| Uptime | 99.95% |
| Regions | Global (180+ countries) |

---

## 💬 للدعم

الإرشادات الكاملة:
1. **[DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)** - خطوات تفصيلية
2. **[CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md)** - خيارات متقدمة
3. **[README.md](./README.md)** - نظرة عامة على المشروع

---

**انطلق الآن! 🚀**
