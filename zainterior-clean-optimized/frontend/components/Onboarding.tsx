import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './UI';
import { Sparkles, Shield, Compass, Check } from 'lucide-react';

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Sparkles,
      title: "Welcome to ZAINTERIOR",
      desc: "Experience architectural excellence. Your bespoke portal is designed to provide complete transparency and control over your luxury project."
    },
    {
      icon: Compass,
      title: "Track Every Detail",
      desc: "From initial concept sketches to final handover, monitor real-time progress, approve materials, and view 4K renders instantly."
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      desc: "Sign contracts digitally, process milestone payments securely, and communicate directly with Arch. Zainab in complete privacy."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-luxury-50/90 dark:bg-luxury-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gold-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-luxury-300/40 dark:from-luxury-700/40 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div 
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gradient-to-br from-white to-luxury-50 dark:from-luxury-900 dark:to-luxury-950 border border-luxury-200 dark:border-luxury-800 p-10 rounded-3xl max-w-lg w-full text-center relative z-10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full mx-1 transition-all duration-500 ${i === step ? 'bg-gradient-to-r from-gold-500 to-gold-400 w-6' : 'bg-luxury-300 dark:bg-luxury-700'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-luxury-100 to-white dark:from-luxury-800 dark:to-luxury-900 border border-luxury-200 dark:border-luxury-700 flex items-center justify-center shadow-inner">
              {React.createElement(steps[step].icon, { size: 40, className: "text-gold-500" })}
            </div>
            <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-luxury-900 to-luxury-600 dark:from-luxury-50 dark:to-luxury-300 text-transparent bg-clip-text mb-4">{steps[step].title}</h2>
            <p className="text-luxury-600 dark:text-luxury-400 font-medium leading-relaxed mb-10">{steps[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <Button onClick={handleNext} className="w-full py-4 text-lg">
          {step === steps.length - 1 ? 'Enter Portal' : 'Continue'}
        </Button>
      </motion.div>
    </div>
  );
};
