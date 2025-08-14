import '../styles/globals.css';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import PublicNav from '../components/PublicNav';

function AppContent({ Component, pageProps }) {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <ThemeToggle />
      {!user && <PublicNav />}
      <Component {...pageProps} />
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
