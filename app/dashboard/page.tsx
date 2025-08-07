import { getSession } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // Buscar sessão no servidor
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Passar dados do usuário para o componente cliente
  return <DashboardClient user={session.user} />;
}
