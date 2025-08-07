import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl, API_CONFIG } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value;

    // Opcional: fazer logout no backend também
    if (authToken) {
      try {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGOUT), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro ao fazer logout no backend:', error);
        // Continuar mesmo se o logout no backend falhar
      }
    }

    // Limpar cookies locais
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth-token', '', { expires: new Date(0) });
    response.cookies.set('user-data', '', { expires: new Date(0) });

    return response;
  } catch (error) {
    console.error('Erro no logout:', error);
    return NextResponse.json({ error: 'Erro ao fazer logout' }, { status: 500 });
  }
}
