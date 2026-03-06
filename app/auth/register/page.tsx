'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CustomButton } from '@/components/ui/custom-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'

const carouselData = [
  {
    title: "Junte-se a milhares de estudantes que já transformaram suas carreiras",
    description: "Crie sua conta gratuita e tenha acesso a cursos premium, certificações reconhecidas e uma comunidade de aprendizado colaborativo.",
    author: "Maria Santos",
    email: "maria.santos@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Join+Community"
  },
  {
    title: "Acesso ilimitado a cursos premium e certificações",
    description: "Com uma única conta, você terá acesso a toda nossa biblioteca de cursos, materiais exclusivos e certificados reconhecidos pelo mercado.",
    author: "Pedro Silva",
    email: "pedro.silva@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Premium+Access"
  },
  {
    title: "Comunidade ativa de profissionais e mentores",
    description: "Conecte-se com outros estudantes, participe de discussões e receba mentoria de profissionais experientes da sua área.",
    author: "Ana Costa",
    email: "ana.costa@email.com",
    image: "/placeholder.svg?height=800&width=600&text=Active+Community"
  }
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()

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

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Verificar se há uma callbackUrl
        const callbackUrl = searchParams.get('callbackUrl')
        if (callbackUrl) {
          router.push(callbackUrl)
          return
        }

        // Redirecionar baseado no role do usuário
        if (data.user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentData = carouselData[currentSlide]

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
              <h1 className="text-2xl font-bold mb-2">Crie sua conta!</h1>
              <p className="text-white/90">Comece sua jornada de aprendizado</p>
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
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Nome Completo
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="João Silva"
                required
                className="w-full h-14 bg-gray-50 border-0 focus:bg-white focus:border-[#85E8EA] focus:ring-0 rounded-xl text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="joao@gmail.com"
                required
                className="w-full h-14 bg-gray-50 border-0 focus:bg-white focus:border-[#85E8EA] focus:ring-0 rounded-xl text-base text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-14 bg-gray-50 border-0 focus:bg-white focus:border-2 focus:border-[#85E8EA] focus:ring-0 rounded-xl text-base text-gray-900 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#85E8EA] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="h-14 bg-gray-50 border-0 focus:bg-white focus:border-2 focus:border-[#85E8EA] focus:ring-0 rounded-xl text-base text-gray-900 pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#85E8EA] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 text-[#85E8EA] bg-gray-100 border-gray-300 rounded focus:ring-[#85E8EA] focus:ring-2 mt-1"
              />
              <span className="ml-2 text-sm text-gray-600">
                Eu concordo com os{' '}
                <Link href="/terms" className="text-[#85E8EA] hover:text-[#6BC5E8] font-medium">
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link href="/privacy" className="text-[#85E8EA] hover:text-[#6BC5E8] font-medium">
                  Política de Privacidade
                </Link>
              </span>
            </div>

            <CustomButton
              type="submit"
              className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-base shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando conta...
                </div>
              ) : (
                'Criar Conta'
              )}
            </CustomButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link
                href="/auth/login"
                className="text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
              >
                Entrar
              </Link>
            </p>
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
            alt="Registration benefits"
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

        {/* Right Side - Register Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Welcome Header */}
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta!</h1>
              <p className="text-gray-600">Por favor, crie sua conta</p>
            </div>

            {/* Register Form */}
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name-desktop" className="text-sm font-medium text-gray-700">
                  Nome Completo
                </Label>
                <Input
                  id="name-desktop"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  required
                  className="h-12 bg-white border-gray-200 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-lg text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-desktop" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email-desktop"
                  name="email"
                  type="email"
                  placeholder="joao@gmail.com"
                  required
                  className="h-12 bg-white border-gray-200 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-lg text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-desktop" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password-desktop"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="h-12 bg-white border-gray-200 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-lg text-gray-900 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#85E8EA] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword-desktop" className="text-sm font-medium text-gray-700">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword-desktop"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="h-12 bg-white border-gray-200 focus:border-[#85E8EA] focus:ring-[#85E8EA]/20 rounded-lg text-gray-900 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#85E8EA] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-[#85E8EA] bg-gray-100 border-gray-300 rounded focus:ring-[#85E8EA] focus:ring-2 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Eu concordo com os{' '}
                  <Link href="/terms" className="text-[#85E8EA] hover:text-[#6BC5E8] font-medium">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacy" className="text-[#85E8EA] hover:text-[#6BC5E8] font-medium">
                    Política de Privacidade
                  </Link>
                </span>
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
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </CustomButton>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
