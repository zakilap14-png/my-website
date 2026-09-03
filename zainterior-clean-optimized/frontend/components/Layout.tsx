import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewModule } from '../types';
import { useAppContext } from '../App';
import { 
  LayoutDashboard, Package, Image as ImageIcon, Briefcase, 
  Calendar, MessageSquare, FileCheck, PenTool, CreditCard, 
  HelpCircle, User, Settings, Menu, X, Maximize, Minimize,
  DollarSign, Ticket, LogOut, ArrowLeft, ChevronDown, Users,
  CheckSquare, Archive, Headphones, Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewModule;
  setCurrentView: (view: ViewModule) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { t, lang, role, setRole, globalState, setGlobalState } = useAppContext();
  const isRTL = lang === 'ar';

  const clientNavItems = [
    { id: ViewModule.DASHBOARD, label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.PACKAGES, label: t('nav.packages'), icon: Package },
    { id: ViewModule.VISION_BUILDER, label: t('nav.vision'), icon: ImageIcon },
    { id: ViewModule.PORTFOLIO_VR, label: t('nav.portfolio'), icon: Briefcase },
    { id: ViewModule.BOOKING, label: t('nav.booking'), icon: Calendar },
    { id: ViewModule.CHAT, label: t('nav.chat'), icon: MessageSquare },
    { id: ViewModule.APPROVALS, label: t('nav.approvals'), icon: FileCheck },
    { id: ViewModule.CONTRACTS, label: t('nav.contracts'), icon: PenTool },
    { id: ViewModule.INVOICE, label: t('nav.invoice'), icon: CreditCard },
    { id: ViewModule.SUPPORT, label: t('nav.support'), icon: HelpCircle },
  ];

  const adminNavItems = [
    { id: ViewModule.ADMIN_DIRECTORY, label: t('admin.nav.directory'), icon: Users },
    { id: ViewModule.ADMIN_ARCHIVE, label: t('admin.nav.archive'), icon: Archive },
    { id: ViewModule.ADMIN_CALENDAR, label: t('admin.nav.calendar'), icon: Calendar },
    { id: ViewModule.ADMIN_DASHBOARD, label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.ADMIN_TASKS, label: t('admin.nav.tasks'), icon: CheckSquare },
    { id: ViewModule.ADMIN_APPROVALS, label: t('admin.nav.approvals'), icon: FileCheck },
    { id: ViewModule.ADMIN_FINANCE, label: t('admin.nav.finance'), icon: DollarSign },
    { id: ViewModule.ADMIN_CONTRACTS, label: t('admin.nav.contracts'), icon: PenTool },
    { id: ViewModule.ADMIN_CHAT, label: t('admin.nav.chat'), icon: MessageSquare },
    { id: ViewModule.ADMIN_BOOKINGS, label: t('admin.nav.bookings'), icon: Calendar },
  ];

  const supportNavItems = [
    { id: ViewModule.SUPPORT_DASHBOARD, label: t('support.nav.dashboard'), icon: LayoutDashboard },
    { id: ViewModule.SUPPORT_TICKETS, label: t('support.nav.tickets'), icon: Ticket },
    { id: ViewModule.SUPPORT_FINANCE, label: t('support.nav.finance'), icon: DollarSign },
    { id: ViewModule.SUPPORT_CHAT, label: t('support.nav.chat'), icon: MessageSquare },
  ];

  const navItems = role === 'ARCHITECT' ? adminNavItems : role === 'SUPPORT' ? supportNavItems : clientNavItems;
  const settingsView = role === 'ARCHITECT' || role === 'SUPPORT' ? ViewModule.ADMIN_PROFILE : ViewModule.PROFILE;

  const activeClient = globalState.clients[globalState.activeClientId];
  
  // Determine if we are in a specific client's workspace (Architect Role)
  const isClientWorkspace = role === 'ARCHITECT' && currentView !== ViewModule.ADMIN_DIRECTORY && currentView !== ViewModule.ADMIN_ARCHIVE && currentView !== ViewModule.ADMIN_CALENDAR && currentView !== ViewModule.ADMIN_PROFILE;

  // Calculate total notifications for Architect
  const totalNotifications = Object.values(globalState.clients).reduce((acc, client) => {
    let count = 0;
    if (client.hasUnreadMessages) count++;
    if (client.hasPendingApprovals) count++;
    if (client.hasNewTickets) count++;
    return acc + count;
  }, 0);

  const SidebarContent = ({ isExpanded }: { isExpanded: boolean }) => (
    <>
      <div className={`p-6 flex flex-col items-center border-b relative h-28 justify-center shrink-0 transition-colors duration-500 ${isClientWorkspace ? 'border-gold-500/30 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}`}>
        <div className="flex flex-col items-center justify-center w-full h-full relative">
          <h1 className={`font-serif font-bold tracking-widest bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-200 dark:via-gold-400 dark:to-gold-600 text-transparent bg-clip-text transition-all duration-300 absolute ${isExpanded ? 'text-2xl opacity-100 top-4' : 'text-4xl opacity-100 top-6'}`}>
            {isExpanded ? t('app.title') : 'Z'}
          </h1>
          <p className={`text-xs font-bold tracking-widest uppercase transition-all duration-300 absolute bottom-4 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isClientWorkspace ? 'text-gold-600 dark:text-gold-400' : 'text-luxury-500'}`}>
            {role === 'ARCHITECT' ? (isClientWorkspace ? 'Workspace' : 'Admin') : role === 'SUPPORT' ? 'Support' : t('app.subtitle')}
          </p>
        </div>
        <button 
          className="md:hidden absolute top-6 right-6 text-luxury-500 hover:text-luxury-900 dark:text-luxury-400 dark:hover:text-luxury-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>
      
      <nav className={`flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar ${isClientWorkspace ? 'bg-gold-500/5' : ''}`}>
        {/* Back to Directory Button (Only in Client Workspace) */}
        {isClientWorkspace && (
          <motion.button
            whileHover={{ x: isRTL ? -5 : 5, backgroundColor: 'rgba(197,156,106,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentView(ViewModule.ADMIN_DIRECTORY);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent mb-4`}
            title={!isExpanded ? t('admin.directory.backToClients') : undefined}
          >
            <ArrowLeft size={24} className={`shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isRTL ? 'mr-4' : 'ml-4'} ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {t('admin.directory.backToClients')}
            </span>
          </motion.button>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          // Hide workspace items if in directory view
          if (role === 'ARCHITECT' && !isClientWorkspace && item.id !== ViewModule.ADMIN_DIRECTORY && item.id !== ViewModule.ADMIN_ARCHIVE && item.id !== ViewModule.ADMIN_CALENDAR) {
            return null;
          }
          
          // Hide directory items if in workspace view
          if (role === 'ARCHITECT' && isClientWorkspace && (item.id === ViewModule.ADMIN_DIRECTORY || item.id === ViewModule.ADMIN_ARCHIVE || item.id === ViewModule.ADMIN_CALENDAR)) {
            return null;
          }

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: isRTL ? -5 : 5, backgroundColor: isActive ? '' : (isClientWorkspace ? 'rgba(197,156,106,0.1)' : 'rgba(197,156,106,0.05)') }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? (isClientWorkspace 
                      ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-md' 
                      : 'bg-gradient-to-r from-gold-700/10 dark:from-gold-500/10 to-transparent border-l-4 border-gold-700 dark:border-gold-500 text-gold-700 dark:text-gold-400 shadow-sm')
                  : (isClientWorkspace
                      ? 'text-luxury-700 dark:text-luxury-300 hover:text-gold-700 dark:hover:text-gold-400 border-l-4 border-transparent'
                      : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-100 border-l-4 border-transparent')
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              <motion.div
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Icon size={24} className={`shrink-0 ${isActive ? (isClientWorkspace ? 'text-white' : 'text-gold-700 dark:text-gold-400') : ''}`} />
              </motion.div>
              <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isRTL ? 'mr-4' : 'ml-4'} ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div className={`p-4 border-t shrink-0 space-y-2 transition-colors duration-500 ${isClientWorkspace ? 'border-gold-500/30 bg-gold-500/5' : 'border-luxury-200 dark:border-luxury-800'}`}>
        <motion.button 
          whileHover={{ x: isRTL ? -5 : 5, backgroundColor: 'rgba(197,156,106,0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setCurrentView(settingsView);
            setIsMobileMenuOpen(false);
          }} 
          className={`flex items-center px-4 gap-4 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors w-full py-3.5 rounded-xl ${currentView === settingsView ? 'bg-luxury-100 dark:bg-luxury-800 text-luxury-900 dark:text-luxury-50' : ''}`}
          title={!isExpanded ? t('nav.profile') : undefined}
        >
          <Settings size={24} className="shrink-0" />
          <span className={`font-bold text-base whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            {t('nav.profile')}
          </span>
        </motion.button>
      </div>
    </>
  );

  return (
    <div className={`flex h-screen w-full bg-luxury-50 dark:bg-luxury-950 transition-colors duration-500`}>
      <AnimatePresence initial={false}>
        {!isPresentationMode && (
          <motion.aside 
            initial={{ width: 88 }}
            animate={{ width: isSidebarHovered ? 280 : 88 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            onMouseEnter={() => setIsSidebarHovered(true)}
            onMouseLeave={() => setIsSidebarHovered(false)}
            className={`hidden md:flex flex-col bg-white dark:bg-luxury-900 border-${isRTL ? 'l' : 'r'} z-20 overflow-hidden whitespace-nowrap transition-colors duration-500 shrink-0 shadow-2xl ${isClientWorkspace ? 'border-gold-500/30' : 'border-luxury-200 dark:border-luxury-800'}`}
          >
            <SidebarContent isExpanded={isSidebarHovered} />
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} bottom-0 w-72 bg-white dark:bg-luxury-900 border-${isRTL ? 'l' : 'r'} z-50 flex flex-col md:hidden shadow-2xl ${isClientWorkspace ? 'border-gold-500/30' : 'border-luxury-200 dark:border-luxury-800'}`}
            >
              <SidebarContent isExpanded={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`h-20 backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 z-10 transition-colors duration-500 ${isClientWorkspace ? 'bg-gold-500/5 border-gold-500/20' : 'bg-white/80 dark:bg-luxury-950/80 border-luxury-200 dark:border-luxury-800'}`}>
          <div className="flex items-center gap-4">
            <button className="md:hidden text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            
            {isClientWorkspace ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                    className="flex items-center gap-2 font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 hover:text-gold-700 dark:hover:text-gold-500 transition-colors"
                  >
                    {activeClient.profile.name}
                    <ChevronDown size={16} className={`transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isClientDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsClientDropdownOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 w-64 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                        >
                          {Object.values(globalState.clients).filter(c => c.profile.status === 'Active').map(client => (
                            <motion.button
                              whileHover={{ backgroundColor: 'rgba(197,156,106,0.1)' }}
                              key={client.profile.id}
                              onClick={() => {
                                setGlobalState(prev => ({ ...prev, activeClientId: client.profile.id }));
                                setIsClientDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${client.profile.id === globalState.activeClientId ? 'bg-luxury-50 dark:bg-luxury-800' : ''}`}
                            >
                              <img src={client.profile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-bold text-sm text-luxury-900 dark:text-luxury-50">{client.profile.name}</p>
                                <p className="text-xs font-medium text-luxury-500 truncate">{client.profile.project}</p>
                              </div>
                            </motion.button>
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={currentView}
                className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 hidden md:block"
              >
                {navItems.find(i => i.id === currentView)?.label || t('nav.profile')}
              </motion.h2>
            )}
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            {/* Notifications Button (Architect Only) */}
            {role === 'ARCHITECT' && (
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-luxury-100 dark:bg-luxury-900 border border-luxury-300 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-700 dark:hover:border-gold-500 transition-colors"
                >
                  <Bell size={18} />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                      {totalNotifications}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-luxury-50 dark:bg-luxury-950/50">
                          <h3 className="font-bold text-luxury-900 dark:text-luxury-50">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto no-scrollbar">
                          {totalNotifications === 0 ? (
                            <div className="p-6 text-center text-luxury-500 font-medium text-sm">No new notifications.</div>
                          ) : (
                            Object.values(globalState.clients).map(client => {
                              if (!client.hasUnreadMessages && !client.hasPendingApprovals && !client.hasNewTickets) return null;
                              return (
                                <div key={client.profile.id} className="p-4 border-b border-luxury-100 dark:border-luxury-800/50 hover:bg-luxury-50 dark:hover:bg-luxury-800 transition-colors cursor-pointer" onClick={() => {
                                  setGlobalState(prev => ({ ...prev, activeClientId: client.profile.id }));
                                  setCurrentView(ViewModule.ADMIN_DASHBOARD);
                                  setIsNotificationsOpen(false);
                                }}>
                                  <div className="flex items-center gap-3 mb-2">
                                    <img src={client.profile.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    <p className="font-bold text-sm text-luxury-900 dark:text-luxury-50">{client.profile.name}</p>
                                  </div>
                                  <div className="flex flex-wrap gap-2 pl-11">
                                    {client.hasUnreadMessages && <span className="text-[10px] font-bold px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">New Message</span>}
                                    {client.hasPendingApprovals && <span className="text-[10px] font-bold px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md">Pending Approval</span>}
                                    {client.hasNewTickets && <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">New Ticket</span>}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Role Switcher (Architect <-> Support) */}
            {(role === 'ARCHITECT' || role === 'SUPPORT') && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (role === 'ARCHITECT') {
                    setRole('SUPPORT');
                    setCurrentView(ViewModule.SUPPORT_DASHBOARD);
                  } else {
                    setRole('ARCHITECT');
                    setCurrentView(ViewModule.ADMIN_DIRECTORY);
                  }
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-100 dark:bg-luxury-900 border border-luxury-300 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-700 dark:hover:border-gold-500 transition-all font-bold text-sm"
              >
                {role === 'ARCHITECT' ? <><Headphones size={16} /> {t('support.switch.support')}</> : <><PenTool size={16} /> {t('support.switch.architect')}</>}
              </motion.button>
            )}

            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-luxury-100 dark:bg-luxury-900 border border-luxury-300 dark:border-luxury-700 text-luxury-600 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 hover:border-gold-700 dark:hover:border-gold-500 transition-colors"
            >
              {isPresentationMode ? <Minimize size={18} /> : <Maximize size={18} />}
            </motion.button>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setCurrentView(settingsView)}
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-luxury-900 dark:text-luxury-50 group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">
                  {role === 'ARCHITECT' || role === 'SUPPORT' ? globalState.architectProfile.name : activeClient.profile.name}
                </span>
                <span className="text-xs font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-500 text-transparent bg-clip-text">
                  {role === 'ARCHITECT' ? globalState.architectProfile.title : role === 'SUPPORT' ? 'Support Team' : activeClient.profile.tier}
                </span>
              </div>
              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={role === 'ARCHITECT' || role === 'SUPPORT' ? globalState.architectProfile.avatar : activeClient.profile.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-gold-700 dark:border-gold-500 object-cover shadow-[0_0_10px_rgba(166,136,104,0.3)]" 
              />
            </motion.div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar relative">
          {children}
        </div>
      </main>
    </div>
  );
};
