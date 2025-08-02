import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


// Rate limiting 
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; 
const WINDOW_MS = 15 * 60 * 1000; 

// Check if the client has exceeded the rate limit
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(clientIP);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  
  if (userRequests.count >= RATE_LIMIT) {
    return false; 
  }
  
  userRequests.count++;
  return true;
}

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
  try {
    const clientIP = getClientAddress();
    
    if (!checkRateLimit(clientIP)) {
      return json({ 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Try again later.' 
      }, { 
        status: 429,
        headers: {
          'Retry-After': '900' 
        }
      });
    }

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
