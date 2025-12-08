import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getThemeClasses } from '../theme';

interface ThemeToggleProps {
    className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const colors = getThemeClasses(theme);

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all duration-300 ${colors.textMuted} hover:${colors.textPrimary} hover:${colors.bgTertiary} ${className}`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
            )}
        </button>
    );
};
