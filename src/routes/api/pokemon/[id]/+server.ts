import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONFIG } from '$lib/config';

// مفاتيح API المسموحة (في الإنتاج ضعها في متغيرات البيئة)
const VALID_API_KEYS = [
  'your-secret-api-key-1',
  'your-secret-api-key-2'
];

function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get('x-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '');
  
  return apiKey ? VALID_API_KEYS.includes(apiKey) : false;
}

export const GET: RequestHandler = async ({ params, request }) => {
  try {
    // فحص مفتاح API (اختياري - علق السطور التالية لتعطيل الفحص)
    // if (!validateApiKey(request)) {
    //   return json({ 
    //     error: 'Unauthorized',
    //     message: 'Valid API key required' 
    //   }, { status: 401 });
    // }
    const { id } = params;
    
    // Add timeout and retry logic for Pokemon API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);
    
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Pokemon-Explorer/1.0'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Pokemon API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return json(data);
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
    
  } catch (error) {
    console.error(`Pokemon detail API error for ID ${params.id}:`, error);
    
    // Return a mock response instead of failing completely
    const mockPokemon = {
      id: parseInt(params.id || '1'),
      name: `pokemon-${params.id}`,
      height: 10,
      weight: 100,
      base_experience: 100,
      sprites: {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${params.id}.png`
      },
      types: [{ type: { name: 'unknown' } }],
      stats: [
        { stat: { name: 'hp' }, base_stat: 50 },
        { stat: { name: 'attack' }, base_stat: 50 },
        { stat: { name: 'defense' }, base_stat: 50 },
        { stat: { name: 'special-attack' }, base_stat: 50 },
        { stat: { name: 'special-defense' }, base_stat: 50 },
        { stat: { name: 'speed' }, base_stat: 50 }
      ],
      abilities: [{ ability: { name: 'unknown' } }]
    };
    
    console.log(`Returning mock data for Pokemon ${params.id}`);
    return json(mockPokemon);
  }
};
