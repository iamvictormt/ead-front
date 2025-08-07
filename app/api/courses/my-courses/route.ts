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

    // Buscar cursos do usuário no backend
    const response = await authenticatedGet('/courses/my-courses');

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Erro ao buscar cursos' }, { status: response.status });
    }

    const coursesData = await response.json();

    return NextResponse.json({
      success: true,
      data: coursesData,
    });
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
