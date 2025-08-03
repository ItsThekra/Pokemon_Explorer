// Network utilities for handling API requests with reliability
export interface RetryOptions {
  retries?: number;
  delay?: number;
  backoff?: boolean;
}

export interface TimeoutOptions {
  timeout?: number;
}

/**
 * Enhanced fetch with retry mechanism and timeout
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit & RetryOptions & TimeoutOptions = {}
): Promise<Response> {
  const { 
    retries = 3, 
    delay = 1000, 
    backoff = true, 
    timeout = 15000,
    ...fetchOptions 
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'User-Agent': 'Pokemon-Explorer/1.0',
            'Accept': 'application/json',
            'Cache-Control': 'public, max-age=300', // 5 minutes cache
            ...fetchOptions.headers
          }
        });

        // Clear timeout on successful response
        clearTimeout(timeoutId);

        // If response is ok, return it
        if (response.ok) {
          return response;
        }

        // If it's a client error (4xx), don't retry
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Client error: ${response.status} ${response.statusText}`);
        }

        // If it's a server error (5xx) and we have retries left, continue
        if (attempt < retries) {
          const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
          console.log(`Attempt ${attempt + 1} failed, retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // No more retries, throw error
        throw new Error(`Server error: ${response.status} ${response.statusText}`);

      } catch (error) {
        // Clear timeout on error
        clearTimeout(timeoutId);

        // If it's an AbortError (timeout), don't retry
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`);
        }

        // If it's a network error and we have retries left, continue
        if (attempt < retries) {
          const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
          console.log(`Network error on attempt ${attempt + 1}, retrying in ${waitTime}ms:`, error);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // No more retries, throw the original error
        throw error;
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  throw new Error('Max retries exceeded');
}

/**
 * Create a mock Pokemon response for fallback
 */
export function createMockPokemon(id: number) {
  return {
    id,
    name: `pokemon-${id}`,
    height: 10,
    weight: 100,
    base_experience: 100,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      front_shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`
    },
    types: [{ type: { name: 'normal' } }],
    stats: [
      { stat: { name: 'hp' }, base_stat: 45 },
      { stat: { name: 'attack' }, base_stat: 49 },
      { stat: { name: 'defense' }, base_stat: 49 },
      { stat: { name: 'special-attack' }, base_stat: 65 },
      { stat: { name: 'special-defense' }, base_stat: 65 },
      { stat: { name: 'speed' }, base_stat: 45 }
    ],
    abilities: [
      { ability: { name: 'overgrow' } },
      { ability: { name: 'chlorophyll' } }
    ]
  };
}

/**
 * Create mock Pokemon list for fallback
 */
export function createMockPokemonList(limit = 20, offset = 0) {
  const results = [];
  for (let i = 1; i <= limit; i++) {
    const id = offset + i;
    results.push({
      name: `pokemon-${id}`,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`
    });
  }

  return {
    count: 1302,
    next: offset + limit < 1302 ? `https://pokeapi.co/api/v2/pokemon?offset=${offset + limit}&limit=${limit}` : null,
    previous: offset > 0 ? `https://pokeapi.co/api/v2/pokemon?offset=${Math.max(0, offset - limit)}&limit=${limit}` : null,
    results
  };
}
