import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl, API_CONFIG } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Fazer requisição para o backend NestJS
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Tratar erros do backend
      return NextResponse.json(
        {
          error: data.message || 'E-mail ou senha incorretos',
          statusCode: data.statusCode,
        },
        { status: response.status }
      );
    }

    // Calcular data de expiração baseada no expiresIn do backend
    const expiresIn = data.expiresIn || '1d';
    const expirationTime = expiresIn === '1d' ? 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 1 dia em ms
    const expires = new Date(Date.now() + expirationTime);

    // Criar resposta com cookie contendo o token JWT do backend
    const responseObj = NextResponse.json({
      success: true,
      user: {
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(), // Converter STUDENT/ADMIN para student/admin
      },
      token: data.token,
      expiresIn: data.expiresIn,
    });

    // Salvar o token JWT do backend no cookie
    responseObj.cookies.set('auth-token', data.token, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Também salvar dados do usuário em cookie separado para acesso fácil
    responseObj.cookies.set(
      'user-data',
      JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(),
      }),
      {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      }
    );

    return responseObj;
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    return NextResponse.json({ error: 'Erro de conexão com o servidor. Tente novamente.' }, { status: 500 });
  }
}
