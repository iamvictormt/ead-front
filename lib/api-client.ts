import { buildApiUrl } from './api-config';

// Função helper para fazer requisições autenticadas ao backend
export async function authenticatedFetch(endpoint: string, options: RequestInit = {}) {
  // No lado do servidor, pegar token dos cookies
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('auth-token')?.value;

      return fetch(buildApiUrl(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });
    } catch (error) {
      console.error('Erro ao acessar cookies no servidor:', error);
      return fetch(buildApiUrl(endpoint), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
    }
  }

  // No lado do cliente, pegar token do cookie via document.cookie
  const token = getCookieValue('auth-token');

  return fetch(buildApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
}

// Helper para pegar valor do cookie no cliente
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Função para fazer requisições GET autenticadas
export async function authenticatedGet(endpoint: string) {
  return authenticatedFetch(endpoint, { method: 'GET' });
}

// Função para fazer requisições POST autenticadas
export async function authenticatedPost(endpoint: string, data: any) {
  return authenticatedFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Função para fazer requisições PUT autenticadas
export async function authenticatedPut(endpoint: string, data: any) {
  return authenticatedFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Função para fazer requisições DELETE autenticadas
export async function authenticatedDelete(endpoint: string) {
  return authenticatedFetch(endpoint, { method: 'DELETE' });
}
