'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getClientSession } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const session = getClientSession();

    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role.toUpperCase())) {
      if (session.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    setIsAuthorized(true);
  }, [router, pathname, allowedRoles]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
