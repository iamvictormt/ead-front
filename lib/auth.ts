import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const key = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

// Função para obter sessão usando o token do backend (apenas no servidor)
export async function getSession() {
  // Esta função só pode ser usada em Server Components ou API Routes
  if (typeof window !== 'undefined') {
    console.error('getSession() foi chamado no cliente. Use getClientSession() em vez disso.');
    return null;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const userData = cookieStore.get('user-data')?.value;

    if (!authToken || !userData) return null;

    // Retornar dados do usuário (o token JWT será usado para requisições ao backend)
    return {
      token: authToken,
      user: JSON.parse(userData),
    };
  } catch (error) {
    console.error('Erro ao obter sessão no servidor:', error);
    return null;
  }
}

// Função para obter sessão no cliente (usando document.cookie)
export function getClientSession() {
  if (typeof window === 'undefined') {
    console.error('getClientSession() foi chamado no servidor. Use getSession() em vez disso.');
    return null;
  }

  const authToken = getCookieValue('auth-token');
  const userData = getCookieValue('user-data');

  if (!authToken || !userData) return null;

  try {
    return {
      token: authToken,
      user: JSON.parse(userData),
    };
  } catch (error) {
    console.error('Erro ao parsear dados do usuário no cliente:', error);
    return null;
  }
}

// Helper para pegar valor do cookie no cliente
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  } catch (error) {
    console.error('Erro ao ler cookie:', error);
    return null;
  }
}

// Função para verificar se o token ainda é válido (opcional - pode fazer requisição ao backend)
export async function validateToken(token: string) {
  try {
    // Aqui você pode fazer uma requisição ao backend para validar o token
    // Por enquanto, vamos assumir que o token é válido se existir
    return !!token;
  } catch (error) {
    return false;
  }
}

export async function logout() {
  // Esta função só funciona no servidor
  if (typeof window !== 'undefined') {
    console.error('logout() foi chamado no cliente. Use clientLogout() em vez disso.');
    return;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set('auth-token', '', { expires: new Date(0) });
    cookieStore.set('user-data', '', { expires: new Date(0) });
  } catch (error) {
    console.error('Erro ao fazer logout no servidor:', error);
  }
}

// Função de logout para o cliente
export function clientLogout() {
  if (typeof window === 'undefined') {
    console.error('clientLogout() foi chamado no servidor.');
    return;
  }

  try {
    // Limpar cookies no cliente
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirecionar para login
    window.location.href = '/auth/login';
  } catch (error) {
    console.error('Erro ao fazer logout no cliente:', error);
    // Mesmo com erro, tentar redirecionar
    window.location.href = '/auth/login';
  }
}

export async function updateSession(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const userData = request.cookies.get('user-data')?.value;

  if (!authToken || !userData) return;

  // Verificar se o token ainda é válido
  const isValid = await validateToken(authToken);
  if (!isValid) {
    // Token inválido, redirecionar para login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.set('auth-token', '', { expires: new Date(0) });
    response.cookies.set('user-data', '', { expires: new Date(0) });
    return response;
  }

  // Token válido, continuar
  return NextResponse.next();
}

// Função helper para obter o token para requisições ao backend (apenas no servidor)
export async function getAuthToken() {
  if (typeof window !== 'undefined') {
    console.error('getAuthToken() foi chamado no cliente.');
    return null;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value;
  } catch (error) {
    console.error('Erro ao obter token de autenticação:', error);
    return null;
  }
}

// Manter funções antigas para compatibilidade (podem ser removidas depois)
export async function login(formData: FormData) {
  // Esta função não é mais usada, mas mantida para compatibilidade
  throw new Error('Use a nova API de login');
}

export async function register(formData: FormData) {
  // Esta função não é mais usada, mas mantida para compatibilidade
  throw new Error('Use a nova API de registro');
}

// Mock user verification - não é mais usado
async function verifyUser(email: string, password: string) {
  return null;
}
