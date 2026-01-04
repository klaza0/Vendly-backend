# دليل استخدام API - حل مشكلة Unauthorized

## 🔐 مشكلة "Unauthorized"

إذا حصلت على `{"message":"Unauthorized"}`, هذا يعني أنك لم ترسل Token أو Token غير صحيح.

## ✅ الحل خطوة بخطوة:

### 1. تسجيل الدخول أولاً

**Request:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YjEyMzQ1Njc4OTAxMjMiLCJyb2xlIjoiU3VwZXJBZG1pbiIsInN1YnNjcmlwdGlvbl9zdGF0dXMiOiJBY3RpdmUiLCJpYXQiOjE3MDk4NzY1NDMsImV4cCI6MTcxMDQ4MTM0M30.xxxxx",
  "role": "SuperAdmin",
  "subscription_status": "Active"
}
```

### 2. استخدام Token في الطلبات التالية

**مهم جداً:** يجب إرسال Token في Header بهذا الشكل:

```bash
Authorization: Bearer <your-token-here>
```

## 📝 أمثلة عملية:

### مثال 1: استخدام curl

```bash
# 1. تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 2. نسخ Token من الرد

# 3. استخدام Token في الطلب التالي
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### مثال 2: استخدام Postman

1. **تسجيل الدخول:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **نسخ Token من الرد**

3. **استخدام Token:**
   - Method: `GET`
   - URL: `http://localhost:5000/api/products`
   - Headers:
     - `Authorization: Bearer <paste-token-here>`
     - `Content-Type: application/json`

### مثال 3: استخدام JavaScript (Fetch)

```javascript
// 1. تسجيل الدخول
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const { token } = await loginResponse.json();

// 2. استخدام Token
const productsResponse = await fetch('http://localhost:5000/api/products', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const products = await productsResponse.json();
console.log(products);
```

### مثال 4: استخدام Axios

```javascript
import axios from 'axios';

// 1. تسجيل الدخول
const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
  username: 'admin',
  password: 'admin123'
});

const { token } = loginResponse.data;

// 2. استخدام Token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// الآن جميع الطلبات ستستخدم Token تلقائياً
const productsResponse = await axios.get('http://localhost:5000/api/products');
```

## ⚠️ الأخطاء الشائعة:

### 1. نسيان كلمة "Bearer"
❌ خطأ:
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ صحيح:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Token منتهي الصلاحية
- Token صالح لمدة 24 ساعة فقط
- إذا انتهت صلاحيته، ستحصل على `{"message":"Invalid Token"}`
- **الحل:** سجل دخول مرة أخرى للحصول على token جديد

### 3. Token غير صحيح
- تأكد من نسخ Token كاملاً بدون مسافات
- لا تقطع Token

### 4. JWT_SECRET غير موجود
- تأكد من وجود `JWT_SECRET` في ملف `.env`
- إذا لم يكن موجوداً، أضفه:
```env
JWT_SECRET=your-secret-key-here-make-it-strong
```

## 🔍 اختبار سريع:

### اختبار 1: تسجيل الدخول
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### اختبار 2: استخدام Token
```bash
# استبدل YOUR_TOKEN_HERE بالـ token من الخطوة السابقة
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Checklist:

- [ ] هل قمت بتسجيل الدخول أولاً؟
- [ ] هل نسخت Token من الرد؟
- [ ] هل أضفت `Bearer` قبل Token؟
- [ ] هل Token في Header باسم `Authorization`؟
- [ ] هل Token لم ينتهِ صلاحيته (24 ساعة)؟
- [ ] هل `JWT_SECRET` موجود في `.env`؟

## 🆘 إذا استمرت المشكلة:

1. **تحقق من السيرفر:**
   ```bash
   # تأكد أن السيرفر يعمل
   curl http://localhost:5000/
   # يجب أن ترى: "Vendly Sales API Running"
   ```

2. **تحقق من المستخدم:**
   ```bash
   # تأكد أن المستخدم موجود
   npm run create-user admin admin123 SuperAdmin
   ```

3. **تحقق من الـ Logs:**
   - افتح Terminal الذي يعمل فيه السيرفر
   - شاهد الأخطاء إن وجدت

## 💡 نصيحة:

احفظ Token في متغير لتسهيل الاستخدام:

```javascript
// في JavaScript
let authToken = '';

// بعد تسجيل الدخول
authToken = loginResponse.data.token;

// استخدامه
fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${authToken}`
  }
});
```

