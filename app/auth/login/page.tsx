'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

const carouselData = [
  {
    title: 'Transforme sua carreira com cursos online profissionais',
    description:
      'Acesse conteúdo exclusivo criado por especialistas da indústria. Aprenda no seu ritmo e conquiste certificações reconhecidas pelo mercado.',
    author: 'João Silva',
    email: 'joao.silva@email.com',
    image: '/placeholder.svg?height=800&width=600&text=Professional+Learning',
  },
  {
    title: 'Aprenda com os melhores profissionais do mercado',
    description:
      'Nossos instrutores são especialistas reconhecidos em suas áreas, prontos para compartilhar conhecimento prático e experiências reais.',
    author: 'Maria Santos',
    email: 'maria.santos@email.com',
    image: '/placeholder.svg?height=800&width=600&text=Expert+Instructors',
  },
  {
    title: 'Certificações reconhecidas pelo mercado de trabalho',
    description:
      'Obtenha certificados que realmente fazem diferença no seu currículo e abrem portas para novas oportunidades profissionais.',
    author: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    image: '/placeholder.svg?height=800&width=600&text=Professional+Certificates',
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Force light theme for auth pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verificar se há uma callbackUrl
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          router.push(callbackUrl);
          return;
        }

        // Redirecionar baseado no role do usuário
        if (data.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const currentData = carouselData[currentSlide];

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
              <h1 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h1>
              <p className="text-white/90">Continue sua jornada de aprendizado</p>
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
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

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <CustomButton
              type="submit"
              className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold text-base shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </CustomButton>

            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <CustomButton
              type="button"
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold text-base"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </CustomButton> */}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link
                href="/auth/register"
                className="text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 text-center mb-3">Credenciais de Demonstração:</p>
            <div className="text-sm text-gray-600 space-y-1 text-center">
              <p>
                <strong>Admin:</strong> admin@email.com / 123456
              </p>
              <p>
                <strong>Usuário:</strong> user@email.com / 123456
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-white">
        {/* Left Side - Hero Carousel */}
        <div className="lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#85E8EA]/90 to-[#6BC5E8]/90 z-10" />
          <img
            src={currentData.image || '/placeholder.svg'}
            alt="Learning environment"
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

              <h2 className="text-3xl font-bold mb-4 leading-tight transition-all duration-500">{currentData.title}</h2>
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

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Welcome Header */}
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
              <p className="text-gray-600">Faça login na sua conta</p>
            </div>

            {/* Login Form */}
            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
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

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#85E8EA] hover:text-[#6BC5E8] font-medium transition-colors"
                >
                  Esqueceu a senha?
                </Link>
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
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </CustomButton>

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#EFFFFF] text-gray-500">or</span>
                </div>
              </div>

              <CustomButton
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </CustomButton> */}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link
                  href="/auth/register"
                  className="text-[#85E8EA] hover:text-[#6BC5E8] font-semibold transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Demo Credentials - Desktop */}
        <div className="fixed bottom-6 right-6 p-4 bg-white rounded-xl shadow-lg border border-[#85E8EA]/20 max-w-xs z-30">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Credenciais de Demonstração:</strong>
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Admin: admin@email.com / 123456</p>
            <p>Usuário: user@email.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
