import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { getThemeClasses } from '../theme';

interface SettingsButtonProps {
    className?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();
    const colors = getThemeClasses(theme);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`p-2 ${colors.textMuted} hover:${colors.textPrimary} transition hover:rotate-90 duration-300 ${className}`}
                title="Settings"
            >
                <SettingsIcon className="w-6 h-6" />
            </button>

            {isOpen && createPortal(
                <div className={`fixed inset-0 z-[9999] ${colors.overlayBg} backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in`} onClick={() => setIsOpen(false)}>
                    <div
                        className={`${colors.bgSecondary} border ${colors.borderPrimary} rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in-up`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-xl font-bold ${colors.textPrimary}`}>Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`p-2 hover:${colors.bgTertiary} rounded-lg transition ${colors.textMuted} hover:${colors.textPrimary}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <div className={`border-t ${colors.borderPrimary} pt-6`}>
                            <h3 className={`text-sm font-bold ${colors.textMuted} uppercase tracking-wider mb-4`}>Appearance</h3>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`font-medium ${colors.textSecondary}`}>Theme</p>
                                    <p className={`text-sm ${colors.textMuted} mt-0.5`}>Choose your preferred theme</p>
                                </div>

                                <button
                                    onClick={toggleTheme}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${colors.borderPrimary} ${colors.bgTertiary} hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'} transition-all group`}
                                >
                                    {theme === 'dark' ? (
                                        <>
                                            <Moon className="w-5 h-5 text-indigo-400" />
                                            <span className={`font-medium ${colors.textSecondary}`}>Dark</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sun className="w-5 h-5 text-amber-500" />
                                            <span className={`font-medium ${colors.textSecondary}`}>Light</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-100'} border ${theme === 'dark' ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
                                <p className={`text-xs ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                    💡 Your theme preference is automatically saved and will persist across sessions.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`mt-6 pt-6 border-t ${colors.borderPrimary} text-center`}>
                            <p className={`text-xs ${colors.textMuted}`}>
                                InsightAI Reporter • Version 1.0
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
