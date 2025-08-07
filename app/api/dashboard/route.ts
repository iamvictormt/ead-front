import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authenticatedGet } from '@/lib/api-client';

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar dados do dashboard no backend
    const response = await authenticatedGet('/dashboard');

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Erro ao buscar dados do dashboard' },
        { status: response.status }
      );
    }

    const dashboardData = await response.json();

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
