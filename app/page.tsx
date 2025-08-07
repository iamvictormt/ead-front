import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();

  if (session) {
    // Redirect based on user role
    if (session.user?.role === 'admin') {
      redirect('/admin');
    } else {
      redirect('/dashboard');
    }
  } else {
    redirect('/auth/login');
  }
}
