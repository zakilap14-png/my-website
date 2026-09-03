import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, MaterialComparator } from '../components/UI';
import { useAppContext } from '../App';
import { Download, Check, Printer, CreditCard, Smartphone, Loader2, CheckCircle, X } from 'lucide-react';

export const Approvals: React.FC = () => {
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const materials = activeClient.materials;

  const handleAction = (id: string, status: 'Approved' | 'Revision') => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          materials: prev.clients[prev.activeClientId].materials.map(m => m.id === id ? { ...m, status } : m)
        }
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-2">{t('approvals.title')}</h2>
          <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('approvals.desc')}</p>
        </div>
      </div>

      <Card>
        <MaterialComparator />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {materials.map((item) => (
          <Card key={item.id} className="flex gap-4">
            <img src={`https://picsum.photos/id/${item.img}/100/100`} alt="Thumbnail" className="w-24 h-24 rounded-lg object-cover shadow-md" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-luxury-900 dark:text-luxury-200">{item.title}</h4>
                <p className="text-xs font-medium text-luxury-500">{item.type}</p>
              </div>
              {item.status === 'Pending' ? (
                <div className="flex gap-2 mt-2">
                  <Button variant="primary" onClick={() => handleAction(item.id, 'Approved')} className="py-1.5 px-3 text-xs flex-1">{t('btn.approve')}</Button>
                  <Button variant="secondary" onClick={() => handleAction(item.id, 'Revision')} className="py-1.5 px-3 text-xs flex-1">{t('btn.revise')}</Button>
                </div>
              ) : (
                <div className={`flex items-center gap-2 text-sm font-bold mt-2 ${item.status === 'Approved' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  {item.status === 'Approved' ? <Check size={16} /> : <X size={16} />} 
                  {item.status === 'Approved' ? t('status.approved') : 'Revision Requested'}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const Contracts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const contract = activeClient.contract;

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (contract.isSignedByClient) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current || contract.isSignedByClient) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#A68868';

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const clearCanvas = () => {
    if (contract.isSignedByClient) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSign = () => {
    setGlobalState(prev => ({
      ...prev,
      clients: {
        ...prev.clients,
        [prev.activeClientId]: {
          ...prev.clients[prev.activeClientId],
          contract: { ...prev.clients[prev.activeClientId].contract, isSignedByClient: true }
        }
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Card>
        <div className="flex justify-between items-center mb-6 border-b border-luxury-200 dark:border-luxury-800 pb-4">
          <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{t('contracts.title')}</h2>
          <Button variant="outline" className="py-2"><Download size={16} /> {t('contracts.pdf')}</Button>
        </div>
        
        <div className="h-64 overflow-y-auto bg-luxury-50/50 dark:bg-luxury-950/50 p-6 rounded-lg border border-luxury-200 dark:border-luxury-800 text-sm text-luxury-700 dark:text-luxury-400 space-y-4 font-serif font-medium leading-relaxed no-scrollbar shadow-inner transition-colors duration-500">
          <p>This agreement is made between ZAINTERIOR (hereinafter referred to as "The Studio") and Ahmad Bin Jassim (hereinafter referred to as "The Client").</p>
          <p>1. SCOPE OF WORK: The Studio agrees to provide comprehensive architectural and interior design services for the Diyar Al Muharraq Villa project, encompassing 840 m².</p>
          <p>2. TIMELINE: The project is estimated to reach handover within 14 months from the date of signing, subject to timely approvals.</p>
          <p>3. PAYMENT TERMS: Payments shall be made in milestones as detailed in the attached schedule. A 10% VAT applies as per Kingdom of Bahrain regulations.</p>
        </div>

        <div className="mt-8">
          <h3 className="text-luxury-900 dark:text-luxury-200 font-bold mb-4">{t('contracts.signature')}</h3>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              className={`w-full h-48 bg-luxury-50 dark:bg-luxury-950 border border-luxury-300 dark:border-luxury-700 rounded-lg shadow-inner transition-colors duration-500 ${contract.isSignedByClient ? 'cursor-not-allowed opacity-70' : 'cursor-crosshair touch-none'}`}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
            {contract.isSealedByArchitect && (
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute top-4 right-4 border-4 border-red-500/50 text-red-500/50 font-serif text-2xl font-bold px-4 py-1 rounded transform rotate-12 pointer-events-none">
                {t('contracts.seal')}
              </motion.div>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={clearCanvas} disabled={contract.isSignedByClient} className="text-sm font-bold text-luxury-500 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors disabled:opacity-50">{t('contracts.clear')}</button>
            <Button onClick={handleSign} disabled={contract.isSignedByClient}>
              {contract.isSignedByClient ? (contract.isSealedByArchitect ? t('contracts.signed') : t('contracts.waitingSeal')) : t('contracts.sign')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const Invoice: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'benefit' | 'card'>('benefit');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const { t, globalState, setGlobalState } = useAppContext();
  const activeClient = globalState.clients[globalState.activeClientId];
  const invoice = activeClient.invoice;

  const handlePrint = () => window.print();

  const processPayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setGlobalState(prev => ({
        ...prev,
        clients: {
          ...prev.clients,
          [prev.activeClientId]: {
            ...prev.clients[prev.activeClientId],
            invoice: { ...prev.clients[prev.activeClientId].invoice, status: 'Paid' }
          }
        }
      }));
      setTimeout(() => {
        setShowPayment(false);
        setPaymentStatus('idle');
      }, 2000);
    }, 2000);
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + item.amount, 0);
  const vat = subtotal * 0.10;
  const total = subtotal + vat;

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      <div className="flex justify-end mb-6 print:hidden">
        <Button onClick={handlePrint}><Printer size={18} /> {t('invoice.print')}</Button>
      </div>

      <Card id="printable-invoice" className="p-10 rounded-none md:rounded-xl print:bg-white print:text-black relative overflow-hidden">
        {invoice.status === 'Paid' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-green-500/20 text-green-500/20 font-serif text-6xl font-bold px-8 py-4 rounded-xl transform -rotate-12 pointer-events-none z-0">
            {t('invoice.paid')}
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex justify-between items-start border-b-2 border-luxury-200 dark:border-luxury-800 print:border-gray-200 pb-8 mb-8">
            <div>
              <h1 className="font-serif text-4xl font-bold text-luxury-900 dark:text-luxury-50 print:text-black tracking-widest mb-2">{t('app.title')}</h1>
              <p className="text-sm font-medium text-luxury-500 dark:text-luxury-400 print:text-gray-500">CR: 123456-1 | Manama, Kingdom of Bahrain</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-luxury-400 dark:text-luxury-500 print:text-gray-400 mb-2">{t('invoice.tax')}</h2>
              <p className="text-sm font-bold text-luxury-900 dark:text-luxury-50 print:text-black">{invoice.id}</p>
              <p className="text-sm font-medium text-luxury-500 dark:text-luxury-400 print:text-gray-500">{t('invoice.date')} {invoice.date}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold text-luxury-500 dark:text-luxury-400 print:text-gray-500 mb-1">{t('invoice.billedTo')}</p>
            <p className="font-bold text-lg text-luxury-900 dark:text-luxury-50 print:text-black">{activeClient.profile.name}</p>
            <p className="text-sm font-medium text-luxury-600 dark:text-luxury-300 print:text-gray-600">{activeClient.profile.project}</p>
          </div>

          <table className="w-full mb-8 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-luxury-200 dark:border-luxury-800 print:border-gray-200 text-sm text-luxury-500 dark:text-luxury-400 print:text-gray-500">
                <th className="py-3 font-bold">{t('invoice.desc')}</th>
                <th className="py-3 font-bold text-right">{t('invoice.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id} className="border-b border-luxury-100 dark:border-luxury-800/50 print:border-gray-100">
                  <td className="py-4 font-medium text-luxury-900 dark:text-luxury-200 print:text-black">{item.desc}</td>
                  <td className="py-4 font-medium text-right text-luxury-900 dark:text-luxury-200 print:text-black">{item.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm font-medium text-luxury-600 dark:text-luxury-300 print:text-gray-600">
                <span>{t('invoice.subtotal')}</span>
                <span>{subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})} BHD</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-luxury-600 dark:text-luxury-300 print:text-gray-600">
                <span>{t('invoice.vat')}</span>
                <span>{vat.toLocaleString('en-US', {minimumFractionDigits: 2})} BHD</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t-2 border-luxury-900 dark:border-luxury-100 print:border-black pt-3 mt-3 text-luxury-900 dark:text-luxury-50 print:text-black">
                <span>{t('invoice.total')}</span>
                <span>{total.toLocaleString('en-US', {minimumFractionDigits: 2})} BHD</span>
              </div>
            </div>
          </div>

          {invoice.status === 'Pending' && (
            <div className="mt-16 pt-8 border-t border-luxury-200 dark:border-luxury-800 print:border-gray-200 text-center text-sm font-medium text-luxury-500 dark:text-luxury-400 print:text-gray-500 print:hidden">
              <p className="mb-4">{t('invoice.secure')}</p>
              <Button onClick={() => setShowPayment(true)} className="mx-auto w-full max-w-xs">{t('invoice.payBtn')} {total.toLocaleString('en-US', {minimumFractionDigits: 2})} BHD</Button>
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-luxury-200 dark:border-luxury-800 p-8 rounded-2xl max-w-md w-full shadow-2xl transition-colors duration-500"
            >
              {paymentStatus === 'idle' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text">{t('checkout.title')}</h3>
                    <button onClick={() => setShowPayment(false)} className="text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors"><X size={20}/></button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-luxury-600 dark:text-luxury-400 font-bold text-sm mb-1">{t('checkout.due')}</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-gold-600 to-gold-400 dark:from-gold-300 dark:to-gold-600 text-transparent bg-clip-text">{total.toLocaleString('en-US', {minimumFractionDigits: 2})} BHD</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <button 
                      onClick={() => setPaymentMethod('benefit')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'benefit' ? 'border-gold-500 bg-gradient-to-r from-gold-500/10 to-transparent shadow-inner' : 'border-luxury-300 dark:border-luxury-700 hover:border-luxury-400 dark:hover:border-luxury-500 bg-luxury-50 dark:bg-luxury-950/50'}`}
                    >
                      <Smartphone className={paymentMethod === 'benefit' ? 'text-gold-600 dark:text-gold-400' : 'text-luxury-600 dark:text-luxury-400'} />
                      <span className={paymentMethod === 'benefit' ? 'text-gold-600 dark:text-gold-400 font-bold' : 'text-luxury-700 dark:text-luxury-300 font-bold'}>BenefitPay</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${paymentMethod === 'card' ? 'border-gold-500 bg-gradient-to-r from-gold-500/10 to-transparent shadow-inner' : 'border-luxury-300 dark:border-luxury-700 hover:border-luxury-400 dark:hover:border-luxury-500 bg-luxury-50 dark:bg-luxury-950/50'}`}
                    >
                      <CreditCard className={paymentMethod === 'card' ? 'text-gold-600 dark:text-gold-400' : 'text-luxury-600 dark:text-luxury-400'} />
                      <span className={paymentMethod === 'card' ? 'text-gold-600 dark:text-gold-400 font-bold' : 'text-luxury-700 dark:text-luxury-300 font-bold'}>Credit Card</span>
                    </button>
                  </div>

                  <Button onClick={processPayment} className="w-full">{t('checkout.confirm')}</Button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 size={48} className="text-gold-500 animate-spin mb-4" />
                  <h3 className="font-serif text-xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{t('checkout.processing')}</h3>
                  <p className="text-luxury-600 dark:text-luxury-400 font-medium text-sm">{t('checkout.wait')}</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="py-12 flex flex-col items-center justify-center text-center">
                  <CheckCircle size={64} className="text-green-600 dark:text-green-500 mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{t('checkout.success')}</h3>
                  <p className="text-luxury-600 dark:text-luxury-400 font-medium text-sm">{t('checkout.thankYou')}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
