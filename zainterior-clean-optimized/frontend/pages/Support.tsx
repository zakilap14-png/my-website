import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { useAppContext } from '../App';
import { Ticket, DollarSign, MessageSquare, CheckCircle2, Clock, AlertCircle, Search } from 'lucide-react';

export const SupportDashboard: React.FC = () => {
  const { t, globalState } = useAppContext();
  const { clients } = globalState;

  const allTickets = Object.values(clients).flatMap(c => c.tickets.map(t => ({ ...t, clientName: c.profile.name, clientId: c.profile.id })));
  const pendingTickets = allTickets.filter(t => t.status !== 'Resolved').length;
  
  const allInvoices = Object.values(clients).map(c => ({ ...c.invoice, clientName: c.profile.name }));
  const pendingInvoices = allInvoices.filter(i => i.status === 'Pending').length;

  const unreadMessages = Object.values(clients).filter(c => c.hasUnreadMessages).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('support.dashboard.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('support.dashboard.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Tickets', value: pendingTickets.toString(), icon: Ticket, color: 'text-gold-700 dark:text-gold-400' },
          { label: 'Pending Invoices', value: pendingInvoices.toString(), icon: DollarSign, color: 'text-red-500 dark:text-red-400' },
          { label: 'Unread Messages', value: unreadMessages.toString(), icon: MessageSquare, color: 'text-blue-500 dark:text-blue-400' }
        ].map((metric, idx) => (
          <Card key={idx} delay={0.1 * idx} className="flex items-center justify-between">
            <div>
              <p className="text-luxury-600 dark:text-luxury-400 font-bold text-sm mb-1">{metric.label}</p>
              <p className={`text-2xl font-serif font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <metric.icon size={32} className="text-luxury-300 dark:text-luxury-700" />
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">Recent Tickets</h3>
        <div className="space-y-4">
          {allTickets.slice(0, 5).map(ticket => (
            <div key={ticket.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{ticket.subject}</h4>
                <p className="text-xs font-medium text-luxury-500">{ticket.date} • {ticket.clientName}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : ticket.status === 'In Progress' ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400' : 'bg-luxury-200 dark:bg-luxury-800 text-luxury-600 dark:text-luxury-400'}`}>
                {ticket.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const SupportTickets: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;
  const [searchTerm, setSearchTerm] = useState('');

  const allTickets = Object.values(clients).flatMap(c => c.tickets.map(t => ({ ...t, clientName: c.profile.name, clientId: c.profile.id })));
  
  const filteredTickets = allTickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (clientId: string, ticketId: string, status: 'Under Review' | 'In Progress' | 'Resolved') => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [clientId]: {
          ...prev.clients[clientId],
          tickets: prev.clients[clientId].tickets.map(tkt => tkt.id === ticketId ? { ...tkt, status } : tkt)
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">All Tickets</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">Manage and resolve client inquiries.</p>
        </div>
      </div>

      <Card>
        <div className="relative w-full md:w-96 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tickets or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg pl-10 pr-4 py-2 font-medium text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500 shadow-inner transition-colors"
          />
        </div>

        <div className="space-y-4">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="p-4 bg-luxury-50 dark:bg-luxury-950 border border-luxury-200 dark:border-luxury-800 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-luxury-900 dark:text-luxury-200">{ticket.subject}</h4>
                  <p className="text-xs font-medium text-luxury-500">{ticket.date} • {ticket.clientName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-luxury-400">{t('admin.support.updateStatus')}:</span>
                  <select 
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.clientId, ticket.id, e.target.value as any)}
                    className="bg-white dark:bg-luxury-900 border border-luxury-200 dark:border-luxury-700 rounded-lg px-3 py-2 text-sm font-bold text-luxury-900 dark:text-luxury-50 focus:outline-none focus:border-gold-700 dark:focus:border-gold-500"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <p className="text-sm font-medium text-luxury-700 dark:text-luxury-300">{ticket.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const SupportFinance: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const { clients } = globalState;

  const allInvoices = Object.values(clients).map(c => ({ ...c.invoice, clientName: c.profile.name, clientId: c.profile.id }));

  const toggleInvoiceStatus = (clientId: string, currentStatus: string) => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [clientId]: {
          ...prev.clients[clientId],
          invoice: { ...prev.clients[clientId].invoice, status: currentStatus === 'Paid' ? 'Pending' : 'Paid' }
        }
      }
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">Invoices & Payments</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">Track all client payments and invoice statuses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {allInvoices.map(invoice => (
          <Card key={invoice.id} className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xl text-luxury-900 dark:text-luxury-200">{invoice.id}</h4>
              <p className="text-sm font-medium text-luxury-500">{invoice.date} • {invoice.clientName}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-luxury-400">{t('admin.finance.status')}</p>
                <p className={`font-bold text-lg ${invoice.status === 'Paid' ? 'text-green-500' : 'text-gold-700 dark:text-gold-500'}`}>{invoice.status}</p>
              </div>
              <Button variant={invoice.status === 'Paid' ? 'outline' : 'primary'} onClick={() => toggleInvoiceStatus(invoice.clientId, invoice.status)}>
                {invoice.status === 'Paid' ? 'Mark as Pending' : t('admin.finance.markPaid')}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
