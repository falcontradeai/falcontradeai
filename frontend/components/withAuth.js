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
      } else if (
        user?.role === 'subscriber' &&
        user.subscriptionStatus !== 'active'
      ) {
        router.replace('/pricing');
      }
    }, [token, user, router]);

    if (
      !token ||
      (requiredRole && user?.role !== requiredRole) ||
      (user?.role === 'subscriber' && user.subscriptionStatus !== 'active')
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}
