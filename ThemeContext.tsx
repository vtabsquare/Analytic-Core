import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Load theme from localStorage, default to dark
        const savedTheme = localStorage.getItem('insightAI_theme');
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    });

    useEffect(() => {
        // Save theme to localStorage whenever it changes
        localStorage.setItem('insightAI_theme', theme);

        // Apply theme class to document root
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
            document.body.className = 'bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white';
        } else {
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
            document.body.className = 'bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white';
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
