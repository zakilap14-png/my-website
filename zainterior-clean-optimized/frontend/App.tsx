import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewModule, Role, GlobalState } from './types';
import { INITIAL_STATE } from './constants';
import { Layout } from './components/Layout';
import { ZainAI } from './components/ZainAI';
import { OnboardingWizard } from './components/Onboarding';
import { dict } from './i18n';

// Import Pages
import { LandingPage } from './pages/Landing';
import { Dashboard, Profile } from './pages/Overview';
import { Packages, VisionBuilder, PortfolioVR } from './pages/Design';
import { Approvals, Contracts, Invoice } from './pages/Execution';
import { Chat, Booking, Support } from './pages/Communication';
import { AdminDirectory, AdminArchive, AdminDashboard, AdminApprovals, AdminFinance, AdminContracts, AdminChat, AdminBookings, AdminProfile, AdminTasks, AdminCalendar } from './pages/Admin';
import { SupportDashboard, SupportTickets, SupportFinance } from './pages/Support';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  role: Role;
  setRole: (r: Role) => void;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const AppContext = createContext<AppContextType>({
  theme: 'dark', setTheme: () => {},
  lang: 'en', setLang: () => {},
  t: (k) => k,
  role: 'GUEST', setRole: () => {},
  globalState: INITIAL_STATE, setGlobalState: () => {}
});

export const useAppContext = () => useContext(AppContext);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewModule>(ViewModule.DASHBOARD);
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Language>('en');
  const [role, setRole] = useState<Role>('GUEST');
  const [globalState, setGlobalState] = useState<GlobalState>(INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string) => dict[lang]?.[key] || key;

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === 'CLIENT') {
      setShowOnboarding(true);
      setCurrentView(ViewModule.DASHBOARD);
    } else if (selectedRole === 'ARCHITECT') {
      setCurrentView(ViewModule.ADMIN_DIRECTORY);
    } else if (selectedRole === 'SUPPORT') {
      setCurrentView(ViewModule.SUPPORT_DASHBOARD);
    }
  };

  const renderView = () => {
    if (role === 'ARCHITECT') {
      switch (currentView) {
        case ViewModule.ADMIN_DIRECTORY: return <AdminDirectory setView={setCurrentView} />;
        case ViewModule.ADMIN_ARCHIVE: return <AdminArchive setView={setCurrentView} />;
        case ViewModule.ADMIN_CALENDAR: return <AdminCalendar />;
        case ViewModule.ADMIN_DASHBOARD: return <AdminDashboard setView={setCurrentView} />;
        case ViewModule.ADMIN_APPROVALS: return <AdminApprovals />;
        case ViewModule.ADMIN_FINANCE: return <AdminFinance />;
        case ViewModule.ADMIN_CONTRACTS: return <AdminContracts />;
        case ViewModule.ADMIN_CHAT: return <AdminChat />;
        case ViewModule.ADMIN_BOOKINGS: return <AdminBookings />;
        case ViewModule.ADMIN_PROFILE: return <AdminProfile />;
        case ViewModule.ADMIN_TASKS: return <AdminTasks />;
        default: return <AdminDirectory setView={setCurrentView} />;
      }
    }

    if (role === 'SUPPORT') {
      switch (currentView) {
        case ViewModule.SUPPORT_DASHBOARD: return <SupportDashboard />;
        case ViewModule.SUPPORT_TICKETS: return <SupportTickets />;
        case ViewModule.SUPPORT_FINANCE: return <SupportFinance />;
        case ViewModule.SUPPORT_CHAT: return <AdminDirectory setView={setCurrentView} />; // Support uses directory to select client for chat
        case ViewModule.ADMIN_CHAT: return <AdminChat />; // Reuse AdminChat for support
        case ViewModule.ADMIN_PROFILE: return <AdminProfile />;
        default: return <SupportDashboard />;
      }
    }

    switch (currentView) {
      case ViewModule.DASHBOARD: return <Dashboard setView={setCurrentView} />;
      case ViewModule.PACKAGES: return <Packages />;
      case ViewModule.VISION_BUILDER: return <VisionBuilder />;
      case ViewModule.PORTFOLIO_VR: return <PortfolioVR />;
      case ViewModule.BOOKING: return <Booking />;
      case ViewModule.CHAT: return <Chat />;
      case ViewModule.APPROVALS: return <Approvals />;
      case ViewModule.CONTRACTS: return <Contracts />;
      case ViewModule.INVOICE: return <Invoice />;
      case ViewModule.SUPPORT: return <Support />;
      case ViewModule.PROFILE: return <Profile />;
      default: return <Dashboard setView={setCurrentView} />;
    }
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang, t, role, setRole, globalState, setGlobalState }}>
      {role === 'GUEST' ? (
        <LandingPage onSelectRole={handleRoleSelect} />
      ) : (
        <div className="h-screen w-full overflow-hidden">
          <AnimatePresence>
            {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}
          </AnimatePresence>

          {!showOnboarding && (
            <Layout currentView={currentView} setCurrentView={setCurrentView}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full"
                >
                  {renderView()}
                </motion.div>
              </AnimatePresence>
              {role === 'CLIENT' && <ZainAI />}
            </Layout>
          )}
        </div>
      )}
    </AppContext.Provider>
  );
};

export default App;
