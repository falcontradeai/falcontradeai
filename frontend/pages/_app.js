import '../styles/globals.css';
import { useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import PublicNav from '../components/PublicNav';
import Layout from '../components/Layout';
import AppShell from '../components/AppShell';
import { useRouter } from 'next/router';

function AppContent({ Component, pageProps }) {
  const { user } = useAuth();
  const router = useRouter();
  const isAppRoute = router.pathname.startsWith('/app');

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (typeof window !== 'undefined') {
          alert(
            error.response?.data?.error || 'An unexpected error occurred'
          );
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (isAppRoute) {
    return (
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <ThemeToggle />
      <Layout header={!user && <PublicNav />}>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}
