import { NextRequest, NextResponse } from 'next/server'
import { buildApiUrl, API_CONFIG } from '@/lib/api-config'
import { encrypt } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Fazer requisição para o backend NestJS
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Tratar erros do backend
      return NextResponse.json(
        { 
          error: data.message || 'Erro ao criar conta',
          statusCode: data.statusCode 
        },
        { status: response.status }
      )
    }

    // Criar sessão local com os dados do usuário
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt({ 
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(), // Converter STUDENT para student
      }, 
      expires 
    })

    // Criar resposta com cookie de sessão
    const responseObj = NextResponse.json({ 
      success: true, 
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role.toLowerCase(),
      }
    })

    responseObj.cookies.set('session', session, { 
      expires, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    
    return responseObj
  } catch (error) {
    console.error('Erro na requisição de registro:', error)
    return NextResponse.json(
      { error: 'Erro de conexão com o servidor. Tente novamente.' },
      { status: 500 }
    )
  }
}
