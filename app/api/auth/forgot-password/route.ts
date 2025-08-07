import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    // Mock email sending - replace with actual email service
    console.log(`Sending password reset email to: ${email}`)
    
    // Here you would typically:
    // 1. Generate a reset token
    // 2. Store it in your database with expiration
    // 3. Send email with reset link
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao enviar e-mail de recuperação' },
      { status: 500 }
    )
  }
}
