import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextThemeIsDark, setNextThemeIsDark] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newThemeIsDark = !isDarkMode;
    setNextThemeIsDark(newThemeIsDark);
    setIsTransitioning(true);
    // Trigger the radial animation
    setTimeout(() => {
      setIsDarkMode(newThemeIsDark);
      // Keep transition state for animation duration
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Match animation duration
    }, 50); // Small delay to ensure state update triggers animation
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, isTransitioning }}>
      {children}
      {/* Radial animation overlay */}
      {isTransitioning && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: nextThemeIsDark
              ? 'radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 1) 100%)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 1) 100%)',
            clipPath: 'circle(0% at 50% 50%)',
            animation: 'radialExpand 0.6s ease-out forwards',
          }}
        />
      )}
      <style>{`
        @keyframes radialExpand {
          0% {
            clip-path: circle(0% at 50% 50%);
            opacity: 1;
          }
          100% {
            clip-path: circle(150% at 50% 50%);
            opacity: 1;
          }
        }
      `}</style>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

