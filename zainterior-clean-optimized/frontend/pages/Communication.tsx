import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { Send, Paperclip, Calendar as CalendarIcon, Clock, ChevronDown, MapPin, Video, Building } from 'lucide-react';

export const Chat: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const chatHistory = activeClient.chatHistory;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage = {
      id: `msg${Date.now()}`,
      sender: 'CLIENT' as const,
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
          <img src="https://picsum.photos/id/1027/100/100" alt="Designer" className="w-12 h-12 rounded-full object-cover border border-gold-500 shadow-[0_0_10px_rgba(166,136,104,0.3)]" />
          <div>
            <h3 className="font-serif text-lg font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">Arch. Zainab Al-Zaki</h3>
            <p className="text-xs font-bold text-green-600 dark:text-green-500 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> {t('chat.online')}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-luxury-50/50 dark:bg-luxury-950/30 transition-colors duration-500">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'CLIENT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-4 rounded-2xl shadow-md ${
                msg.sender === 'CLIENT' 
                  ? 'bg-gradient-to-br from-gold-600 to-gold-400 dark:from-gold-500 dark:to-gold-600 text-white dark:text-luxury-950 rounded-tr-none font-bold' 
                  : 'bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 text-luxury-900 dark:text-luxury-200 rounded-tl-none font-medium'
              }`}>
                <p>{msg.text}</p>
                {msg.attachment && (
                  <div className="mt-3 bg-luxury-100/50 dark:bg-luxury-950/50 p-3 rounded-lg flex items-center gap-3 border border-luxury-200 dark:border-luxury-800 cursor-pointer hover:border-gold-500/50 transition-colors shadow-inner">
                    <div className="w-10 h-10 bg-white dark:bg-luxury-800 rounded flex items-center justify-center text-gold-600 dark:text-gold-400"><Paperclip size={16} /></div>
                    <div className="text-sm">
                      <p className="font-bold text-luxury-900 dark:text-luxury-100">{msg.attachment.name}</p>
                      <p className="text-xs font-medium text-luxury-500">{msg.attachment.size}</p>
                    </div>
                  </div>
                )}
                <p className={`text-[10px] mt-2 text-right ${msg.sender === 'CLIENT' ? 'text-gold-100 dark:text-luxury-800' : 'text-luxury-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md border-t border-luxury-200 dark:border-luxury-800 transition-colors duration-500">
          <div className="flex items-center gap-3 bg-luxury-50 dark:bg-luxury-900 rounded-xl p-2 border border-luxury-200 dark:border-luxury-700 focus-within:border-gold-500 transition-colors shadow-inner">
            <button className="p-2 text-luxury-500 dark:text-luxury-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors"><Paperclip size={20} /></button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')} 
              className="flex-1 bg-transparent border-none focus:outline-none font-medium text-luxury-900 dark:text-luxury-50 text-sm" 
            />
            <button onClick={handleSend} className="p-2 bg-gradient-to-r from-gold-600 to-gold-400 text-white dark:text-luxury-950 rounded-lg hover:from-gold-500 hover:to-gold-300 transition-all shadow-md"><Send size={18} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<'In-Studio' | 'Virtual' | 'Site Visit'>('In-Studio');
  const [duration, setDuration] = useState<number>(2);
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const bookings = activeClient.bookings;
  const blockedSlots = globalState.blockedSlots;
  const freeConsultations = activeClient.profile.freeConsultations;

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
    if (freeConsultations > 0) return 0;
    let baseRate = 50; // Virtual
    if (bookingType === 'In-Studio') baseRate = 80;
    if (bookingType === 'Site Visit') baseRate = 120;
    return baseRate * duration;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;
    const cost = calculateCost();
    const newBooking = {
      id: `bk${Date.now()}`,
      date: selectedDate,
      time: selectedTime,
      durationHours: duration,
      type: bookingType,
      status: 'Pending' as const,
      initiatedBy: 'CLIENT' as const,
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
    setSelectedTime(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-8">{t('booking.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2">
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
              const hasBooking = bookings.find(b => b.date === day);
              
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
                    {hasBooking && <span className={`w-1.5 h-1.5 rounded-full ${hasBooking.status === 'Confirmed' ? 'bg-green-500' : 'bg-gold-500'}`} />}
                    {blocks.length > 0 && !isFullyBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="mb-6 p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg shadow-inner">
              <p className="text-sm font-bold text-luxury-900 dark:text-luxury-200 mb-1">
                {freeConsultations > 0 ? t('booking.free') : t('booking.exhausted')}
              </p>
              {freeConsultations > 0 && <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">{freeConsultations}</p>}
            </div>

            <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400 mb-4">{t('booking.type')}</h3>
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => { setBookingType('In-Studio'); setDuration(2); }}
                className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                  bookingType === 'In-Studio' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                }`}
              >
                <Building size={16} /> {t('booking.type.studio')}
              </button>
              <button 
                onClick={() => { setBookingType('Virtual'); setDuration(1); }}
                className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                  bookingType === 'Virtual' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                }`}
              >
                <Video size={16} /> {t('booking.type.virtual')}
              </button>
              <button 
                onClick={() => { setBookingType('Site Visit'); setDuration(3); }}
                className={`w-full py-3 px-4 rounded-lg text-sm font-bold transition-all border flex items-center gap-3 ${
                  bookingType === 'Site Visit' ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                }`}
              >
                <MapPin size={16} /> {t('booking.type.site')}
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.duration')}</h3>
              <div className="flex items-center gap-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg px-2 py-1">
                <button onClick={() => setDuration(Math.max(1, duration - 1))} className="text-luxury-500 hover:text-gold-500 font-bold px-2">-</button>
                <span className="font-bold text-luxury-900 dark:text-luxury-50 w-4 text-center">{duration}</span>
                <button onClick={() => setDuration(Math.min(4, duration + 1))} className="text-luxury-500 hover:text-gold-500 font-bold px-2">+</button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-luxury-600 dark:text-luxury-400 mb-4 flex items-center gap-2"><Clock size={16}/> {t('booking.times')}</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
              {timeSlots.map(time => {
                // Simple check if time is blocked (in a real app, this would parse times properly)
                const isBlocked = blockedSlots.some(b => b.date === selectedDate && (b.time === time || b.time === 'ALL_DAY'));
                return (
                  <button 
                    key={time}
                    onClick={() => !isBlocked && setSelectedTime(time)}
                    disabled={isBlocked}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all border ${
                      isBlocked ? 'bg-red-500/5 border-red-500/20 text-red-500/50 cursor-not-allowed' :
                      selectedTime === time ? 'bg-gradient-to-r from-gold-500/10 to-transparent border-gold-500 text-gold-600 dark:text-gold-400 shadow-inner' : 'bg-luxury-50/50 dark:bg-luxury-950/50 border-luxury-200 dark:border-luxury-700 text-luxury-700 dark:text-luxury-300 hover:border-luxury-400 dark:hover:border-luxury-500'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-luxury-200 dark:border-luxury-800 flex justify-between items-center">
              <span className="text-sm font-bold text-luxury-600 dark:text-luxury-400">{t('booking.cost')}</span>
              <span className="text-xl font-bold text-gold-600 dark:text-gold-400">{calculateCost()} BHD</span>
            </div>
          </Card>
          
          <Button className="w-full" disabled={!selectedDate || !selectedTime} onClick={handleBooking}>
            {t('booking.confirm')}
          </Button>

          {bookings.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold text-luxury-900 dark:text-luxury-200 mb-4">Your Bookings</h4>
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="p-3 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-luxury-900 dark:text-luxury-200">Nov {b.date}, {b.time}</p>
                      <p className="text-xs font-medium text-luxury-500">{b.type} ({b.durationHours}h)</p>
                      <p className={`text-xs font-bold mt-1 ${b.status === 'Confirmed' ? 'text-green-500' : 'text-gold-500'}`}>{b.status === 'Confirmed' ? t('booking.confirmed') : t('booking.pending')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Support: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const tickets = activeClient.tickets;
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');

  const faqs = [
    { q: "How do I request a revision on a 3D render?", a: "Navigate to the 'Files & Approvals' tab, locate the specific render, and click 'Revise'. You can add specific comments directly there." },
    { q: "What is the standard lead time for imported Italian marble?", a: "Typically 8-12 weeks from the date of order confirmation and payment of the material retainer." },
    { q: "Can I change my service tier mid-project?", a: "Yes, you can upgrade your tier at any time via the 'Packages' tab. Downgrades require a consultation with the lead architect." }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const handleSubmit = () => {
    if (!subject.trim() || !desc.trim()) return;
    const newTicket = {
      id: `tkt${Date.now()}`,
      subject,
      description: desc,
      status: 'Under Review' as const,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          tickets: [newTicket, ...prev.clients[prev.activeClientId].tickets]
        }
      }
    }));
    setSubject('');
    setDesc('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-4">{t('support.title')}</h2>
        <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('support.desc')}</p>
      </div>

      <Card>
        <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text mb-6">{t('support.faq')}</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-luxury-200 dark:border-luxury-800 rounded-lg overflow-hidden shadow-sm transition-colors duration-500">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 bg-white/80 dark:bg-luxury-950/80 text-left hover:bg-luxury-50 dark:hover:bg-luxury-900 transition-colors"
              >
                <span className="font-bold text-luxury-900 dark:text-luxury-200">{faq.q}</span>
                <ChevronDown size={18} className={`text-gold-500 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="p-4 bg-luxury-50/50 dark:bg-luxury-900/50 text-sm font-medium text-luxury-700 dark:text-luxury-400 border-t border-luxury-200 dark:border-luxury-800 shadow-inner">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-6">{t('support.ticket')}</h3>
        <div className="space-y-4">
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t('support.subject')} 
            className="w-full bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 shadow-inner transition-colors" 
          />
          <textarea 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={t('support.inquiry')} 
            rows={4} 
            className="w-full bg-luxury-50/50 dark:bg-luxury-950/50 border border-luxury-200 dark:border-luxury-800 rounded-lg px-4 py-3 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-500 resize-none shadow-inner transition-colors"
          ></textarea>
          <Button onClick={handleSubmit} className="w-full md:w-auto">{t('support.submit')}</Button>
        </div>
      </Card>

      {tickets.length > 0 && (
        <Card>
          <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">Your Tickets</h3>
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{ticket.subject}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : ticket.status === 'In Progress' ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400'}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-luxury-600 dark:text-luxury-400 mb-2">{ticket.description}</p>
                {ticket.architectNotes && (
                  <div className="mt-3 p-3 bg-white dark:bg-luxury-900 border-l-4 border-gold-700 dark:border-gold-500 rounded-r-lg shadow-sm">
                    <p className="text-xs font-bold text-gold-700 dark:text-gold-400 mb-1">{t('support.architectNote')}</p>
                    <p className="text-sm font-medium text-luxury-900 dark:text-luxury-200">{ticket.architectNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
