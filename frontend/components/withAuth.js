import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function withAuth(Component, requiredRole) {
  return function Protected(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;
      if (!user) {
        router.replace('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        router.replace('/');
      } else if (
        user.role === 'subscriber' &&
        user.subscriptionStatus !== 'active'
      ) {
        router.replace('/pricing');
      }
    }, [user, loading, router]);

    if (
      loading ||
      !user ||
      (requiredRole && user.role !== requiredRole) ||
      (user.role === 'subscriber' && user.subscriptionStatus !== 'active')
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}
