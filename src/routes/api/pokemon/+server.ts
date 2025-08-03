import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONFIG } from '$lib/config';
import { fetchWithRetry, createMockPokemonList } from '$lib/utils/network';

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

    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Validate parameters
    if (limit > 1000 || limit < 1) {
      return json({ error: 'Invalid limit parameter' }, { status: 400 });
    }
    
    if (offset < 0) {
      return json({ error: 'Invalid offset parameter' }, { status: 400 });
    }
    
    try {
      // Proxy to PokéAPI with enhanced retry mechanism
      const response = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        {
          retries: 3,
          delay: 1000,
          backoff: true,
          timeout: CONFIG.API_TIMEOUT
        }
      );
      
      const data = await response.json();
      
      // Validate response data
      if (!data || !data.results) {
        throw new Error('Invalid response data from Pokemon API');
      }
      
      return json(data, {
        headers: {
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          'X-Source': 'pokemon-api'
        }
      });
      
    } catch (fetchError) {
      console.error('Pokemon API error:', fetchError);
      
      // Return mock data as fallback
      const mockData = createMockPokemonList(limit, offset);
      
      return json(mockData, { 
        status: 200,
        headers: {
          'X-Fallback': 'true',
          'X-Error': 'API unavailable',
          'Cache-Control': 'public, max-age=60' // Cache fallback for 1 minute
        }
      });
    }
    
  } catch (error) {
    console.error('Unexpected Pokemon API error:', error);
    
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const mockData = createMockPokemonList(limit, offset);
    
    return json(mockData, { 
      status: 200,
      headers: {
        'X-Fallback': 'true',
        'X-Error': 'Unexpected error'
      }
    });
  }
};
