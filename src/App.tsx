/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, UserCircle, Sparkles, BookOpen, LineChart, Clock, Moon, CloudLightning, Star, Sun } from 'lucide-react';
import { UserDetails, TarotCard, ReadingResult } from './types';
import { TAROT_DECK } from './constants';
import { shuffle } from './utils';
import { interpretSpread } from './services/geminiService';

type Step = 'entrance' | 'shuffling' | 'reading';

export default function App() {
  const [step, setStep] = useState<Step>('entrance');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    dob: '',
    question: '',
  });
  const [reading, setReading] = useState<ReadingResult | null>(null);

  const startReading = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('shuffling');
    
    const deck = shuffle(TAROT_DECK);
    const selected = [
      { position: 'Past' as const, card: deck[0] },
      { position: 'Present' as const, card: deck[1] },
      { position: 'Future' as const, card: deck[2] },
    ];

    const interpretation = await interpretSpread(userDetails, selected);

    setReading({
      cards: selected.map(s => ({
        ...s,
        insight: s.card.meaning
      })),
      spiritsAnswer: interpretation
    });
    
    // We'll let the user see the "shuffling" for at least 3 seconds
    setTimeout(() => {
      setStep('reading');
    }, 4000);
  };

  const reset = () => {
    setStep('entrance');
    setReading(null);
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body relative overflow-x-hidden flex flex-col items-center justify-center">
      <div className="atmosphere" />
      
      {/* Header Overlay */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/30 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-white/5">
        <div className="font-serif text-2xl text-tertiary tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
          The Celestial Archive
        </div>
        <div className="flex gap-6 text-on-surface-variant/60">
          <History className="w-5 h-5 hover:text-tertiary cursor-pointer transition-colors" />
          <UserCircle className="w-5 h-5 hover:text-tertiary cursor-pointer transition-colors" />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-40 min-h-screen flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {step === 'entrance' && (
            <div className="glass-panel w-full p-12 lg:p-20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-40 h-40 border border-tertiary/20 rounded-full" />
                <div className="absolute bottom-10 right-10 w-60 h-60 border border-tertiary/20 rounded-full" />
              </div>
              <EntranceView details={userDetails} setDetails={setUserDetails} onSubmit={startReading} />
            </div>
          )}
          {step === 'shuffling' && (
            <div className="glass-panel w-full p-20 flex flex-col items-center justify-center min-h-[600px]">
              <ShufflingView />
            </div>
          )}
          {step === 'reading' && reading && (
            <div className="glass-panel w-full p-12 lg:p-20">
              <ReadingView reading={reading} userDetails={userDetails} onReset={reset} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Stats - Thematic Alignment */}
      <footer className="fixed bottom-10 w-full flex justify-center gap-12 z-50 pointer-events-none opacity-60">
        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40 mb-1">Entropy Source</span>
          <span className="font-mono text-[11px] text-on-surface-variant">WebCrypto_v2</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40 mb-1">Shuffle Algorithm</span>
          <span className="font-mono text-[11px] text-on-surface-variant">Fisher-Yates_Native</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40 mb-1">Archive Integrity</span>
          <span className="font-mono text-[11px] text-on-surface-variant">Secure_v1.0.4</span>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-2 transition-all cursor-pointer ${active ? 'text-tertiary bg-surface-container-high/50 rounded-full ring-1 ring-tertiary/20' : 'text-on-surface-variant/60 hover:text-primary-fixed-dim hover:opacity-100'}`}>
      {icon}
      <span className="text-[10px] uppercase font-medium tracking-widest mt-1">{label}</span>
    </div>
  );
}

interface EntranceProps {
  details: UserDetails,
  setDetails: (d: UserDetails) => void,
  onSubmit: (e: React.FormEvent) => void
}

function EntranceView({ details, setDetails, onSubmit }: EntranceProps) {
  return (
    <motion.div 
      key="entrance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full space-y-16"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <p className="font-label text-xs uppercase tracking-[0.4em] text-tertiary/60">The Temple of Arcana</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-widest leading-none uppercase text-tertiary drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          The Temporal Path
        </h1>
        <p className="text-on-background/60 font-body text-sm uppercase tracking-[0.2em] max-w-lg mx-auto">
          Through the gateway of intention, three cards shall weave the narrative of your essence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-12">
          <form className="space-y-12" onSubmit={onSubmit}>
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Soul's Designation</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background placeholder:text-on-surface-variant/20 transition-all outline-none"
                    placeholder="NAME"
                    value={details.name}
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Solar Alignment</label>
                  <input 
                    type="date"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background transition-all outline-none"
                    value={details.dob}
                    onChange={e => setDetails({ ...details, dob: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Query to the Infinite</label>
                <textarea 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background placeholder:text-on-surface-variant/20 transition-all outline-none resize-none"
                  placeholder="WHAT SEEK YE?"
                  rows={4}
                  value={details.question}
                  onChange={e => setDetails({ ...details, question: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                type="submit"
                className="gold-shimmer px-16 py-5 rounded-full font-serif font-bold tracking-[0.3em] uppercase text-xs hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4 group"
              >
                Invoke Secrets
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="border border-tertiary/20 rounded-3xl p-10 bg-tertiary/5 relative overflow-hidden group">
            <div className="relative z-10">
              <Star className="text-tertiary w-8 h-8 mb-6 opacity-80" />
              <h3 className="font-serif text-2xl mb-4 tracking-wider uppercase text-tertiary">Cosmic Flux</h3>
              <p className="text-on-surface-variant/70 text-sm leading-relaxed mb-8">The celestial strings are vibrating at frequency 432Hz. This is an optimal moment for introspective revelations.</p>
              <div className="flex items-center gap-3 text-tertiary/60">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-mono">Archive Access: OPEN</span>
              </div>
            </div>
            <Moon className="absolute -bottom-10 -right-10 text-tertiary/5 w-40 h-40 group-hover:rotate-12 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShufflingView() {
  return (
    <motion.div 
      key="shuffling"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center space-y-16"
    >
      <div className="relative w-64 h-96 perspective-1000">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: [i * -3, i * 3, i * -3],
              x: [i * -8, i * 8, i * -8],
              y: [i * 3, i * -3, i * 3],
              rotateY: [0, 10, 0]
            }}
            transition={{ 
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 tarot-card-theme flex items-center justify-center"
            style={{ zIndex: 10 - i }}
          >
            <div className="w-full h-full m-3 border border-tertiary/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
               <div className="w-20 h-20 rounded-full bg-tertiary/10 flex items-center justify-center mb-8 ring-1 ring-tertiary/20">
                 <Sparkles className="w-10 h-10 text-tertiary opacity-40 animate-pulse" />
               </div>
               <p className="font-serif text-tertiary/40 text-[9px] tracking-[0.5em] uppercase font-bold">The Archive</p>
               <Sun className="absolute top-4 left-4 w-4 h-4 text-tertiary/10" />
               <Sun className="absolute top-4 right-4 w-4 h-4 text-tertiary/10" />
               <Sun className="absolute bottom-4 left-4 w-4 h-4 text-tertiary/10" />
               <Sun className="absolute bottom-4 right-4 w-4 h-4 text-tertiary/10" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-6">
        <h1 className="font-serif text-3xl md:text-4xl text-tertiary tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]">
          Interpreting the Flux
        </h1>
        <p className="font-mono text-on-surface-variant/40 text-[10px] uppercase tracking-[0.4em]">
          Aligning with your signature...
        </p>
      </div>
    </motion.div>
  );
}

function ReadingView({ reading, userDetails, onReset }: { reading: ReadingResult, userDetails: UserDetails, onReset: () => void }) {
  return (
    <motion.div 
      key="reading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-24 w-full pt-12"
    >
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-tertiary/60 block">The Temporal Path Revealed</span>
        <h1 className="font-serif text-5xl md:text-6xl text-tertiary tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">Three Card Spread</h1>
        <p className="text-on-background/40 font-body text-sm uppercase tracking-[0.2em] italic">"{userDetails.question}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 items-stretch">
        {reading.cards.map((pos, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="group relative aspect-[2/3.2] tarot-card-theme p-4 overflow-hidden mb-8">
              <div className="absolute inset-4 border border-tertiary/10 rounded-lg pointer-events-none z-20" />
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <img 
                  src={pos.card.image} 
                  alt={pos.card.name} 
                  className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#050208] via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute top-8 left-0 w-full flex justify-center z-30">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 bg-tertiary/10 backdrop-blur-xl rounded-full border border-tertiary/20 text-tertiary">
                  {pos.label}
                </span>
              </div>
              <div className="absolute bottom-10 left-0 w-full px-6 text-center z-30">
                <h2 className="font-serif text-2xl text-tertiary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">{pos.card.name}</h2>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center">
              <p className="text-on-background/60 text-xs font-body tracking-[0.1em] leading-relaxed italic uppercase opacity-80">
                {pos.insight}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="mt-40 max-w-4xl mx-auto p-12 lg:p-20 bg-white/[0.02] rounded-[40px] border border-tertiary/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-tertiary/30 to-transparent" />
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-10">
            <Sparkles className="text-tertiary/40 w-12 h-12" />
          </div>
          <h3 className="font-serif text-3xl text-tertiary mb-10 tracking-[0.2em] uppercase">The Spirits' Revelation</h3>
          <div className="max-w-2xl mx-auto">
            <p className="text-on-background/90 text-lg md:text-xl leading-relaxed font-serif tracking-wide italic">
              {reading.spiritsAnswer}
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 pb-12">
        <button 
          onClick={onReset}
          className="border border-tertiary text-tertiary px-12 py-5 rounded-full font-serif font-bold tracking-[0.3em] uppercase text-xs hover:bg-tertiary/10 active:scale-95 transition-all flex items-center gap-4 group"
        >
          Reset Session
        </button>
        <button 
          onClick={onReset}
          className="gold-shimmer px-12 py-5 rounded-full font-serif font-bold tracking-[0.3em] uppercase text-xs hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-4"
        >
          Seek Next Vision
          <CloudLightning className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
