import { useEffect, useState } from 'react';
import Button from './ui/Button';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new Event('themeChange'));
  }, [isDark]);

  return (
    <Button onClick={() => setIsDark(!isDark)} className="fixed top-4 right-4 z-50">
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
}
