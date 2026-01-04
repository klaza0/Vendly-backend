# إضافة مستخدم من MongoDB Shell

## ⚠️ ملاحظة مهمة

كلمات المرور في النظام مشفرة بـ **bcryptjs**. لا يمكنك إضافة مستخدم مباشرة من MongoDB Shell بدون تشفير كلمة المرور.

## ✅ الحلول المتاحة:

### الحل 1: استخدام Script (الأسهل والأفضل)

```bash
npm run create-user admin admin123 SuperAdmin
```

أو:
```bash
node scripts/createUser.js admin admin123 SuperAdmin
```

---

### الحل 2: استخدام Node.js Script مؤقت

أنشئ ملف `addUser.js` في المجلد الرئيسي:

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

async function addUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const username = "admin";
    const password = "admin123";
    const role = "SuperAdmin";

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      password: hashedPassword,
      role,
      subscription_status: "Active"
    });

    await user.save();
    console.log(`User "${username}" created successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

addUser();
```

ثم شغله:
```bash
node addUser.js
```

---

### الحل 3: استخدام MongoDB Shell مع bcrypt hash

إذا أردت استخدام MongoDB Shell مباشرة، ستحتاج أولاً لتشفير كلمة المرور:

#### الخطوة 1: احصل على bcrypt hash

استخدم Node.js للحصول على hash:

```javascript
// في Node.js console
const bcrypt = require("bcryptjs");
bcrypt.hash("admin123", 10).then(hash => console.log(hash));
```

أو استخدم هذا الملف `getHash.js`:

```javascript
const bcrypt = require("bcryptjs");
const password = process.argv[2] || "admin123";

bcrypt.hash(password, 10).then(hash => {
  console.log("Password:", password);
  console.log("Hash:", hash);
});
```

شغله:
```bash
node getHash.js admin123
```

#### الخطوة 2: استخدم Hash في MongoDB Shell

```javascript
// في MongoDB Shell
use vendly  // أو اسم قاعدة البيانات الخاصة بك

// إذا كان الموديل يحتوي على role و subscription_status:
db.users.insertOne({
  username: "admin",
  password: "$2a$10$YOUR_HASH_HERE",  // استبدل بالـ hash من الخطوة السابقة
  role: "SuperAdmin",
  subscription_status: "Active",
  createdAt: new Date()
})

// أو إذا كان الموديل يحتوي على name و email:
db.users.insertOne({
  username: "admin",
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$YOUR_HASH_HERE",  // استبدل بالـ hash من الخطوة السابقة
  createdAt: new Date()
})
```

---

### الحل 4: استخدام MongoDB Compass أو أي GUI

1. افتح MongoDB Compass
2. اتصل بقاعدة البيانات
3. اذهب إلى collection `users`
4. اضغط على "Insert Document"
5. أدخل البيانات (لكن تذكر أنك تحتاج hash لكلمة المرور)

---

## 📝 مثال كامل باستخدام MongoDB Shell

### 1. احصل على bcrypt hash أولاً:

```bash
# في Terminal
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('admin123',10).then(h=>console.log(h))"
```

**Output:**
```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 2. استخدم Hash في MongoDB Shell:

```javascript
// في MongoDB Shell
use vendly

db.users.insertOne({
  username: "admin",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  role: "SuperAdmin",
  subscription_status: "Active",
  createdAt: new Date()
})
```

### 3. تحقق من المستخدم:

```javascript
db.users.findOne({ username: "admin" })
```

---

## 🔍 التحقق من المستخدمين الموجودين

```javascript
// في MongoDB Shell
use vendly

// عرض جميع المستخدمين
db.users.find().pretty()

// البحث عن مستخدم محدد
db.users.findOne({ username: "admin" })

// عد المستخدمين
db.users.countDocuments()
```

---

## 🗑️ حذف مستخدم من MongoDB Shell

```javascript
// حذف مستخدم محدد
db.users.deleteOne({ username: "admin" })

// حذف جميع المستخدمين (احذر!)
db.users.deleteMany({})
```

---

## 🔄 تحديث مستخدم

```javascript
// تحديث دور مستخدم
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "Admin" } }
)

// تحديث حالة الاشتراك
db.users.updateOne(
  { username: "admin" },
  { $set: { subscription_status: "Expired" } }
)
```

---

## ⚠️ تحذيرات مهمة:

1. **لا تضع كلمة مرور غير مشفرة** - النظام لن يعمل
2. **استخدم bcrypt hash دائماً** - لا تستخدم MD5 أو SHA
3. **تأكد من الصيغة الصحيحة** - يجب أن يبدأ hash بـ `$2a$10$`
4. **لا تنسى الحقول المطلوبة:**
   - `username` (مطلوب، unique)
   - `password` (مطلوب، مشفر)
   - `role` (مطلوب: SuperAdmin, Admin, أو Cashier)
   - `subscription_status` (افتراضي: Active)

---

## 💡 نصيحة:

**الأفضل والأسهل:** استخدم Script الموجود:
```bash
npm run create-user admin admin123 SuperAdmin
```

هذا أسهل وأكثر أماناً من استخدام MongoDB Shell مباشرة.

---

## 📋 Checklist:

- [ ] هل قمت بتشفير كلمة المرور بـ bcrypt؟
- [ ] هل Hash يبدأ بـ `$2a$10$`؟
- [ ] هل أضفت جميع الحقول المطلوبة؟
- [ ] هل `username` فريد (unique)؟
- [ ] هل `role` صحيح (SuperAdmin, Admin, أو Cashier)؟

