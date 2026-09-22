# 🎨 الحرف المتكاملة
## Comprehensive Crafts System

نظام محاسبي وإدارة علاقات عملاء متكامل للحرفيين والمشاريع الصغيرة والمتوسطة، بسيط وقابل للتوسع.

**Simple, scalable accounting system with integrated CRM capabilities.**

---

## ✨ الميزات الرئيسية | Key Features

### 👥 إدارة العملاء | Customer Management
- إضافة وتعديل وحذف العملاء
- تخزين تفاصيل العميل الكاملة
- تتبع تاريخ التعاملات

### 📄 نظام الفواتير | Invoice System
- إنشاء فواتير مخصصة
- سطور فواتير متعددة
- تتبع حالة الفاتورة (مسودة، مُصدرة، مدفوعة جزئياً، مدفوعة)
- حساب تلقائي للضريبة (15% - قابل للتعديل)

### 💰 إدارة المدفوعات | Payment Management
- تسجيل المدفوعات
- تحديث حالة الفاتورة تلقائياً
- تتبع المدفوعات الجزئية
- طرق دفع متعددة

### 📈 التقارير والإحصائيات | Reports & Analytics
- لوحة تحكم شاملة
- تقارير الإيرادات الشهرية
- قائمة الفواتير المعلقة
- تحليل حالة الفواتير
- إحصائيات العملاء

### 🌐 واجهة عصرية | Modern UI
- تصميم استجابي (Responsive)
- دعم عربي/إنجليزي (RTL/LTR)
- تجربة مستخدم سلسة

---

## 🚀 البدء السريع | Quick Start

### المتطلبات | Requirements
- Node.js v16+
- npm أو yarn

### التثبيت والتشغيل | Installation & Setup

```bash
# استنساخ أو فك الملفات
cd accounting-crm

# تثبيت المكتبات
npm install

# تهيئة قاعدة البيانات
npm run init-db

# تشغيل الخادم
npm run dev
```

الخادم سيعمل على: `http://localhost:3001`

فتح في المتصفح: `http://localhost:3001/frontend/`

---

## 📁 هيكل المشروع | Project Structure

```
accounting-crm/
├── backend/
│   ├── db/
│   │   ├── init.js           # تهيئة قاعدة البيانات
│   │   ├── connection.js      # اتصال SQLite
│   │   └── accounting.db      # قاعدة البيانات
│   ├── routes/
│   │   ├── customers.js       # APIs العملاء
│   │   ├── invoices.js        # APIs الفواتير
│   │   ├── payments.js        # APIs المدفوعات
│   │   └── reports.js         # APIs التقارير
│   └── server.js              # خادم Express الرئيسي
├── frontend/
│   ├── index.html             # الصفحة الرئيسية
│   └── app.js                 # منطق التطبيق
├── package.json               # المكتبات المطلوبة
└── README.md                  # هذا الملف
```

---

## 🔌 API Endpoints

### العملاء | Customers
```
GET    /api/customers              # الحصول على جميع العملاء
GET    /api/customers/:id          # الحصول على عميل محدد
POST   /api/customers              # إنشاء عميل جديد
PUT    /api/customers/:id          # تحديث عميل
DELETE /api/customers/:id          # حذف عميل
```

### الفواتير | Invoices
```
GET    /api/invoices               # الحصول على جميع الفواتير
GET    /api/invoices/:id           # الحصول على فاتورة محددة
POST   /api/invoices               # إنشاء فاتورة جديدة
PUT    /api/invoices/:id/status    # تحديث حالة الفاتورة
DELETE /api/invoices/:id           # حذف فاتورة
```

### المدفوعات | Payments
```
GET    /api/payments               # جميع المدفوعات
GET    /api/payments/customer/:id  # مدفوعات عميل
GET    /api/payments/invoice/:id   # مدفوعات فاتورة
POST   /api/payments               # تسجيل دفعة جديدة
DELETE /api/payments/:id           # حذف دفعة
```

### التقارير | Reports
```
GET    /api/reports/dashboard      # إحصائيات لوحة التحكم
GET    /api/reports/revenue        # تقرير الإيرادات الشهري
GET    /api/reports/customers      # تقرير العملاء
GET    /api/reports/outstanding    # الفواتير المعلقة
GET    /api/reports/status-breakdown # توزيع حالة الفواتير
```

---

## 💾 نموذج البيانات | Data Model

### جدول العملاء | Customers
```sql
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### جدول الفواتير | Invoices
```sql
CREATE TABLE invoices (
  id TEXT PRIMARY KEY,
  customerId TEXT,
  invoiceNumber TEXT UNIQUE,
  description TEXT,
  amount REAL,
  tax REAL,
  totalAmount REAL,
  status TEXT (draft|issued|partial|paid|overdue),
  dueDate DATETIME,
  issueDate DATETIME,
  paidDate DATETIME,
  notes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### جدول سطور الفواتير | Invoice Items
```sql
CREATE TABLE invoice_items (
  id TEXT PRIMARY KEY,
  invoiceId TEXT,
  description TEXT,
  quantity REAL,
  unitPrice REAL,
  totalPrice REAL
)
```

### جدول المدفوعات | Payments
```sql
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  invoiceId TEXT,
  customerId TEXT,
  amount REAL,
  paymentMethod TEXT,
  paymentDate DATETIME,
  reference TEXT,
  notes TEXT,
  createdAt DATETIME
)
```

---

## 🔧 التوسيع والتطوير | Customization & Development

### إضافة ميزات جديدة | Adding Features

1. **إضافة API جديد**:
   - أنشئ ملف route جديد في `backend/routes/`
   - أضفه إلى `server.js`

2. **تغيير واجهة المستخدم**:
   - عدّل `frontend/index.html` و `frontend/app.js`
   - استخدم الـ CSS الموجود كنموذج

3. **تغيير حسابات الضريبة**:
   - عدّل نسبة الضريبة في `backend/routes/invoices.js` (حالياً 15%)

### الترقية إلى قاعدة بيانات أفضل | Database Migration

تحويل من SQLite إلى PostgreSQL:
1. استخدم مكتبة `pg` بدلاً من `sqlite3`
2. قم بتعديل `backend/db/connection.js`
3. حدّث جمل SQL إن لزم الأمر (قليل جداً في معظم الحالات)

---

## 📱 الميزات المستقبلية | Future Enhancements

- [ ] نظام المستخدمين والصلاحيات
- [ ] إرسال الفواتير عبر البريد الإلكتروني
- [ ] تصدير PDF للفواتير
- [ ] الفواتير المتكررة
- [ ] عملات متعددة
- [ ] نسب ضريبة مخصصة حسب المنطقة
- [ ] رسوم التأخير التلقائية
- [ ] تكاملات بوابات الدفع
- [ ] تطبيق موبايل
- [ ] مزامنة البيانات السحابية

---

## 📞 الدعم والمساعدة | Support

- 📧 البريد الإلكتروني: support@example.com
- 📚 التوثيق الكاملة في ملفات المشروع

---

## 📄 الترخيص | License

MIT License - يمكنك استخدام وتعديل هذا المشروع بحرية.

---

## 🎯 ملاحظات مهمة | Important Notes

1. **الضريبة**: حالياً مضبوطة على 15% (ضريبة القيمة المضافة السعودية)
   - يمكن تعديلها حسب بلدك

2. **المجلس**: جميع التواريخ والأرقام محلية (عربي)
   - يدعم اللغات بالكامل

3. **الأمان**: للإنتاج، أضف:
   - التحقق من المستخدمين (Authentication)
   - تشفير البيانات
   - Validation أقوى
   - HTTPS

4. **الأداء**: للبيانات الضخمة:
   - استخدم قاعدة بيانات أقوى (PostgreSQL)
   - أضف فهارس (Indexes)
   - استخدم pagination

---

**استمتع بالنظام! Happy accounting! 🎉**
