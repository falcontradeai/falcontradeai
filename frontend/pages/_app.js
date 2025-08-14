import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <ThemeToggle />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
