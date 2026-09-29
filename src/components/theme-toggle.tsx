'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'theme-preference';

type Theme = 'light' | 'dark';

export function ThemeToggle({
  lightLabel,
  darkLabel,
}: {
  lightLabel: string;
  darkLabel: string;
}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const activeTheme = storedTheme ?? systemTheme;

    setTheme(activeTheme);
    document.documentElement.classList.toggle('dark', activeTheme === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <Button
        variant="secondary"
        size="icon"
        aria-hidden
        tabIndex={-1}
        className="h-8 w-8 rounded-md print:hidden"
      />
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label={theme === 'dark' ? lightLabel : darkLabel}
      onClick={toggleTheme}
      className="h-8 w-8 rounded-md print:hidden"
    >
      {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </Button>
  );
}
