import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// قائمة الـ IP المسموحة
const ALLOWED_IPS = [
  '127.0.0.1',
  '::1',
  'your-server-ip-here'
];

// Rate limiting - حماية من الطلبات المفرطة
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // 100 طلب
const WINDOW_MS = 15 * 60 * 1000; // كل 15 دقيقة

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(clientIP);
  
  if (!userRequests || now > userRequests.resetTime) {
    // إعادة تعيين العداد
    requestCounts.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  
  if (userRequests.count >= RATE_LIMIT) {
    return false; // تجاوز الحد المسموح
  }
  
  userRequests.count++;
  return true;
}

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
  try {
    // فحص IP Address
    const clientIP = getClientAddress();
    
    // فحص Rate Limiting
    if (!checkRateLimit(clientIP)) {
      return json({ 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Try again later.' 
      }, { 
        status: 429,
        headers: {
          'Retry-After': '900' // 15 دقيقة
        }
      });
    }

    // في الإنتاج، يمكنك تفعيل فحص IP
    // if (!ALLOWED_IPS.includes(clientIP)) {
    //   return json({ error: 'Access denied' }, { status: 403 });
    // }

    const limit = url.searchParams.get('limit') || '20';
    const offset = url.searchParams.get('offset') || '0';
    
    // Proxy to PokéAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from PokéAPI');
    }
    
    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Pokemon API error:', error);
    return json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    );
  }
};
