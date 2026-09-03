import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { StageStatus, ViewModule, ProjectStage } from '../types';
import { Save, CheckCircle2, Edit3, FileCheck, DollarSign, PenTool, Send, Paperclip, Calendar, Ticket, Globe, Moon, Edit2, Check, Search, Briefcase, MessageSquare, AlertCircle, Settings, Plus, Trash2, Archive, RefreshCw, LogOut, Clock, Ban, Lock, Unlock, MapPin, Video, Building } from 'lucide-react';

export const AdminDirectory: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const activeClients = Object.values(clients).filter(c => c.profile.status === 'Active');

  const clientList = activeClients.filter(client => {
    const matchesSearch = client.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || (filter === 'VIP' && client.profile.tier.includes('VIP')) || (filter === 'Pending' && (client.hasPendingApprovals || client.hasUnreadMessages || client.hasNewTickets));
    return matchesSearch && matchesFilter;
  });

  const handleOpenWorkspace = (clientId: string) => {
    setGlobalState(prev => ({ ...prev, activeClientId: clientId }));
    setView(ViewModule.ADMIN_DASHBOARD);
  };

  const totalProjects = activeClients.length;
  const totalPendingApprovals = activeClients.filter(c => c.hasPendingApprovals).length;
  const totalUnreadMessages = activeClients.filter(c => c.hasUnreadMessages).length;
  const totalNewTickets = activeClients.filter(c => c.hasNewTickets).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.directory.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.directory.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('admin.directory.totalProjects'), value: totalProjects.toString(), icon: Briefcase, color: 'text-gold-700 dark:text-gold-400' },
          { label: 'Pending Approvals', value: totalPendingApprovals.toString(), icon: FileCheck, color: 'text-red-500 dark:text-red-400' },
          { label: 'Unread Messages', value: totalUnreadMessages.toString(), icon: MessageSquare, color: 'text-blue-500 dark:text-blue-400' },
          { label: 'New Tickets', value: totalNewTickets.toString(), icon: Ticket, color: 'text-green-500 dark:text-green-400' }
        ].map((metric, idx) => (
          <Card key={idx} delay={0.1 * idx} className="flex items-center justify-between">
            <div>
              <p className="text-luxury-600 dark:text-luxury-400 font-bold text-sm mb-1">{metric.label}</p>
              <p className={`text-2xl font-serif font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
              <metric.icon size={32} className="text-luxury-300 dark:text-luxury-700" />
            </motion.div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.directory.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg pl-10 pr-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {['All', 'VIP', 'Pending'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${filter === f ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 shadow-md' : 'bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:border-gold-700 dark:hover:border-gold-500'}`}
              >
                {f === 'All' ? t('admin.directory.filterAll') : f === 'VIP' ? t('admin.directory.filterVIP') : t('admin.directory.filterPending')}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {clientList.map((client) => (
            <motion.div 
              key={client.profile.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', borderColor: 'rgba(197,156,106,0.5)' }}
              onClick={() => handleOpenWorkspace(client.profile.id)}
              className="bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-800 rounded-xl p-6 shadow-lg transition-colors duration-500 flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {/* Notification Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {client.hasUnreadMessages && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" title="New Message" />}
                {client.hasPendingApprovals && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" title="Pending Approval" />}
                {client.hasNewTickets && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" title="New Ticket" />}
              </div>

              <motion.img 
                whileHover={{ scale: 1.1, rotate: 5 }}
                src={client.profile.avatar} 
                alt={client.profile.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gold-700 dark:border-gold-500 shadow-md mb-4" 
              />
              <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 text-center leading-tight group-hover:text-gold-700 dark:group-hover:text-gold-400 transition-colors">{client.profile.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </div>
  );
};

export const AdminArchive: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');

  const archivedClients = Object.values(clients).filter(c => c.profile.status === 'Archived');

  const clientList = archivedClients.filter(client => {
    return client.profile.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleReactivate = (clientId: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [clientId]: {
          ...prev.clients[clientId],
          profile: { ...prev.clients[clientId].profile, status: 'Active' }
        }
      }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.archive.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.archive.desc')}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" size={18} />
            <input 
              type="text" 
              placeholder={t('admin.directory.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg pl-10 pr-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clientList.length === 0 ? (
            <div className="col-span-full text-center py-12 text-luxury-500 font-medium">No archived projects found.</div>
          ) : (
            clientList.map((client, idx) => (
              <motion.div 
                key={client.profile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative opacity-80 hover:opacity-100 transition-opacity"
              >
                <img src={client.profile.avatar} alt={client.profile.name} className="w-20 h-20 rounded-full object-cover border-2 border-luxury-300 dark:border-luxury-700 grayscale mb-4" />
                <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-50 text-center leading-tight mb-4">{client.profile.name}</h4>
                <Button variant="outline" onClick={() => handleReactivate(client.profile.id)} className="w-full py-2 text-xs"><RefreshCw size={16}/> {t('admin.directory.reactivateBtn')}</Button>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export const AdminCalendar: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients, blockedSlots } = globalState;
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [blockReason, setBlockReason] = useState('');
  const [blockTime, setBlockTime] = useState('ALL_DAY');

  // Gather all bookings from all clients
  const allBookings = Object.values(clients).flatMap(c => 
    c.bookings.map(b => ({ ...b, clientName: c.profile.name, clientId: c.profile.id }))
  );

  const handleBlockSlot = () => {
    if (!selectedDate || !blockReason.trim()) return;
    
    const newBlock = {
      id: `blk${Date.now()}`,
      date: selectedDate,
      time: blockTime,
      durationHours: blockTime === 'ALL_DAY' ? 24 : 2,
      reason: blockReason
    };

    setGlobalState(prev => ({
      ...prev,
      blockedSlots: [...prev.blockedSlots, newBlock]
    }));
    
    setBlockReason('');
    setBlockTime('ALL_DAY');
  };

  const handleRemoveBlock = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      blockedSlots: prev.blockedSlots.filter(b => b.id !== id)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.calendar.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.calendar.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-200">{t('booking.month')}</h3>
              <div className="flex gap-2">
                <button className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&lt;</button>
                <button className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&gt;</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs font-bold text-luxury-500">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 30}).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const blocks = blockedSlots.filter(b => b.date === day);
                const isFullyBlocked = blocks.some(b => b.time === 'ALL_DAY');
                const dayBookings = allBookings.filter(b => b.date === day);
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                      isSelected ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-600 text-white dark:text-luxury-950 font-bold shadow-[0_0_10px_rgba(166,136,104,0.5)] border-none' : 
                      isFullyBlocked ? 'bg-red-500/10 border border-red-500/20 text-red-500 opacity-70' :
                      'bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 font-medium text-luxury-700 dark:text-luxury-300 hover:bg-luxury-100 dark:hover:bg-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-600'
                    }`}
                  >
                    {day}
                    <div className="flex gap-1 mt-1">
                      {dayBookings.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                      {blocks.length > 0 && !isFullyBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedDate && (
            <Card>
              <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-4">Block Time on Nov {selectedDate}</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <select 
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  >
                    <option value="ALL_DAY">{t('admin.bookings.allDay')}</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                  <input 
                    type="text" 
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder={t('admin.bookings.reason')} 
                    className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 text-sm font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  />
                </div>
                <Button onClick={handleBlockSlot} variant="secondary" className="w-full"><Ban size={16}/> {t('admin.bookings.block')}</Button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">Schedule for Nov {selectedDate || '...'}</h3>
          
          {selectedDate && (
            <div className="space-y-4">
              {/* Show Bookings for selected date */}
              {allBookings.filter(b => b.date === selectedDate).map(booking => (
                <div key={booking.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{booking.clientName}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-gold-500/10 text-gold-600 dark:text-gold-400'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400">{booking.time} • {booking.type} ({booking.durationHours}h)</p>
                </div>
              ))}

              {/* Show Blocked Slots for selected date */}
              {blockedSlots.filter(b => b.date === selectedDate).map(slot => (
                <div key={slot.id} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-red-600 dark:text-red-400">{slot.time === 'ALL_DAY' ? 'All Day Blocked' : `Blocked: ${slot.time}`}</h4>
                    <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400">{slot.reason}</p>
                  </div>
                  <button onClick={() => handleRemoveBlock(slot.id)} className="text-red-500 hover:text-red-700 transition-colors p-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {allBookings.filter(b => b.date === selectedDate).length === 0 && blockedSlots.filter(b => b.date === selectedDate).length === 0 && (
                <p className="text-sm text-luxury-500 text-center py-4">No events scheduled for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<{ setView: (v: ViewModule) => void }> = ({ setView }) => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [localCompletion, setLocalCompletion] = useState(activeClient.profile.completion);
  const [localMilestones, setLocalMilestones] = useState(activeClient.milestones);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [attachData, setAttachData] = useState<Record<string, { url: string, name: string }>>({});

  useEffect(() => {
    setLocalCompletion(activeClient.profile.completion);
    setLocalMilestones(activeClient.milestones);
  }, [globalState.activeClientId]);

  // Auto-calculate completion based on milestone weights
  useEffect(() => {
    if (!manualOverride) {
      const calculatedCompletion = Math.round(localMilestones.reduce((acc, m) => {
        if (m.status === StageStatus.COMPLETED) return acc + m.weight;
        if (m.status === StageStatus.IN_PROGRESS) return acc + (m.weight * 0.5);
        return acc;
      }, 0));
      setLocalCompletion(calculatedCompletion);
    }
  }, [localMilestones, manualOverride]);

  const handleStatusChange = (id: string, newStatus: StageStatus) => {
    setLocalMilestones(prev => 
      prev.map(m => m.id === id ? { ...m, status: newStatus } : m)
    );
  };

  const handleAttachAndComplete = (milestoneId: string) => {
    const data = attachData[milestoneId];
    if (!data || !data.url || !data.name) return;

    // 1. Update Milestone Status & Attachment
    setLocalMilestones(prev => 
      prev.map(m => m.id === milestoneId ? { ...m, status: StageStatus.COMPLETED, attachment: data } : m)
    );

    // 2. Send Message to Client
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'ARCHITECT' as const,
      text: `I have uploaded the deliverables for ${t(`stage.${milestoneId}`)}. Please review.`,
      attachment: { name: data.name, size: 'Link', url: data.url },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));

    // Clear input
    setAttachData(prev => ({ ...prev, [milestoneId]: { url: '', name: '' } }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            profile: { ...prev.clients[prev.activeClientId].profile, completion: localCompletion },
            milestones: localMilestones
          }
        }
      }));
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleArchiveProject = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          profile: { ...prev.clients[prev.activeClientId].profile, status: 'Archived' }
        }
      }
    }));
    setView(ViewModule.ADMIN_DIRECTORY);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.dashboard.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.dashboard.desc')}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="secondary" onClick={handleArchiveProject} className="flex-1 md:flex-none text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Archive size={18}/> <span className="hidden sm:inline">{t('admin.dashboard.archive')}</span>
          </Button>
          <Button onClick={handleSave} disabled={isSaving || saved} className="flex-1 md:flex-none">
            {isSaving ? 'Saving...' : saved ? <><CheckCircle2 size={18}/> {t('admin.project.saved')}</> : <><Save size={18}/> {t('admin.project.save')}</>}
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 flex items-center gap-2"><Edit3 size={20} className="text-gold-700 dark:text-gold-500"/> {t('admin.project.updateProgress')}</h3>
          <button 
            onClick={() => setManualOverride(!manualOverride)}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${manualOverride ? 'bg-gold-500/20 text-gold-700 dark:text-gold-400' : 'bg-luxury-100 dark:bg-luxury-800 text-luxury-500'}`}
          >
            {manualOverride ? <Unlock size={14}/> : <Lock size={14}/>}
            {manualOverride ? 'Manual Edit Enabled' : t('admin.project.unlockManual')}
          </button>
        </div>
        <div className="flex items-center gap-6">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={localCompletion} 
            onChange={(e) => setLocalCompletion(Number(e.target.value))}
            disabled={!manualOverride}
            className={`flex-1 h-2 rounded-lg appearance-none accent-gold-700 dark:accent-gold-500 ${manualOverride ? 'bg-luxury-200 dark:bg-luxury-800 cursor-pointer' : 'bg-luxury-100 dark:bg-luxury-900 cursor-not-allowed opacity-50'}`}
          />
          <div className="w-20 text-center p-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-inner">
            <span className="font-bold text-xl text-gold-700 dark:text-gold-400">{localCompletion}%</span>
          </div>
        </div>
        {!manualOverride && <p className="text-xs text-luxury-500 mt-2">{t('admin.project.autoCalc')}</p>}
      </Card>

      <Card>
        <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">{t('admin.project.stages')}</h3>
        <div className="space-y-4">
          {localMilestones.map((milestone) => {
            const isDeliverableStage = milestone.stage === ProjectStage.RENDERS || milestone.stage === ProjectStage.LAYOUTS || milestone.stage === ProjectStage.CONSTRUCTION;
            
            return (
              <div key={milestone.id} className="flex flex-col p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-sm gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{t(`stage.${milestone.id}`)}</h4>
                    <p className="text-xs font-medium text-luxury-500">Weight: {milestone.weight}%</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.COMPLETED)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.COMPLETED ? 'bg-green-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      Completed
                    </button>
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.IN_PROGRESS)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.IN_PROGRESS ? 'bg-gold-700 dark:bg-gold-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleStatusChange(milestone.id, StageStatus.UPCOMING)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${milestone.status === StageStatus.UPCOMING ? 'bg-luxury-500 text-white' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400 hover:bg-luxury-300 dark:hover:bg-luxury-700'}`}
                    >
                      Upcoming
                    </button>
                  </div>
                </div>

                {/* Attachment Section for Deliverable Stages */}
                {isDeliverableStage && milestone.status !== StageStatus.COMPLETED && (
                  <div className="mt-2 pt-4 border-t border-luxury-200 dark:border-luxury-800 flex flex-col md:flex-row gap-2">
                    <input 
                      type="text" 
                      placeholder={t('admin.project.fileName')}
                      value={attachData[milestone.id]?.name || ''}
                      onChange={(e) => setAttachData(prev => ({ ...prev, [milestone.id]: { ...prev[milestone.id], name: e.target.value } }))}
                      className="flex-1 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-gold-500"
                    />
                    <input 
                      type="text" 
                      placeholder={t('admin.project.fileUrl')}
                      value={attachData[milestone.id]?.url || ''}
                      onChange={(e) => setAttachData(prev => ({ ...prev, [milestone.id]: { ...prev[milestone.id], url: e.target.value } }))}
                      className="flex-1 bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-gold-500"
                    />
                    <Button 
                      onClick={() => handleAttachAndComplete(milestone.id)}
                      disabled={!attachData[milestone.id]?.name || !attachData[milestone.id]?.url}
                      className="py-2 px-4 text-sm whitespace-nowrap"
                    >
                      <Send size={14}/> {t('admin.project.attachFile')}
                    </Button>
                  </div>
                )}
                {milestone.attachment && (
                  <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-sm font-bold text-green-700 dark:text-green-400">
                    <CheckCircle2 size={16} /> Attached: {milestone.attachment.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export const AdminApprovals: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];

  const handleOverride = (id: string, status: 'Pending' | 'Approved' | 'Revision') => {
    setGlobalState(prev => {
      const updatedMaterials = prev.clients[prev.activeClientId].materials.map(m => m.id === id ? { ...m, status } : m);
      const hasPending = updatedMaterials.some(m => m.status === 'Pending');
      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            materials: updatedMaterials,
            hasPendingApprovals: hasPending
          }
        }
      };
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.approvals.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.approvals.desc')}</p>
        </div>
        <Button><FileCheck size={18}/> {t('admin.approvals.upload')}</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeClient.materials.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={`https://picsum.photos/id/${item.img}/100/100`} alt="Thumbnail" className="w-16 h-16 rounded-lg object-cover shadow-md" />
              <div>
                <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{item.title}</h4>
                <p className="text-xs font-medium text-luxury-500">Client Status: <span className={`font-bold ${item.status === 'Approved' ? 'text-green-500' : item.status === 'Pending' ? 'text-gold-700 dark:text-gold-500' : 'text-red-500'}`}>{item.status}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-luxury-400 mr-2">{t('admin.approvals.override')}:</span>
              <select 
                value={item.status}
                onChange={(e) => handleOverride(item.id, e.target.value as any)}
                className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Revision">Revision</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminFinance: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];

  const toggleInvoiceStatus = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          invoice: { ...prev.clients[prev.activeClientId].invoice, status: prev.clients[prev.activeClientId].invoice.status === 'Paid' ? 'Pending' : 'Paid' }
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.finance.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.finance.desc')}</p>
        </div>
        <Button><DollarSign size={18}/> {t('admin.finance.generate')}</Button>
      </div>

      <Card className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-xl text-luxury-900 dark:text-luxury-200">{activeClient.invoice.id}</h4>
          <p className="text-sm font-medium text-luxury-500">{activeClient.invoice.date} • {activeClient.profile.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold text-luxury-400">{t('admin.finance.status')}</p>
            <p className={`font-bold text-lg ${activeClient.invoice.status === 'Paid' ? 'text-green-500' : 'text-gold-700 dark:text-gold-500'}`}>{activeClient.invoice.status}</p>
          </div>
          <Button variant={activeClient.invoice.status === 'Paid' ? 'outline' : 'primary'} onClick={toggleInvoiceStatus}>
            {activeClient.invoice.status === 'Paid' ? 'Mark as Pending' : t('admin.finance.markPaid')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const AdminContracts: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];

  const handleSeal = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          contract: { ...prev.clients[prev.activeClientId].contract, isSealedByArchitect: true }
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.contracts.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.contracts.desc')}</p>
        </div>
      </div>

      <Card className="text-center py-12">
        <PenTool size={48} className="mx-auto text-gold-700 dark:text-gold-500 mb-6" />
        <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">Master Execution Agreement</h3>
        <p className="text-luxury-600 dark:text-luxury-400 font-medium mb-8">{t('admin.contracts.clientStatus')} <span className={`font-bold ${activeClient.contract.isSignedByClient ? 'text-green-500' : 'text-red-500'}`}>{activeClient.contract.isSignedByClient ? 'Signed' : 'Not Signed'}</span></p>
        
        <Button 
          onClick={handleSeal} 
          disabled={!activeClient.contract.isSignedByClient || activeClient.contract.isSealedByArchitect}
          className="mx-auto"
        >
          {activeClient.contract.isSealedByArchitect ? <><CheckCircle2 size={18}/> {t('admin.contracts.sealed')}</> : t('admin.contracts.sealBtn')}
        </Button>
      </Card>
    </div>
  );
};

export const AdminChat: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Mark messages as read when opening chat
    if (activeClient.hasUnreadMessages) {
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            hasUnreadMessages: false
          }
        }
      }));
    }
  }, [activeClient.chatHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'ARCHITECT' as const,
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          chatHistory: [...prev.clients[prev.activeClientId].chatHistory, newMessage]
        }
      }
    }));
    setInput('');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-120px)] flex flex-col pb-4">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-4 border-b border-luxury-200 dark:border-luxury-800 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md flex items-center gap-4 transition-colors duration-500">
          <img src={activeClient.profile.avatar} alt="Client" className="w-12 h-12 rounded-full object-cover border border-gold-700 dark:border-gold-500 shadow-[0_0_10px_rgba(166,136,104,0.3)]" />
          <div>
            <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{activeClient.profile.name}</h3>
            <p className="text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> VIP Client</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-luxury-50/50 dark:bg-luxury-950/30 transition-colors duration-500">
          {activeClient.chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'ARCHITECT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-4 rounded-2xl shadow-md ${
                msg.sender === 'ARCHITECT' 
                  ? 'bg-gradient-to-br from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-600 text-white dark:text-luxury-950 rounded-tr-none font-bold' 
                  : 'bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-200 rounded-tl-none font-medium'
              }`}>
                <p>{msg.text}</p>
                {msg.attachment && (
                  <div className="mt-3 bg-luxury-100/50 dark:bg-luxury-950/50 p-3 rounded-lg flex items-center gap-3 border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:border-gold-700/50 dark:hover:border-gold-500/50 transition-colors shadow-inner">
                    <div className="w-10 h-10 bg-white dark:bg-luxury-800 rounded flex items-center justify-center text-gold-700 dark:text-gold-400"><Paperclip size={16} /></div>
                    <div className="text-sm">
                      <p className="font-bold text-luxury-900 dark:text-luxury-100">{msg.attachment.name}</p>
                      <p className="text-xs font-medium text-luxury-500">{msg.attachment.size}</p>
                    </div>
                  </div>
                )}
                <p className={`text-[10px] mt-2 text-right ${msg.sender === 'ARCHITECT' ? 'text-gold-100 dark:text-luxury-800' : 'text-luxury-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md border-t border-luxury-200 dark:border-luxury-800 transition-colors duration-500">
          <div className="flex items-center gap-3 bg-luxury-50 dark:bg-luxury-900 rounded-xl p-2 border border-luxury-200 dark:border-luxury-700 focus-within:border-gold-700 dark:focus-within:border-gold-500 transition-colors shadow-inner">
            <button className="p-2 text-luxury-500 dark:text-luxury-400 hover:text-gold-700 dark:hover:text-gold-400 transition-colors"><Paperclip size={20} /></button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')} 
              className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-900 dark:text-luxury-50 text-sm" 
            />
            <button onClick={handleSend} className="p-2 bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 rounded-lg hover:from-gold-800 hover:to-gold-700 dark:hover:from-gold-500 dark:hover:to-gold-300 transition-all shadow-md"><Send size={18} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AdminBookings: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const { blockedSlots } = globalState;
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockTime, setBlockTime] = useState('ALL_DAY');
  const [bookingType, setBookingType] = useState<'In-Studio' | 'Virtual' | 'Site Visit'>('In-Studio');
  const [duration, setDuration] = useState<number>(2);

  // Generate time slots every 30 mins from 08:00 AM to 03:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let min = 0;
    while (hour < 15 || (hour === 15 && min === 0)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const timeStr = `${displayHour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
      slots.push(timeStr);
      min += 30;
      if (min >= 60) {
        min = 0;
        hour++;
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const calculateCost = () => {
    if (activeClient.profile.freeConsultations > 0) return 0;
    let baseRate = 50; // Virtual
    if (bookingType === 'In-Studio') baseRate = 80;
    if (bookingType === 'Site Visit') baseRate = 120;
    return baseRate * duration;
  };

  const handleStatusChange = (id: string, status: 'Confirmed' | 'Rescheduled') => {
    setGlobalState(prev => {
      const updatedBookings = prev.clients[prev.activeClientId].bookings.map(b => b.id === id ? { ...b, status } : b);
      
      // If confirmed, automatically block the slot in the global calendar
      let newBlockedSlots = [...prev.blockedSlots];
      if (status === 'Confirmed') {
        const booking = updatedBookings.find(b => b.id === id);
        if (booking) {
          newBlockedSlots.push({
            id: `blk${Date.now()}`,
            date: booking.date,
            time: booking.time,
            durationHours: booking.durationHours,
            reason: `Meeting with ${prev.clients[prev.activeClientId].profile.name}`
          });
        }
      }

      return {
        ...prev,
        blockedSlots: newBlockedSlots,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            bookings: updatedBookings
          }
        }
      };
    });
  };

  const handleBlockSlot = () => {
    if (!selectedDate || !blockReason.trim()) return;
    
    const newBlock = {
      id: `blk${Date.now()}`,
      date: selectedDate,
      time: blockTime,
      durationHours: blockTime === 'ALL_DAY' ? 24 : 2, // Default 2 hours for manual block
      reason: blockReason
    };

    setGlobalState(prev => ({
      ...prev,
      blockedSlots: [...prev.blockedSlots, newBlock]
    }));
    
    setSelectedDate(null);
    setBlockReason('');
    setBlockTime('ALL_DAY');
  };

  const handleProposeMeeting = () => {
    if (!selectedDate) return;
    const cost = calculateCost();
    const newBooking = {
      id: `bk${Date.now()}`,
      date: selectedDate,
      time: blockTime === 'ALL_DAY' ? '10:00 AM' : blockTime,
      durationHours: duration,
      type: bookingType,
      status: 'Pending' as const,
      initiatedBy: 'ARCHITECT' as const,
      cost
    };
    
    setGlobalState(prev => {
      const client = prev.clients[prev.activeClientId];
      let updatedInvoice = client.invoice;
      let updatedFreeConsultations = client.profile.freeConsultations;

      if (cost > 0) {
        // Add to invoice if not free
        updatedInvoice = {
          ...client.invoice,
          status: 'Pending',
          items: [
            ...client.invoice.items,
            { id: `inv_bk${Date.now()}`, desc: `${bookingType} Consultation (${duration}h)`, amount: cost }
          ]
        };
      } else {
        // Deduct free consultation
        updatedFreeConsultations = Math.max(0, updatedFreeConsultations - 1);
      }

      return {
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...client,
            profile: { ...client.profile, freeConsultations: updatedFreeConsultations },
            bookings: [...client.bookings, newBooking],
            invoice: updatedInvoice
          }
        }
      };
    });
    setSelectedDate(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.bookings.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.bookings.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-luxury-900 dark:text-luxury-200">{t('booking.month')}</h3>
              <div className="flex gap-2">
                <button className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&lt;</button>
                <button className="p-1 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">&gt;</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-xs font-bold text-luxury-500">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 30}).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const blocks = blockedSlots.filter(b => b.date === day);
                const isFullyBlocked = blocks.some(b => b.time === 'ALL_DAY');
                const hasClientBooking = activeClient.bookings.some(b => b.date === day);
                
                return (
                  <button 
                    key={day}
                    onClick={() => !isFullyBlocked && setSelectedDate(day)}
                    disabled={isFullyBlocked}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                      isSelected ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-400 dark:to-gold-600 text-white dark:text-luxury-950 font-bold shadow-[0_0_10px_rgba(166,136,104,0.5)] border-none' : 
                      isFullyBlocked ? 'bg-red-500/10 border border-red-500/20 text-red-500 opacity-70 cursor-not-allowed' :
                      'bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 font-medium text-luxury-700 dark:text-luxury-300 hover:bg-luxury-100 dark:hover:bg-luxury-800 hover:border-luxury-300 dark:hover:border-luxury-600'
                    }`}
                  >
                    {day}
                    <div className="flex gap-1 mt-1">
                      {hasClientBooking && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                      {blocks.length > 0 && !isFullyBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedDate && (
            <Card>
              <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-4">Manage Nov {selectedDate}</h3>
              
              <div className="mb-6 p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-inner">
                <p className="text-sm font-bold text-luxury-900 dark:text-luxury-200 mb-1">
                  {activeClient.profile.freeConsultations > 0 ? t('booking.free') : t('booking.exhausted')}
                </p>
                {activeClient.profile.freeConsultations > 0 && <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">{activeClient.profile.freeConsultations}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <select 
                    value={blockTime}
                    onChange={(e) => setBlockTime(e.target.value)}
                    className="bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  >
                    <option value="ALL_DAY">{t('admin.bookings.allDay')}</option>
                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                  </select>
                  <input 
                    type="text" 
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder={t('admin.bookings.reason')} 
                    className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 text-sm font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={bookingType}
                    onChange={(e) => {
                      setBookingType(e.target.value as any);
                      if (e.target.value === 'Virtual') setDuration(1);
                      else if (e.target.value === 'Site Visit') setDuration(3);
                      else setDuration(2);
                    }}
                    className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  >
                    <option value="In-Studio">{t('booking.type.studio')}</option>
                    <option value="Virtual">{t('booking.type.virtual')}</option>
                    <option value="Site Visit">{t('booking.type.site')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.duration')}</h3>
                  <div className="flex items-center gap-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-2 py-1">
                    <button onClick={() => setDuration(Math.max(1, duration - 1))} className="text-luxury-500 hover:text-gold-500 font-bold px-2">-</button>
                    <span className="font-bold text-luxury-900 dark:text-luxury-50 w-4 text-center">{duration}</span>
                    <button onClick={() => setDuration(Math.min(4, duration + 1))} className="text-luxury-500 hover:text-gold-500 font-bold px-2">+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.cost')}</span>
                  <span className="text-xl font-bold text-gold-600 dark:text-gold-400">{calculateCost()} BHD</span>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleBlockSlot} variant="secondary" className="flex-1"><Ban size={16}/> {t('admin.bookings.block')}</Button>
                  <Button onClick={handleProposeMeeting} className="flex-1"><Calendar size={16}/> {t('admin.bookings.propose')}</Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50">Client Requests</h3>
          {activeClient.bookings.length === 0 ? (
            <Card className="text-center py-12 text-luxury-500">No pending consultation requests.</Card>
          ) : (
            activeClient.bookings.map(booking => (
              <Card key={booking.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-luxury-500">NOV</span>
                    <span className="text-lg font-bold text-gold-700 dark:text-gold-400">{booking.date}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{activeClient.profile.name}</h4>
                    <p className="text-sm font-medium text-luxury-500">{booking.time} • {booking.type} ({booking.durationHours}h)</p>
                    {booking.initiatedBy === 'ARCHITECT' && <span className="text-[10px] font-bold text-gold-500">Proposed by you</span>}
                  </div>
                </div>
                {booking.status === 'Pending' && booking.initiatedBy === 'CLIENT' && (
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => handleStatusChange(booking.id, 'Confirmed')} className="py-2 px-4 text-xs flex-1">{t('admin.bookings.confirm')}</Button>
                    <Button onClick={() => handleStatusChange(booking.id, 'Rescheduled')} variant="secondary" className="py-2 px-4 text-xs flex-1">{t('admin.bookings.reschedule')}</Button>
                  </div>
                )}
                {booking.status === 'Confirmed' && (
                  <span className="px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 font-bold rounded-lg text-sm text-center">Confirmed</span>
                )}
              </Card>
            ))
          )}

          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mt-8">Blocked Schedule</h3>
          {blockedSlots.length === 0 ? (
            <p className="text-sm text-luxury-500">No blocked times.</p>
          ) : (
            blockedSlots.map(slot => (
              <div key={slot.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-red-600 dark:text-red-400">Nov {slot.date} • {slot.time}</p>
                  <p className="text-xs font-medium text-luxury-600 dark:text-luxury-400">{slot.reason}</p>
                </div>
                <Ban size={16} className="text-red-500/50" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const AdminTasks: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const [newTask, setNewTask] = useState('');

  const handleToggleTask = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: prev.clients[prev.activeClientId].tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }
      }
    }));
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task = {
      id: `tsk${Date.now()}`,
      title: newTask,
      dueDate: 'Pending',
      completed: false,
      priority: 'Medium' as const
    };
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: [task, ...prev.clients[prev.activeClientId].tasks]
        }
      }
    }));
    setNewTask('');
  };

  const handleDeleteTask = (id: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tasks: prev.clients[prev.activeClientId].tasks.filter(t => t.id !== id)
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('admin.tasks.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('admin.tasks.desc')}</p>
        </div>
      </div>

      <Card>
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder={t('admin.tasks.placeholder')} 
            className="flex-1 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors" 
          />
          <Button onClick={handleAddTask}><Plus size={18}/> {t('admin.tasks.add')}</Button>
        </div>

        <div className="space-y-3">
          {activeClient.tasks.map(task => (
            <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${task.completed ? 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-800 opacity-60' : 'bg-white dark:bg-luxury-900 border-luxury-200 dark:border-luxury-700 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggleTask(task.id)} className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-gold-700 dark:bg-gold-500 border-gold-700 dark:border-gold-500 text-white' : 'border-luxury-300 dark:border-luxury-600 hover:border-gold-700 dark:hover:border-gold-500'}`}>
                  {task.completed && <Check size={14} />}
                </button>
                <div>
                  <p className={`font-bold ${task.completed ? 'line-through text-luxury-500' : 'text-luxury-900 dark:text-luxury-200'}`}>{task.title}</p>
                  <p className="text-xs font-medium text-luxury-500">Due: {task.dueDate} • Priority: <span className={task.priority === 'High' ? 'text-red-500' : task.priority === 'Medium' ? 'text-gold-700 dark:text-gold-500' : 'text-green-500'}>{task.priority}</span></p>
                </div>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} className="text-luxury-400 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const AdminProfile: React.FC = () => {
  const { theme, setTheme, lang, setLang, t, globalState, setGlobalState } = useAppContext();
  const isRTL = lang === 'ar';
  const isDark = theme === 'dark';
  const { architectProfile } = globalState;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(architectProfile.name);
  const [editAvatar, setEditAvatar] = useState(architectProfile.avatar);

  const handleSaveProfile = () => {
    setGlobalState(prev => ({
      ...prev,
      architectProfile: {
        ...prev.architectProfile,
        name: editName,
        avatar: editAvatar
      }
    }));
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <Card className="flex flex-col md:flex-row items-center gap-8">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer" 
          onClick={() => setIsEditing(true)}
        >
          <img src={architectProfile.avatar} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-luxury-200 dark:border-luxury-800 group-hover:border-gold-700 dark:group-hover:border-gold-500 transition-colors shadow-xl" />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm text-white font-bold flex items-center gap-1"><Edit2 size={14}/> {t('profile.changePhoto')}</span>
          </div>
        </motion.div>
        <div className="flex-1 text-center md:text-left w-full">
          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
              />
              <input 
                type="text" 
                value={editAvatar} 
                onChange={(e) => setEditAvatar(e.target.value)}
                placeholder="Avatar URL"
                className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-2 font-medium text-sm text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
              />
              <div className="flex gap-2 justify-center md:justify-start">
                <Button onClick={handleSaveProfile} className="py-2 px-4 text-sm"><Check size={16}/> Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="py-2 px-4 text-sm">Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50">{architectProfile.name}</h2>
                <button onClick={() => setIsEditing(true)} className="text-luxury-400 hover:text-gold-700 dark:hover:text-gold-500 transition-colors"><Edit2 size={16}/></button>
              </div>
              <p className="bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text font-bold text-lg mb-4">{architectProfile.title}</p>
            </>
          )}
        </div>
      </Card>

      <Card delay={0.1}>
        <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6 flex items-center gap-2"><Settings size={24} className="text-gold-700 dark:text-gold-500"/> {t('profile.preferences')}</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Globe className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.language')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.languageDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setLang(isRTL ? 'en' : 'ar')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isRTL ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isRTL ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-luxury-50 dark:bg-luxury-950 rounded-lg border border-luxury-200 dark:border-luxury-800 shadow-inner transition-colors duration-500">
            <div className="flex items-center gap-4">
              <Moon className="text-luxury-600 dark:text-luxury-400" />
              <div>
                <p className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{t('profile.theme')}</p>
                <p className="text-sm font-bold text-luxury-500">{t('profile.themeDesc')}</p>
              </div>
            </div>
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${isDark ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400' : 'bg-luxury-300 dark:bg-luxury-700'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-luxury-50 transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
