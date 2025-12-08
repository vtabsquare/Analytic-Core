import React, { useState, useRef } from 'react';
import { Upload, FileText, Clock, LayoutDashboard, Sparkles, ChevronRight, FileSpreadsheet, Trash2, FolderOpen, PlusCircle, Settings, LogOut } from 'lucide-react';
import { SavedDashboard, User } from '../types';
import { useTheme } from '../ThemeContext';
import { getThemeClasses } from '../theme';
import { ThemeToggle } from './ThemeToggle';

interface LandingProps {
  onFileUpload: (file: File) => void;
  savedDashboards: SavedDashboard[];
  onLoadDashboard: (dashboard: SavedDashboard) => void;
  onDeleteDashboard: (id: string) => void;
  onLogout: () => void;
  user: User | null;
}

export const Landing: React.FC<LandingProps> = ({ onFileUpload, savedDashboards, onLoadDashboard, onDeleteDashboard, onLogout, user }) => {
  const { theme } = useTheme();
  const colors = getThemeClasses(theme);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'NEW' | 'SAVED'>('NEW');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (validTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      onFileUpload(file);
    } else {
      alert("Please upload a valid CSV or Excel file.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 left-0 w-full h-full ${colors.gradientTop} blur-[120px] opacity-30`}></div>
        <div className={`absolute bottom-0 right-0 w-full h-full ${colors.gradientBottom} blur-[120px] opacity-30`}></div>
      </div>

      {/* Header - Responsive */}
      <header className="px-4 sm:px-6 md:px-8 py-4 md:py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className={`text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-slate-400' : 'from-slate-900 to-slate-600'}`}>
            AnalyticCore
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {user && (
            <div className={`md:block text-sm font-medium ${colors.textSecondary}`}>
              Welcome, <span className="text-indigo-400">{user.name}</span>
            </div>
          )}
          <ThemeToggle />
          <button
            onClick={onLogout}
            className={`p-1.5 sm:p-2 rounded-lg hover:${colors.bgTertiary} ${colors.textMuted} hover:text-red-400 transition`}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      <main className="responsive-container flex-1 flex flex-col">
        {/* Tabs - Responsive */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <div className={`${colors.bgSecondary} p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border ${colors.borderPrimary} inline-flex w-full sm:w-auto`}>
            <button
              onClick={() => setActiveTab('NEW')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2
                  ${activeTab === 'NEW' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : `${colors.textMuted} hover:${colors.textPrimary}`}
                `}
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">New Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('SAVED')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2
                  ${activeTab === 'SAVED' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : `${colors.textMuted} hover:${colors.textPrimary}`}
                `}
            >
              <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">My Dashboards</span>
            </button>
          </div>
        </div>

        {activeTab === 'NEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center animate-fade-in">
            {/* Left: Upload Section */}
            <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Powered by Gemini 2.0 Flash</span>
                </div>
                <h2 className={`hero-title font-extrabold ${colors.textPrimary} leading-tight mb-4 sm:mb-6`}>
                  Data to Dashboard <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                    in seconds.
                  </span>
                </h2>
                <p className={`responsive-text-base ${colors.textMuted} max-w-lg leading-relaxed`}>
                  Upload your raw CSV or Excel data. Our AI analyzes relationships, suggests KPIs, and builds professional dashboards automatically.
                </p>
              </div>

              <div
                className={`upload-area relative group border-2 border-dashed rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer
                  ${isDragging
                    ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]'
                    : `${colors.borderSecondary} ${theme === 'dark' ? 'bg-slate-900/50 hover:bg-slate-800/80' : 'bg-white/50 hover:bg-slate-100/80'} hover:border-indigo-500/50`
                  }
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                />

                <div className={`${colors.bgTertiary} p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-xl transition-transform duration-300 ${isDragging ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'}`}>
                  {isDragging ? (
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
                  ) : (
                    <FileSpreadsheet className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.textTertiary}`} />
                  )}
                </div>

                <h3 className={`responsive-text-lg font-semibold ${colors.textPrimary} mb-2`}>Upload Dataset</h3>
                <p className={`${colors.textMuted} responsive-text-sm`}>CSV or Excel files up to 10MB</p>

                {/* Decorative glow */}
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl" />
              </div>
            </div>

            {/* Right: Illustration / Steps - Hidden on small mobile */}
            <div className="relative md:block">
              {/* Glass card effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-3xl blur-xl" />

              <div className={`responsive-card relative ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl rounded-2xl sm:rounded-3xl border ${colors.borderPrimary} shadow-2xl`}>
                <h3 className={`responsive-text-lg font-semibold ${colors.textPrimary} mb-6 sm:mb-8`}>How it works</h3>
                <div className="space-y-6 sm:space-y-8 relative">
                  <div className={`absolute left-6 top-4 bottom-4 w-0.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                  {[
                    { title: "Upload Data", desc: "Supports multiple CSV & Excel files", icon: FileSpreadsheet },
                    { title: "Configure & Join", desc: "Merge tables and select key columns", icon: Settings },
                    { title: "AI Analysis", desc: "Gemini suggests relevant charts", icon: Sparkles },
                    { title: "Interact & Export", desc: "Filter, zoom, and save as PDF", icon: LayoutDashboard }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                      <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${colors.bgTertiary} border ${colors.borderSecondary} flex items-center justify-center group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors`}>
                        <step.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.textMuted} group-hover:text-indigo-400`} />
                      </div>
                      <div>
                        <h4 className={`${colors.textPrimary} font-medium responsive-text-base sm:text-lg group-hover:text-indigo-300 transition`}>{step.title}</h4>
                        <p className={`${colors.textMuted} responsive-text-sm`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SAVED' && (
          <div className="animate-fade-in">
            {savedDashboards.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 border-2 border-dashed ${colors.borderPrimary} rounded-2xl sm:rounded-3xl ${theme === 'dark' ? 'bg-slate-900/30' : 'bg-slate-100/30'}`}>
                <FolderOpen className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'} mb-3 sm:mb-4`} />
                <h3 className={`responsive-text-lg md:text-xl font-bold ${colors.textPrimary}`}>No Saved Dashboards</h3>
                <p className={`${colors.textMuted} responsive-text-sm mt-2 mb-4 sm:mb-6 text-center px-4`}>You haven't saved any projects yet.</p>
                <button
                  onClick={() => setActiveTab('NEW')}
                  className="responsive-button bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
                >
                  Start New Analysis
                </button>
              </div>
            ) : (
              <div className="saved-dashboards-grid">
                {savedDashboards.map((dash, idx) => (
                  <div
                    key={dash.id}
                    className={`responsive-card group ${colors.bgSecondary} border ${colors.borderPrimary} rounded-xl sm:rounded-2xl hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/20 transition-all cursor-pointer relative`}
                    onClick={() => onLoadDashboard(dash)}
                  >
                    <button
                      onClick={(e) => {
                        console.log('Delete button clicked!', dash.id);
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('About to call onDeleteDashboard');
                        onDeleteDashboard(dash.id);
                        console.log('onDeleteDashboard called');
                      }}
                      className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'} hover:text-red-400 hover:bg-red-400/10 rounded-lg transition pointer-events-auto`}
                      title="Delete dashboard"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>

                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className="p-2 sm:p-3 bg-indigo-500/10 rounded-lg sm:rounded-xl">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                      </div>
                    </div>

                    <h3 className={`responsive-text-base sm:text-lg font-bold ${colors.textPrimary} mb-1 group-hover:text-indigo-400 transition`}>{dash.name}</h3>
                    <div className={`flex items-center gap-1.5 sm:gap-2 ${colors.textMuted} responsive-text-xs sm:text-sm mb-4 sm:mb-6`}>
                      <Clock className="w-3 h-3" />
                      <span>{dash.date}</span>
                    </div>

                    <div className={`flex items-center justify-between pt-3 sm:pt-4 border-t ${colors.borderPrimary}`}>
                      <span className={`responsive-text-xs font-medium ${colors.textMuted} ${colors.bgPrimary} px-2 py-1 rounded`}>
                        {dash.chartConfigs.length} Charts
                      </span>
                      <div className="flex items-center gap-1 text-indigo-400 responsive-text-xs sm:text-sm font-medium">
                        Open <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div >
  );
};