import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function withAuth(Component, requiredRole) {
  return function Protected(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const getDashboard = (role) => {
      switch (role) {
        case 'buyer':
          return '/buyer/dashboard';
        case 'seller':
          return '/seller/dashboard';
        case 'admin':
          return '/admin';
        case 'subscriber':
          return '/dashboard';
        default:
          return '/';
      }
    };

    useEffect(() => {
      if (loading) return;
      if (!user) {
        router.replace('/login');
      } else if (requiredRole && user.role !== requiredRole) {
        router.replace(getDashboard(user.role));
      } else if (
        user.role === 'subscriber' &&
        user.subscriptionStatus !== 'active'
      ) {
        router.replace('/pricing');
      }
    }, [user, loading, router, requiredRole]);

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
