'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CustomButton } from '@/components/ui/custom-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const carouselData = [
  {
    title: "Recupere o acesso à sua conta de forma segura",
    description: "Digite seu e-mail e enviaremos um link seguro para você redefinir sua senha e voltar a aprender conosco.",
    author: "Suporte",
    email: "suporte@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Password+Recovery"
  },
  {
    title: "Sua segurança é nossa prioridade",
    description: "Utilizamos os mais altos padrões de segurança para proteger sua conta e garantir que apenas você tenha acesso aos seus dados.",
    author: "Equipe de Segurança",
    email: "security@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Security+First"
  },
  {
    title: "Volte a aprender em poucos minutos",
    description: "O processo de recuperação é rápido e simples. Em poucos minutos você estará de volta aos seus cursos favoritos.",
    author: "Equipe do sistema EAD",
    email: "team@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Quick+Recovery"
  }
]

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Force light theme for auth pages
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length)
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setIsEmailSent(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao enviar e-mail')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentData = carouselData[currentSlide]

  if (isEmailSent) {
    return (
      <div className="w-full">
        {/* Mobile Layout - Success */}
        <div className="lg:hidden min-h-screen bg-white w-full">
          {/* Mobile Hero Section */}
          <div className="relative h-64 bg-gradient-to-br from-[#85E8EA] to-[#6BC5E8] overflow-hidden w-full">
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              {/* Logo */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">LOGO AQUI</span>
              </div>

              {/* Welcome Text */}
              <div className="text-center pb-4">
                <h1 className="text-2xl font-bold mb-2">E-mail Enviado!</h1>
                <p className="text-white/90">Verifique sua caixa de entrada</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          </div>

          {/* Mobile Success Content */}
          <div className="w-full px-6 py-8 -mt-6 bg-white rounded-t-3xl relative z-10 min-h-[calc(100vh-256px)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">E-mail Enviado com Sucesso!</h2>
              <p className="text-gray-600 mb-8 text-base">
                Enviamos um link de redefinição de senha para seu e-mail. Verifique sua caixa de entrada e siga as instruções.
              </p>
              
              <div className="space-y-4">
                <CustomButton asChild className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-base shadow-lg">
                  <Link href="/auth/login">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao Login
                  </Link>
                </CustomButton>
                
                <p className="text-sm text-gray-500">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-[#85E8EA] hover:text-[#6BC5E8] font-semibold"
                  >
                    tente novamente
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Success */}
        <div className="hidden lg:flex min-h-screen bg-white">
          {/* Left Side - Hero */}
          <div className="lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#85E8EA]/90 to-[#6BC5E8]/90 z-10" />
            <img 
              src="/placeholder.svg?height=800&width=600&text=Email+Sent"
              alt="Email sent successfully"
              className="w-full h-full object-cover"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LOGO AQUI</span>
              </div>

              {/* Main Content */}
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-white/50 rounded-full" />
                  <div className="w-2 h-2 bg-white/30 rounded-full" />
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                
                <h2 className="text-3xl font-bold mb-4 leading-tight">
                  Verifique seu e-mail para continuar
                </h2>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Enviamos um link seguro para redefinir sua senha. 
                  Siga as instruções no e-mail para criar uma nova senha.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-white/70">03 / 03</div>
              </div>
            </div>
          </div>

          {/* Right Side - Success Message */}
          <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-md text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">E-mail Enviado!</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Enviamos um link de redefinição de senha para seu e-mail. Verifique sua caixa de entrada e siga as instruções.
              </p>
              
              <div className="space-y-4">
                <CustomButton asChild size="lg" className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-semibold">
                  <Link href="/auth/login">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar ao Login
                  </Link>
                </CustomButton>
                
                <p className="text-sm text-gray-500">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-[#85E8EA] hover:text-[#6BC5E8] font-medium"
                  >
                    tente novamente
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-white w-full">
        {/* Mobile Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-[#85E8EA] to-[#6BC5E8] overflow-hidden w-full">
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold">LOGO AQUI</span>
            </div>

            {/* Welcome Text */}
            <div className="text-center pb-4">
              <h1 className="text-2xl font-bold mb-2">Esqueceu a senha?</h1>
              <p className="text-white/90">Vamos ajudar você a recuperar</p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Mobile Form */}
        <div className="w-full px-6 py-8 -mt-6 bg-white rounded-t-3xl relative z-10 min-h-[calc(100vh-256px)]">
          <form action={handleSubmit} className="w-full space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@gmail.com"
                required
                className="w-full h-14 bg-gray-50 border-0 focus:bg-white focus:border-[#85E8EA] focus:ring-0 rounded-xl text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <CustomButton
              type="submit"
              className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-base shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                'Enviar Link de Redefinição'
              )}
            </CustomButton>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-white">
        {/* Left Side - Hero Carousel */}
        <div className="lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#85E8EA]/90 to-[#6BC5E8]/90 z-10" />
          <img 
            src={currentData.image || "/placeholder.svg"}
            alt="Password recovery"
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">LOGO AQUI</span>
            </div>

            {/* Main Content */}
            <div className="max-w-md">
              {/* Slide Indicators */}
              <div className="flex items-center gap-2 mb-6">
                {carouselData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <h2 className="text-3xl font-bold mb-4 leading-tight transition-all duration-500">
                {currentData.title}
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed transition-all duration-500">
                {currentData.description}
              </p>
              
              <div className="space-y-2 transition-all duration-500">
                <p className="font-semibold">{currentData.author}</p>
                <p className="text-white/80">{currentData.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-white/70">
                {String(currentSlide + 1).padStart(2, '0')} / {String(carouselData.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Welcome Header */}
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Esqueceu a Senha?</h1>
              <p className="text-gray-600">Digite seu e-mail para redefinir sua senha</p>
            </div>

            {/* Forgot Password Form */}
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email-desktop"
                  name="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  className="h-12 bg-white border-gray-200 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-lg text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <CustomButton
                type="submit"
                size="lg"
                className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 rounded-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </div>
                ) : (
                  'Enviar Link de Redefinição'
                )}
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-[#85E8EA] hover:text-[#6BC5E8] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
