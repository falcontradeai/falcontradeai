import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function withAuth(Component, requiredRole) {
  return function Protected(props) {
    const { token, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!token) {
        router.replace('/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        router.replace('/');
      }
    }, [token, user, router]);

    if (!token || (requiredRole && user?.role !== requiredRole)) {
      return null;
    }

    return <Component {...props} />;
  };
}
