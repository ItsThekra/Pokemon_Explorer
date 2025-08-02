// import type { Handle } from '@sveltejs/kit';

// // User Agents المحظورة
// const BLOCKED_USER_AGENTS = [
//   'bot',
//   'crawler',
//   'spider',
//   'scraper',
//   'python-requests',
//   'curl',
//   'wget'
// ];

// function isBlockedUserAgent(userAgent: string): boolean {
//   const ua = userAgent.toLowerCase();
//   return BLOCKED_USER_AGENTS.some(blocked => ua.includes(blocked));
// }

// export const handle: Handle = async ({ event, resolve }) => {
//   // التحكم في CORS - من يمكنه الوصول للAPI
//   if (event.url.pathname.startsWith('/api')) {
//     const userAgent = event.request.headers.get('user-agent') || '';
    
//     // حظر User Agents معينة
//     if (isBlockedUserAgent(userAgent)) {
//       return new Response('Forbidden', { status: 403 });
//     }

//     // قائمة النطاقات المسموحة
//     const allowedOrigins = [
//       'https://your-domain.com',
//       'https://www.your-domain.com',
//       'http://localhost:5173', // للتطوير
//       'http://localhost:5174', // للتطوير (Port بديل)
//       'http://localhost:4173', // للبناء المحلي
//       'http://localhost:3000', // للتطوير الأخر
//     ];

//     const origin = event.request.headers.get('origin');
    
//     // فحص إذا كان النطاق مسموح
//     if (origin && allowedOrigins.includes(origin)) {
//       const response = await resolve(event);
//       response.headers.set('Access-Control-Allow-Origin', origin);
//       response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//       response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
//       return response;
//     } else {
//       // رفض الطلبات من نطاقات غير مسموحة
//       return new Response('Forbidden', { status: 403 });
//     }
//   }

//   return resolve(event);
// };
