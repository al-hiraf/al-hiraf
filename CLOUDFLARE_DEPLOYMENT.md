# دليل نشر على Cloudflare | Cloudflare Deployment Guide

## 🌐 خطوات النشر على Cloudflare

### الخيار 1: Cloudflare Pages + Workers (الموصى به)

#### المتطلبات:
- حساب Cloudflare مجاني أو مدفوع
- `wrangler` CLI مثبت
- حساب GitHub (اختياري)

#### الخطوة 1: تثبيت Wrangler CLI
```bash
npm install -g @cloudflare/wrangler
wrangler login
```

#### الخطوة 2: إعداد Cloudflare Workers (Backend)

أنشئ ملف `wrangler.toml`:
```toml
name = "al-hiraf-api"
type = "javascript"
account_id = "YOUR_ACCOUNT_ID"
workers_dev = true
routes = [
  { pattern = "api.al-hiraf.com/api/*", zone_id = "YOUR_ZONE_ID" }
]

[env.production]
route = "api.al-hiraf.com/api/*"
zone_id = "YOUR_ZONE_ID"
```

نشر الـ Backend:
```bash
wrangler publish
```

#### الخطوة 3: نشر Frontend على Cloudflare Pages

**الطريقة A: عبر CLI**
```bash
cd frontend
npm install wrangler --save-dev
npx wrangler pages publish . --project-name al-hiraf
```

**الطريقة B: عبر Dashboard**
1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اختر **Pages**
3. اضغط **Create a project**
4. اختر repo من GitHub
5. Build command: `npm run build` (أو اتركها فارغة للـ HTML فقط)
6. Deploy!

---

### الخيار 2: Cloudflare Pages مع Workers (الأسهل)

#### 1. نشر Frontend
```bash
# أنشئ مشروع Pages جديد
cd frontend

# انسخ الملفات
cp index.html app.js dist/

# نشر
npx wrangler pages publish dist --project-name al-hiraf
```

#### 2. نشر Backend
```bash
# أنشئ Worker جديد
cd backend

# أنشئ ملف worker.js
cat > worker.js << 'EOF'
import Server from './server.js';

export default {
  async fetch(request) {
    return Server.handleRequest(request);
  }
};
EOF

# نشر
npx wrangler publish
```

---

### الخيار 3: استخدام Docker + Cloudflare

#### 1. أنشئ Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY backend ./backend
COPY frontend ./frontend

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

#### 2. نشر على Cloudflare:
```bash
# عبر Railway أو Render
npm run build
docker build -t al-hiraf .
docker push registry.heroku.com/al-hiraf/web
```

---

## 📝 الملفات المطلوبة

### wrangler.toml للـ Backend
```toml
name = "al-hiraf-api"
type = "javascript"
account_id = "YOUR_ACCOUNT_ID"
workers_dev = true
main = "src/index.js"

[env.production]
routes = [
  { pattern = "api.al-hiraf.com/*", zone_id = "YOUR_ZONE_ID" }
]

[build]
cwd = "backend"
command = "npm install"
watch_paths = ["src/**/*.js"]

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "al-hiraf-data"
```

### wrangler.toml للـ Frontend (Pages)
```toml
name = "al-hiraf"
type = "javascript"
account_id = "YOUR_ACCOUNT_ID"

[build]
command = "echo 'no build needed'"
watch_paths = ["*.html", "*.js"]

[env.production]
routes = [
  { pattern = "al-hiraf.com/*", zone_id = "YOUR_ZONE_ID" }
]
```

---

## 🗄️ قاعدة البيانات

### الخيار A: Cloudflare D1 (SQLite محلي)
```bash
wrangler d1 create al-hiraf-db
wrangler d1 execute al-hiraf-db --file ./db/init.sql
```

### الخيار B: PlanetScale (MySQL)
```bash
# أنشئ database على PlanetScale
pscale database create al-hiraf

# احصل على connection string
pscale connection create al-hiraf --username root
```

### الخيار C: Supabase (PostgreSQL)
```bash
# أسهل option مع واجهة مجانية
# اذهب إلى supabase.com وأنشئ project
# احصل على CONNECTION_STRING
```

---

## 🔐 متغيرات البيئة

أضف في Cloudflare Dashboard:

```
ENVIRONMENT=production
DATABASE_URL=postgres://...
API_KEY=your_api_key
CORS_ORIGIN=https://al-hiraf.com
TAX_RATE=0.15
```

---

## ⚙️ إعدادات Cloudflare

### 1. السماح بـ CORS
```javascript
// في backend worker
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://al-hiraf.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

### 2. Caching
```javascript
// في worker.js
response.headers.set('Cache-Control', 'public, max-age=3600');
```

### 3. WAF Rules
- في Dashboard → Security → WAF
- أضف قواعد لحماية من attacks

---

## 📊 الخطوات السريعة

### للـ Frontend فقط (الأسهل):
```bash
# 1. نسخ الملفات
cp -r frontend/* dist/

# 2. نشر
npx wrangler pages publish dist \
  --project-name al-hiraf \
  --branch production

# 3. الدومين
# في Dashboard: Custom domain → al-hiraf.com
```

### للـ Full Stack:
```bash
# 1. Backend
cd backend
wrangler publish

# 2. Frontend
cd ../frontend
wrangler pages publish . --project-name al-hiraf

# 3. قاعدة البيانات
wrangler d1 create al-hiraf-db
```

---

## 🌍 الدومين

### 1. إذا كان الدومين عند Cloudflare:
- Dashboard → Websites → Add site
- اتبع خطوات التحقق

### 2. إذا كان عند سجل آخر:
- أضف nameservers Cloudflare
- أو أضف CNAME records

---

## 📱 Custom Domain
```
Frontend: https://al-hiraf.com
API: https://api.al-hiraf.com
```

---

## ✅ تحقق من النشر

```bash
# اختبر الـ Frontend
curl https://al-hiraf.com

# اختبر الـ API
curl https://api.al-hiraf.com/health

# اعرض السجلات
wrangler tail
```

---

## 🚀 الخطوات النهائية

1. ✅ أنشئ حساب Cloudflare
2. ✅ أضفر دومينك
3. ✅ نشر Frontend → Pages
4. ✅ نشر Backend → Workers
5. ✅ ربط قاعدة البيانات
6. ✅ أضف SSL/TLS
7. ✅ فعّل Analytics و Monitoring

---

## 💰 التكاليف (تقريبي)

| الخدمة | المجاني | المدفوع |
|--------|---------|---------|
| Pages | ✅ | - |
| Workers | 100,000 req/يوم | $0.15 لـ 1M req |
| D1 | ✅ محدود | - |
| Bandwidth | 500 GB/شهر | ✅ غير محدود |

---

## 📞 الدعم

- Docs: https://developers.cloudflare.com
- Discord: https://discord.gg/cloudflaredev
- Support: https://support.cloudflare.com

---

**استمتع بالنشر على Cloudflare! 🚀**
