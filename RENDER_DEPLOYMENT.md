# 🚀 دليل رفع Pokemon Explorer على Render

## الخطوات المطلوبة:

### 1. التأكد من رفع الكود إلى GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. إنشاء حساب على Render
- اذهب إلى [render.com](https://render.com)
- سجل الدخول باستخدام GitHub

### 3. إنشاء Web Service جديد
1. اضغط على "New +" → "Web Service"
2. اختر المستودع: `Pokemon_Explorer`
3. إعدادات الـ Deployment:
   - **Name**: `pokemon-explorer`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: اتركه فارغ
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 4. متغيرات البيئة (Environment Variables)
أضف هذه المتغيرات في إعدادات Render:
- `NODE_ENV` = `production`
- `PORT` = `10000` (سيتم تعيينه تلقائياً)
- `HOST` = `0.0.0.0`

### 5. إعدادات إضافية
- **Auto-Deploy**: مفعل (لرفع تلقائي عند git push)
- **Plan**: Free (يكفي للمشاريع البسيطة)

### 6. بعد النشر
- سيكون الرابط: `https://pokemon-explorer-[hash].onrender.com`
- أول deployment قد يأخذ 5-10 دقائق
- Render المجاني قد يكون بطيء في البداية (cold start)

## ✅ الملفات التي تم إنشاؤها:
- `render.yaml` - إعدادات Render (اختياري)
- `.env.production` - متغيرات البيئة للإنتاج
- `server.js` - سيرفر Express لتشغيل التطبيق
- تحديث `package.json` لدعم npm

## 🔧 استكشاف الأخطاء:
- إذا فشل البناء: تحقق من Build Logs في Render
- إذا لم يعمل التطبيق: تحقق من Deploy Logs
- للمساعدة: اطلع على Render Docs

## 💡 نصائح:
- Render المجاني ينام بعد 15 دقيقة عدم استخدام
- لتسريع الاستجابة: استخدم الخطة المدفوعة
- يمكن ربط دومين مخصص في الإعدادات
