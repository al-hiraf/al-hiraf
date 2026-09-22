# خطوات النشر على Cloudflare | Cloudflare Deployment Steps

**الإصدار:** v2.0 - الحرف المتكاملة  
**التاريخ:** 2026-09-22  
**الحالة:** جاهز للنشر ✅

---

## المتطلبات | Prerequisites

- [ ] حساب Cloudflare (مجاني أو مدفوع) | Cloudflare account
- [ ] `wrangler` CLI مثبت عالمياً | Wrangler CLI installed
- [ ] حساب GitHub (اختياري لـ CI/CD) | GitHub account (optional)
- [ ] نطاق/دومين | Domain name (al-hiraf.com)
- [ ] Node.js v18+ مثبت محلياً | Node.js installed locally

---

## الخطوة 1️⃣: تثبيت wrangler CLI

```bash
# تثبيت عالمي | Install globally
npm install -g @cloudflare/wrangler

# أو محلي للمشروع | Or install locally for project
npm install --save-dev @cloudflare/wrangler

# التحقق من التثبيت | Verify installation
wrangler --version
```

---

## الخطوة 2️⃣: تسجيل الدخول إلى Cloudflare

```bash
# قم بتسجيل الدخول | Login to Cloudflare
wrangler login

# سيفتح متصفح للتحقق - اضغط Authorize
# A browser will open - click Authorize
```

---

## الخطوة 3️⃣: الحصول على معلومات Cloudflare Account

1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اختر الحساب الخاص بك
3. انسخ **Account ID** من الشريط الجانبي
4. في **Websites** → اختر دومينك أو أضف واحد جديد
5. انسخ **Zone ID** من الجزء السفلي للصفحة

---

## الخطوة 4️⃣: تحديث ملفات wrangler.toml

### للـ Backend (API)

```bash
cd backend
```

افتح `backend/wrangler.toml` وحدّث:

```toml
account_id = "YOUR_ACCOUNT_ID"  # ← ضع Account ID هنا

[env.production]
routes = [
  { pattern = "api.al-hiraf.com/*", zone_id = "YOUR_ZONE_ID" }  # ← ضع Zone ID هنا
]

[[d1_databases]]
binding = "DB"
database_name = "al-hiraf-db"
```

### للـ Frontend (Pages)

```bash
cd frontend
```

افتح `frontend/wrangler.toml` وحدّث:

```toml
account_id = "YOUR_ACCOUNT_ID"  # ← ضع Account ID هنا

[env.production]
routes = [
  { pattern = "al-hiraf.com/*", zone_id = "YOUR_ZONE_ID" }  # ← ضع Zone ID هنا
]
```

---

## الخطوة 5️⃣: إنشاء D1 Database

```bash
# إنشاء database جديد
wrangler d1 create al-hiraf-db --local

# نسخ Database ID من الإخراج
# Copy Database ID from output
```

حدّث `wrangler.toml` بـ Database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "al-hiraf-db"
database_id = "YOUR_DATABASE_ID"  # ← ضع Database ID هنا
```

---

## الخطوة 6️⃣: تهيئة قاعدة البيانات

```bash
# إنشاء الجداول | Create tables
wrangler d1 execute al-hiraf-db --file ./backend/db/init.sql

# أو من ملف TypeScript | Or from TypeScript file
wrangler d1 execute al-hiraf-db --command "CREATE TABLE IF NOT EXISTS customers ..."
```

---

## الخطوة 7️⃣: نشر Backend (Workers)

```bash
cd backend

# اختبار محلي | Test locally
wrangler dev

# نشر إلى الإنتاج | Deploy to production
wrangler publish --env production
```

ستحصل على رابط مثل: `https://al-hiraf-api.YOUR_ACCOUNT.workers.dev`

---

## الخطوة 8️⃣: نشر Frontend (Pages)

```bash
cd ../frontend

# الطريقة A: من خلال CLI | Via CLI
npx wrangler pages publish . --project-name al-hiraf

# الطريقة B: عبر Dashboard
# 1. اذهب إلى Cloudflare Dashboard → Pages
# 2. اضغط Create a project
# 3. اختر الاتصال من GitHub (اختياري)
# 4. Deploy
```

---

## الخطوة 9️⃣: إعداد الدومين

### إذا كان الدومين عند Cloudflare:

1. **Dashboard** → **Websites** → **Add site**
2. أدخل `al-hiraf.com`
3. اتبع خطوات التحقق
4. أضف **nameservers** Cloudflare إلى registrar الخاص بك

### إذا كان الدومين عند registrar آخر:

1. اذهب إلى Dashboard
2. **Websites** → **Add site**
3. استخدم **CNAME records** أو **Nameservers**

---

## الخطوة 🔟: ربط الـ Subdomains

### للـ Frontend (al-hiraf.com):
- اذهب إلى **Pages** → **Project settings**
- أضف **Custom domain**: `al-hiraf.com`
- وافق على إضافة CNAME

### للـ Backend (api.al-hiraf.com):
- اذهب إلى **Workers** → **Routes**
- أضف route: `api.al-hiraf.com/*`

---

## الخطوة 1️⃣1️⃣: تكوين متغيرات البيئة

في Cloudflare Dashboard:

1. **Workers** → **al-hiraf-api** → **Settings**
2. **Environment variables** → أضف:

```
ENVIRONMENT=production
CORS_ORIGIN=https://al-hiraf.com
TAX_RATE=0.15
DATABASE_URL=your_database_url (إذا كنت تستخدم خدمة خارجية)
```

---

## الخطوة 1️⃣2️⃣: اختبار النشر

```bash
# اختبر الـ Frontend
curl https://al-hiraf.com

# اختبر الـ API
curl https://api.al-hiraf.com/api/health

# اعرض السجلات الحية | View live logs
wrangler tail

# اختبر database
curl https://api.al-hiraf.com/api/accounts
```

---

## 🔐 تفعيل HTTPS/SSL

Cloudflare يفعّل SSL تلقائياً ✅

---

## 📊 مراقبة الأداء

```bash
# عرض السجلات | View logs
wrangler tail

# عرض الإحصائيات | View stats
# في Dashboard → Workers → Metrics
```

---

## 🚨 استكشاف الأخطاء

### الخطأ: "Account ID not found"
```bash
# تحقق من Login
wrangler whoami

# أو جرّب Login مجدداً
wrangler login
```

### الخطأ: "Database not bound"
```bash
# تأكد من wrangler.toml
# تحقق من Database ID
wrangler d1 info al-hiraf-db
```

### الخطأ: "CORS error"
```javascript
// في backend/worker.js
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://al-hiraf.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};
```

---

## 📱 اختبار من الموبايل

```bash
# اختبر من جهازك
https://al-hiraf.com

# اختبر API
https://api.al-hiraf.com/api/customers
```

---

## 💰 التكاليف الشهرية (تقريبي)

| الخدمة | السعر |
|-------|-------|
| Pages | **مجاني** ✅ |
| Workers | $0.15 لـ 1M req |
| D1 Database | **محدود مجاني** |
| Bandwidth | **غير محدود** |
| **المجموع** | **~$5-10/month** |

---

## ✅ Checklist للنشر الكامل

- [ ] حساب Cloudflare و Account ID
- [ ] Wrangler CLI مثبت
- [ ] Backend wrangler.toml محدث
- [ ] Frontend wrangler.toml محدث
- [ ] D1 Database منشأ وتم تهيئته
- [ ] Backend منشور إلى Workers
- [ ] Frontend منشور إلى Pages
- [ ] الدومين موصول بـ Cloudflare
- [ ] HTTPS يعمل على كلا الـ Domains
- [ ] API health check يعمل
- [ ] Dashboard analytics فعّل
- [ ] Database backup مفعّل (اختياري)

---

## 🎉 تم! System Online

```bash
# تحقق من الحالة النهائية
curl https://al-hiraf.com/api/health

# يجب أن تراى:
# {"status":"Server is running","timestamp":"2026-09-22T..."}
```

---

## 📞 الدعم والمراجع

- **Cloudflare Docs**: https://developers.cloudflare.com
- **Workers Guide**: https://developers.cloudflare.com/workers/
- **D1 Database**: https://developers.cloudflare.com/d1/
- **Pages Guide**: https://developers.cloudflare.com/pages/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/

---

**استمتع بالنشر! 🚀**  
**Al-Hiraf Al-Mutakamila is now live on Cloudflare! ✨**
