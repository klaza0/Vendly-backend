# Vendly Backend - Sales Management System

نظام إدارة المبيعات والمخزون الكامل مع فصل البيانات لكل مستخدم.

## 📋 المحتويات

- [المتطلبات](#المتطلبات)
- [التثبيت](#التثبيت)
- [إعداد قاعدة البيانات](#إعداد-قاعدة-البيانات)
- [إضافة المستخدمين](#إضافة-المستخدمين)
- [API Endpoints](#api-endpoints)
- [الأدوار والصلاحيات](#الأدوار-والصلاحيات)
- [المميزات](#المميزات)

## 🚀 المتطلبات

- Node.js (v14 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## 📦 التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd Vendly-backend
```

2. تثبيت الحزم:
```bash
npm install
```

3. إعداد ملف `.env`:
```env
MONGO_URI=mongodb://localhost:27017/vendly
# أو
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

JWT_SECRET=your-secret-key-here
PORT=5000
```

4. تشغيل السيرفر:
```bash
# Development
npm run dev

# Production
npm start
```

## 👥 إضافة المستخدمين

### الطريقة 1: استخدام Script (لأول مستخدم SuperAdmin)

```bash
npm run create-user <username> <password> [role]
```

**أمثلة:**
```bash
# إنشاء SuperAdmin
npm run create-user admin admin123 SuperAdmin

# إنشاء Admin
npm run create-user manager manager123 Admin

# إنشاء Cashier
npm run create-user cashier cashier123 Cashier
```

**أو مباشرة:**
```bash
node scripts/createUser.js admin admin123 SuperAdmin
```

### الطريقة 2: استخدام API

**1. تسجيل الدخول أولاً:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "SuperAdmin",
  "subscription_status": "Active"
}
```

**2. استخدام Token لإضافة مستخدم جديد:**
```bash
POST /api/users
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "Cashier"
}
```

## 🔐 الأدوار والصلاحيات

### SuperAdmin
- ✅ جميع الصلاحيات
- ✅ إنشاء/تعديل/حذف أي مستخدم
- ✅ إدارة جميع البيانات
- ✅ الوصول لجميع التقارير

### Admin
- ✅ إدارة المنتجات والمبيعات
- ✅ إنشاء Cashier فقط
- ✅ الوصول لمعظم التقارير
- ❌ لا يمكنه حذف المستخدمين
- ❌ لا يمكنه إنشاء SuperAdmin أو Admin

### Cashier
- ✅ إدارة المبيعات
- ✅ إضافة العملاء
- ✅ الوصول للتقارير الأساسية
- ❌ لا يمكنه إدارة المنتجات
- ❌ لا يمكنه إنشاء مستخدمين

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - تسجيل الدخول

### Users Management
- `POST /api/users` - إنشاء مستخدم جديد (SuperAdmin, Admin)
- `GET /api/users` - جلب جميع المستخدمين (SuperAdmin, Admin)
- `GET /api/users/:id` - جلب مستخدم محدد (SuperAdmin, Admin)
- `PUT /api/users/:id` - تحديث مستخدم (SuperAdmin, Admin)
- `DELETE /api/users/:id` - حذف مستخدم (SuperAdmin فقط)
- `PUT /api/users/change-password` - تغيير كلمة المرور

### Products
- `POST /api/products` - إضافة منتج (SuperAdmin, Admin)
- `GET /api/products` - جلب جميع المنتجات (مع فلترة: category, search, lowStock)
- `GET /api/products/low-stock` - جلب المنتجات منخفضة المخزون
- `GET /api/products/:id` - جلب منتج محدد
- `PUT /api/products/:id` - تحديث منتج (SuperAdmin, Admin)
- `DELETE /api/products/:id` - حذف منتج (SuperAdmin, Admin)

### Sales
- `POST /api/sales` - تسجيل بيع جديد
- `GET /api/sales` - جلب جميع المبيعات (مع فلترة: customerId, productId, startDate, endDate, paymentStatus)
- `GET /api/sales/:id` - جلب عملية بيع محددة

### Customers
- `POST /api/customers` - إضافة عميل جديد
- `GET /api/customers` - جلب جميع العملاء
- `GET /api/customers/:id` - جلب عميل محدد مع مبيعاته
- `PUT /api/customers/:id` - تحديث عميل
- `DELETE /api/customers/:id` - حذف عميل (SuperAdmin, Admin)

### Categories
- `POST /api/categories` - إضافة فئة جديدة (SuperAdmin, Admin)
- `GET /api/categories` - جلب جميع الفئات
- `GET /api/categories/:id` - جلب فئة محددة مع منتجاتها
- `PUT /api/categories/:id` - تحديث فئة (SuperAdmin, Admin)
- `DELETE /api/categories/:id` - حذف فئة (SuperAdmin, Admin)

### Invoices
- `POST /api/invoices` - إنشاء فاتورة جديدة
- `GET /api/invoices` - جلب جميع الفواتير (مع فلترة: startDate, endDate, customerId)
- `GET /api/invoices/:id` - جلب فاتورة محددة
- `PUT /api/invoices/:id` - تحديث حالة الدفع
- `DELETE /api/invoices/:id` - حذف فاتورة (SuperAdmin, Admin)

### Payments
- `POST /api/payments` - تسجيل دفعة جديدة
- `GET /api/payments` - جلب جميع المدفوعات (مع فلترة: invoiceId, startDate, endDate)
- `GET /api/payments/:id` - جلب دفعة محددة
- `DELETE /api/payments/:id` - حذف دفعة (SuperAdmin, Admin)

### Suppliers
- `POST /api/suppliers` - إضافة مورد جديد (SuperAdmin, Admin)
- `GET /api/suppliers` - جلب جميع الموردين
- `GET /api/suppliers/:id` - جلب مورد محدد مع مشترياته
- `PUT /api/suppliers/:id` - تحديث مورد (SuperAdmin, Admin)
- `DELETE /api/suppliers/:id` - حذف مورد (SuperAdmin, Admin)

### Purchases
- `POST /api/purchases` - تسجيل شراء جديد (SuperAdmin, Admin)
- `GET /api/purchases` - جلب جميع المشتريات (مع فلترة: supplierId, productId, startDate, endDate)
- `GET /api/purchases/:id` - جلب عملية شراء محددة
- `PUT /api/purchases/:id` - تحديث عملية شراء (SuperAdmin, Admin)
- `DELETE /api/purchases/:id` - حذف عملية شراء (SuperAdmin, Admin)

### Reports
- `GET /api/reports/dashboard` - لوحة التحكم الرئيسية
- `GET /api/reports/sales` - تقرير المبيعات (مع فلترة: startDate, endDate, groupBy)
- `GET /api/reports/products` - تقرير المنتجات
- `GET /api/reports/customers` - تقرير العملاء
- `GET /api/reports/financial` - التقرير المالي (SuperAdmin, Admin)

### Activity Logs
- `GET /api/activity-logs` - جلب سجل النشاطات (SuperAdmin, Admin)
- `GET /api/activity-logs/:id` - جلب نشاط محدد (SuperAdmin, Admin)

## 🎯 المميزات

### 1. إدارة العملاء
- إضافة/تعديل/حذف العملاء
- ربط المبيعات بالعملاء
- تتبع إجمالي المشتريات لكل عميل

### 2. فئات المنتجات
- تصنيف المنتجات
- فلترة المنتجات حسب الفئة
- إدارة الفئات

### 3. الفواتير
- إنشاء فواتير متعددة المنتجات
- رقم فاتورة تلقائي
- ربط الفواتير بالمبيعات

### 4. المدفوعات
- تسجيل المدفوعات
- دعم الدفع الجزئي
- تتبع حالة الدفع

### 5. الموردين والمشتريات
- إدارة الموردين
- تسجيل المشتريات
- زيادة المخزون تلقائياً

### 6. التقارير والإحصائيات
- Dashboard - نظرة عامة
- تقارير المبيعات
- تقارير المنتجات
- تقارير العملاء
- التقارير المالية

### 7. تنبيهات المخزون
- تحديد حد أدنى للمخزون
- قائمة المنتجات منخفضة المخزون

### 8. البحث والفلترة
- بحث في المنتجات
- فلترة حسب الفئة
- فلترة حسب التاريخ
- فلترة حسب حالة الدفع

### 9. سجل النشاطات
- تسجيل جميع العمليات
- تتبع التغييرات

### 10. فصل البيانات
- كل مستخدم له منتجاته الخاصة
- كل مستخدم له مبيعاته الخاصة
- لا يمكن للمستخدم رؤية بيانات مستخدمين آخرين

## 🔒 الأمان

- جميع الـ endpoints محمية بـ JWT Authentication
- كلمات المرور مشفرة بـ bcryptjs
- فصل البيانات لكل مستخدم
- صلاحيات محددة حسب الدور

## 📝 أمثلة على الاستخدام

### إنشاء منتج جديد:
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "منتج جديد",
  "category": "category_id",
  "price": 100,
  "stock": 50,
  "minStock": 10,
  "description": "وصف المنتج"
}
```

### إنشاء فاتورة:
```bash
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer_id",
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 2
    },
    {
      "productId": "product_id_2",
      "quantity": 1
    }
  ],
  "discount": 10,
  "paymentMethod": "Cash"
}
```

### جلب Dashboard:
```bash
GET /api/reports/dashboard
Authorization: Bearer <token>
```

## 🛠️ Scripts المتاحة

- `npm start` - تشغيل السيرفر
- `npm run dev` - تشغيل السيرفر في وضع التطوير (nodemon)
- `npm run create-user` - إنشاء مستخدم جديد

## 📞 الدعم

للمساعدة أو الاستفسارات، يرجى فتح issue في المستودع.

## 📄 الترخيص

ISC

