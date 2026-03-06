'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CustomButton } from '@/components/ui/custom-button';
import { CustomCard } from '@/components/ui/custom-card';
import { GraduationCap, Trash2, ShoppingCart, ArrowRight, MessageCircle } from 'lucide-react';
import { mockCourses, Course } from '@/lib/courses';
import { getClientSession } from '@/lib/auth';
import Link from 'next/link';

function CarrinhoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const session = getClientSession();
    setIsLogged(!!session);

    // 1. Pegar IDs da URL
    const idsFromUrl = searchParams.get('ids');
    let currentCart: number[] = [];

    // 2. Carregar carrinho atual do localStorage
    const savedCart = localStorage.getItem('carrinho_cursos');
    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart);
      } catch (e) {
        currentCart = [];
      }
    }

    // 3. Se houver IDs na URL, mesclar com o carrinho atual
    if (idsFromUrl) {
      const newIds = idsFromUrl.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));

      // Adicionar apenas os que ainda não estão no carrinho
      const updatedCart = [...new Set([...currentCart, ...newIds])];
      localStorage.setItem('carrinho_cursos', JSON.stringify(updatedCart));
      currentCart = updatedCart;

      // Limpar a URL para não ficar re-adicionando
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }

    // 4. Buscar detalhes dos cursos (usando mock por enquanto, mas poderia ser via API)
    const items = mockCourses.filter((course) => currentCart.includes(course.id));
    setCartItems(items);
    setIsLoading(false);
  }, [searchParams]);

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('carrinho_cursos', JSON.stringify(updatedCart.map((item) => item.id)));
  };

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    if (!isLogged) {
      // Salvar intenção de voltar ao carrinho após login
      router.push('/auth/login?callbackUrl=/aluno/carrinho');
      return;
    }

    // Fluxo de WhatsApp
    const message = `Olá! Gostaria de adquirir os seguintes cursos:\n\n${cartItems
      .map((item) => `- ${item.title} (R$ ${item.price.toFixed(2)})`)
      .join('\n')}\n\nTotal: R$ ${total.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#85E8EA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header simples */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#85E8EA] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-gray-900 uppercase">Logo Aqui</span>
          </Link>
          <div className="flex items-center gap-4">
             {isLogged ? (
               <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Meu Painel</Link>
             ) : (
               <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Entrar</Link>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[#85E8EA]" />
          Meu Carrinho
        </h1>

        {cartItems.length === 0 ? (
          <CustomCard className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-8">Explore nossos cursos e encontre o ideal para você!</p>
            <CustomButton asChild className="bg-gray-900 text-white hover:bg-gray-800">
              <Link href="/student/courses">Ver Cursos</Link>
            </CustomButton>
          </CustomCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CustomCard key={item.id} className="p-4 flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Instrutor: {item.instructor}</p>
                    <p className="font-bold text-[#85E8EA]">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </CustomCard>
              ))}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <CustomCard className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <CustomButton
                  onClick={handleCheckout}
                  className="w-full h-14 bg-[#85E8EA] text-gray-900 hover:bg-[#6BC5E8] font-bold text-lg rounded-xl shadow-lg"
                >
                  {isLogged ? (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-6 h-6" />
                      Finalizar no WhatsApp
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Entrar para Finalizar
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </CustomButton>

                {!isLogged && (
                  <p className="text-xs text-center text-gray-500 mt-4">
                    Você será redirecionado para fazer login ou criar uma conta antes de finalizar o pedido.
                  </p>
                )}
              </CustomCard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CarrinhoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#85E8EA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CarrinhoContent />
    </Suspense>
  );
}
