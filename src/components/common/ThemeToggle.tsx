/**
 * @file Theme Toggle component
 * @module components/common/ThemeToggle
 * @description A button that toggles between light and dark themes.
 *   Persists the preference in localStorage under the "tt-theme" key
 *   and applies the "dark" class to the document root.
 */

// Sun/Moon icons for theme toggle
import { Moon, Sun } from 'lucide-react';

// Shadcn button component
import { Button } from '@/components/ui/button';

// React hooks
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'tt-theme';

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
};

/**
 * ThemeToggle
 * @description A toggle button that switches between light and dark themes.
 *   Reads the initial theme from localStorage (or system preference),
 *   persists changes, and applies the "dark" class to <html>.
 * @returns A button that toggles theme on click
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
