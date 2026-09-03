import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../components/UI';
import { PACKAGES, PORTFOLIO_ITEMS } from '../constants';
import { useAppContext } from '../App';
import { Check, Maximize2, Sun, Moon, Send, CheckCircle2 } from 'lucide-react';

export const Packages: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-4">{t('packages.title')}</h2>
        <p className="text-luxury-600 dark:text-luxury-400 font-medium max-w-2xl mx-auto">{t('packages.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg, idx) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`relative bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border rounded-2xl p-8 flex flex-col transition-colors duration-500 ${pkg.recommended ? 'border-gold-700 dark:border-gold-500 shadow-[0_0_30px_rgba(166,136,104,0.15)] dark:shadow-[0_0_30px_rgba(197,156,106,0.15)] transform md:-translate-y-4' : 'border-luxury-200 dark:border-luxury-800 shadow-lg'}`}
          >
            {pkg.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-500 dark:to-gold-400 text-white dark:text-luxury-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {t('packages.current')}
              </div>
            )}
            <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{pkg.name}</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 text-transparent bg-clip-text mb-8">{pkg.price}</p>
            <ul className="space-y-4 mb-8 flex-1">
              {pkg.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3 text-luxury-700 dark:text-luxury-300 text-sm font-medium">
                  <Check size={16} className="text-gold-700 dark:text-gold-500 mt-0.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant={pkg.recommended ? 'primary' : 'outline'} 
              onClick={() => !pkg.recommended && setShowModal(true)}
              className="w-full"
            >
              {pkg.recommended ? t('packages.active') : t('packages.upgrade')}
            </Button>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-gold-700/50 dark:border-gold-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-700/20 dark:from-gold-500/20 to-transparent rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-700/30 dark:border-gold-500/30">
              <Check size={32} className="text-gold-700 dark:text-gold-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{t('packages.reqTitle')}</h3>
            <p className="text-luxury-600 dark:text-luxury-400 font-medium mb-8">{t('packages.reqDesc')}</p>
            <Button onClick={() => setShowModal(false)} className="w-full">{t('packages.close')}</Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export const VisionBuilder: React.FC = () => {
  const styles = ['Modern Minimalist', 'Classic Neoclassical', 'Desert Contemporary', 'Opulent Art Deco'];
  const [selectedStyle, setSelectedStyle] = useState(styles[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const { t } = useAppContext();

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <Card>
        <h2 className="font-serif text-2xl font-bold text-luxury-900 dark:text-luxury-50 mb-6">{t('vision.title')}</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {styles.map(style => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all border font-bold ${selectedStyle === style ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950 border-transparent shadow-lg' : 'bg-luxury-50 dark:bg-luxury-950 border-luxury-200 dark:border-luxury-800 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 hover:border-luxury-400 dark:hover:border-luxury-600'}`}
            >
              {style}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[1015, 1016, 1018, 1019, 1021, 1022, 1023, 1024].map((id, idx) => (
            <motion.div 
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-luxury-200 dark:border-luxury-800 hover:border-gold-700/50 dark:hover:border-gold-500/50 transition-colors"
            >
              <img src={`https://picsum.photos/id/${id}/400/400`} alt="Moodboard" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-luxury-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="outline" className="scale-75 backdrop-blur-sm bg-white/50 dark:bg-luxury-950/50">{t('vision.select')}</Button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Button onClick={handleExport} disabled={isExporting || exported} className="w-full md:w-auto min-w-[200px]">
            {isExporting ? (
              <span className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sun size={18} /></motion.div> {t('vision.compiling')}</span>
            ) : exported ? (
              <span className="flex items-center gap-2 text-green-700 dark:text-green-900"><CheckCircle2 size={18} /> {t('vision.sent')}</span>
            ) : (
              <span className="flex items-center gap-2"><Send size={18} /> {t('vision.export')}</span>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const PortfolioVR: React.FC = () => {
  const [isNight, setIsNight] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { t } = useAppContext();

  return (
    <div className={`max-w-7xl mx-auto space-y-8 pb-20 ${isFullscreen ? 'fixed inset-0 z-50 bg-luxury-50 dark:bg-luxury-950 p-0 m-0 max-w-none' : ''}`}>
      {!isFullscreen && (
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-serif text-3xl font-bold text-luxury-900 dark:text-luxury-50 mb-2">{t('vr.title')}</h2>
            <p className="text-luxury-600 dark:text-luxury-400 font-medium">{t('vr.desc')}</p>
          </div>
        </div>
      )}

      <div className={`relative bg-white dark:bg-luxury-900 rounded-2xl overflow-hidden border border-luxury-200 dark:border-luxury-800 shadow-2xl transition-colors duration-500 ${isFullscreen ? 'h-full rounded-none border-none' : 'h-[600px]'}`}>
        <motion.div 
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="absolute top-0 left-0 h-full w-[2000px] cursor-grab active:cursor-grabbing"
        >
          <img 
            src="https://picsum.photos/id/1048/2000/800" 
            alt="VR Room" 
            className="w-full h-full object-cover pointer-events-none"
            style={{ filter: isNight ? 'brightness(0.4) sepia(0.3) hue-rotate(180deg)' : 'brightness(1.1) contrast(1.1)' }}
          />
          
          <div className="absolute top-1/2 left-[400px] w-8 h-8 bg-gradient-to-br from-gold-700 to-gold-600 dark:from-gold-400 dark:to-gold-600 rounded-full animate-pulse flex items-center justify-center cursor-pointer group shadow-[0_0_15px_rgba(166,136,104,0.8)] dark:shadow-[0_0_15px_rgba(197,156,106,0.8)]">
            <div className="w-3 h-3 bg-white dark:bg-luxury-50 rounded-full" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-white dark:bg-luxury-950 text-luxury-900 dark:text-luxury-50 text-xs p-3 rounded border border-luxury-200 dark:border-luxury-800 shadow-xl">
              <strong className="text-gold-700 dark:text-gold-400 block mb-1 font-bold">Calacatta Marble Island</strong>
              Imported from Italy. High durability, honed finish.
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-luxury-200 dark:border-luxury-800 shadow-lg">
          <button onClick={() => setIsNight(false)} className={`p-2 rounded-full transition-colors ${!isNight ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950' : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50'}`}>
            <Sun size={20} />
          </button>
          <div className="w-px h-6 bg-luxury-300 dark:bg-luxury-700" />
          <button onClick={() => setIsNight(true)} className={`p-2 rounded-full transition-colors ${isNight ? 'bg-gradient-to-r from-gold-700 to-gold-600 dark:from-gold-600 dark:to-gold-400 text-white dark:text-luxury-950' : 'text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50'}`}>
            <Moon size={20} />
          </button>
          <div className="w-px h-6 bg-luxury-300 dark:bg-luxury-700" />
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 text-luxury-600 dark:text-luxury-400 hover:text-luxury-900 dark:hover:text-luxury-50 transition-colors">
            <Maximize2 size={20} />
          </button>
        </div>
        
        <div className="absolute top-6 left-6 bg-white/80 dark:bg-luxury-950/80 backdrop-blur-md px-4 py-2 rounded-lg border border-luxury-200 dark:border-luxury-800 text-sm font-bold text-luxury-700 dark:text-luxury-300 shadow-lg">
          {t('vr.drag')}
        </div>
      </div>
    </div>
  );
};
