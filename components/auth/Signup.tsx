import React, { useState } from 'react';
import { authService } from '../../services/authService';
import { useTheme } from '../../ThemeContext';
import { getThemeClasses } from '../../theme';
import { UserPlus, Mail, Lock, User, AlertCircle, X } from 'lucide-react';

interface SignupProps {
    onSignupSuccess: () => void;
    onNavigateToLogin: () => void;
    onBack: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onNavigateToLogin, onBack }) => {
    const { theme } = useTheme();
    const colors = getThemeClasses(theme);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.signup(name, email, password);
            onSignupSuccess();
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${colors.bgPrimary} p-4 relative overflow-hidden`}>
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 left-0 w-full h-full ${colors.gradientTop} blur-[120px] opacity-50`}></div>
                <div className={`absolute bottom-0 right-0 w-full h-full ${colors.gradientBottom} blur-[120px] opacity-50`}></div>
            </div>

            <div className={`max-w-md w-full ${colors.bgSecondary} rounded-2xl border ${colors.borderPrimary} p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl mx-4`}>
                <button
                    onClick={onBack}
                    className={`absolute top-4 right-4 p-2 rounded-full hover:${colors.bgTertiary} ${colors.textMuted} hover:${colors.textPrimary} transition-colors`}
                    title="Go back"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className={`text-3xl font-bold ${colors.textPrimary}`}>Create Account</h2>
                    <p className={`${colors.textMuted} mt-2`}>Join InsightAI today</p>
                </div>

                {error && (
                    <div className={`mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 animate-fade-in`}>
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-xs font-bold ${colors.textMuted} uppercase mb-2 ml-1`}>Full Name</label>
                        <div className={`relative ${colors.bgPrimary} rounded-xl border ${colors.borderSecondary} focus-within:ring-2 focus-within:ring-indigo-500 transition-all group`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full bg-transparent border-none py-3.5 pl-12 pr-4 ${colors.textPrimary} placeholder-slate-400 focus:ring-0 outline-none`}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold ${colors.textMuted} uppercase mb-2 ml-1`}>Email Address</label>
                        <div className={`relative ${colors.bgPrimary} rounded-xl border ${colors.borderSecondary} focus-within:ring-2 focus-within:ring-indigo-500 transition-all group`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full bg-transparent border-none py-3.5 pl-12 pr-4 ${colors.textPrimary} placeholder-slate-400 focus:ring-0 outline-none`}
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold ${colors.textMuted} uppercase mb-2 ml-1`}>Password</label>
                        <div className={`relative ${colors.bgPrimary} rounded-xl border ${colors.borderSecondary} focus-within:ring-2 focus-within:ring-indigo-500 transition-all group`}>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full bg-transparent border-none py-3.5 pl-12 pr-4 ${colors.textPrimary} placeholder-slate-400 focus:ring-0 outline-none`}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className={`mt-8 text-center text-sm ${colors.textMuted}`}>
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline transition-colors">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

