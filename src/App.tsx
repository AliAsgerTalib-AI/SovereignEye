/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, UserCircle, Sparkles, BookOpen, LineChart, Clock, Moon, CloudLightning, Star, Sun, X, Info, ChevronDown } from 'lucide-react';
import { UserDetails, TarotCard, ReadingResult, TarotLineage, TarotTheme, SpreadType } from './types';
import { getDeck, SPREADS, LINEAGES } from './constants';
import { shuffle } from './utils';
import { interpretSpread, getCardDetails } from './services/geminiService';

type Step = 'entrance' | 'shuffling' | 'reading';

export default function App() {
  const [step, setStep] = useState<Step>('entrance');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    age: '',
    question: '',
    lineage: 'rws',
    cardTheme: 'celestial-gold',
    spreadType: 'chronological',
  });
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const startReading = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('shuffling');
    
    const deck = shuffle(getDeck(userDetails.lineage));
    const schema = SPREADS.find(s => s.id === userDetails.spreadType) || SPREADS[0];
    
    // Select cards based on spread labels count
    const selected = schema.labels.map((label, index) => ({
      position: label,
      card: deck[index]
    }));

    // Start fetching interpretation and timer in parallel to prevent UI hangs
    const interpretationPromise = interpretSpread(userDetails, selected);
    const delayPromise = new Promise(resolve => setTimeout(resolve, 4000));

    try {
      const [interpretation] = await Promise.all([interpretationPromise, delayPromise]);

      setReading({
        cards: selected.map(s => ({
          ...s,
          insight: s.card.meaning,
          isRevealed: false
        })),
        spiritsAnswer: interpretation
      });
      
      setStep('reading');
    } catch (error) {
      console.error("Reading Error:", error);
      // Fallback in case of absolute failure so user isn't stuck
      setReading({
        cards: selected.map(s => ({
          ...s,
          insight: s.card.meaning,
          isRevealed: false
        })),
        spiritsAnswer: "The spirits are currently whispering in a tongue we cannot yet translate. Trust your intuition with the cards shown."
      });
      setStep('reading');
    }
  };

  const reset = () => {
    setStep('entrance');
    setReading(null);
    setSelectedCard(null);
  };

  return (
    <div className={`min-h-screen bg-background text-on-background font-body relative overflow-x-hidden flex flex-col items-center justify-center theme-${userDetails.cardTheme}`}>
      <div className="atmosphere" />
      
      {/* Header Overlay */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/30 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-white/5">
        <div className="font-serif text-2xl text-tertiary tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
          SovereignEye
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
              <ShufflingView cardCount={SPREADS.find(s => s.id === userDetails.spreadType)?.labels.length || 3} />
            </div>
          )}
          {step === 'reading' && reading && (
            <div className="glass-panel w-full p-12 lg:p-20">
              <ReadingView reading={reading} userDetails={userDetails} onReset={reset} onCardClick={setSelectedCard} setReading={setReading} />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal 
            card={selectedCard} 
            userDetails={userDetails}
            onClose={() => setSelectedCard(null)} 
          />
        )}
      </AnimatePresence>

      
    </div>
  );
}

function CardDetailModal({ card, userDetails, onClose }: { card: TarotCard, userDetails: UserDetails, onClose: () => void }) {
  const [details, setDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let active = true;
    getCardDetails(card, userDetails).then(data => {
      if (active) {
        setDetails(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [card, userDetails]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 lg:p-12 relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant/60 hover:text-tertiary transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="aspect-[2/3.2] tarot-card-theme p-4">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img 
                src={card.image} 
                alt={card.name} 
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <div className="space-y-8 h-full flex flex-col pt-12 md:pt-0">
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-60 card-accent">Archival Record</p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-widest uppercase card-accent">{card.name}</h2>
              <div className="h-[1px] w-20 bg-white/10 card-border" />
            </div>

            <div className="space-y-6 flex-1">
              <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 card-border">
                <p className="text-sm font-body tracking-[0.1em] uppercase mb-2 font-bold card-accent">Core Meaning</p>
                <p className="text-on-background/80">{card.meaning}</p>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-body tracking-[0.1em] uppercase font-bold card-accent">Deep Archive Insights</p>
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse" />
                  </div>
                ) : (
                  <div className="text-on-background/70 font-body text-sm leading-relaxed space-y-4 whitespace-pre-wrap italic">
                    {details}
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={onClose}
              className="gold-shimmer w-full py-4 rounded-full font-serif font-bold tracking-[0.3em] uppercase text-xs"
            >
              Close Inquiry
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
  const selectedLineage = LINEAGES.find(l => l.id === details.lineage);
  const selectedSpread = SPREADS.find(s => s.id === details.spreadType);

  return (
    <motion.div 
      key="entrance"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full space-y-16"
    >
      <div className="flex flex-col items-center text-center space-y-6">
         
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-widest leading-none uppercase text-tertiary drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          The Temporal Path
        </h1>
        <p className="text-on-background/60 font-body text-sm uppercase tracking-[0.2em] max-w-lg mx-auto">
          Through the gateway of intention, the cards shall weave the narrative of your essence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-12">
          <form className="space-y-12" onSubmit={onSubmit}>
            {/* Form Content */}
            <div className="space-y-10">
              {/* Lineage and Spread Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Lineage</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background appearance-none transition-all outline-none text-sm cursor-pointer"
                      value={details.lineage}
                      onChange={e => setDetails({ ...details, lineage: e.target.value as TarotLineage })}
                    >
                      <option value="marsielle" className="bg-surface-container-highest">Marseille</option>
                      <option value="rws" className="bg-surface-container-highest">RWS</option>
                      <option value="thoth" className="bg-surface-container-highest">Thoth</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary/60 pointer-events-none" />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Spread</label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background appearance-none transition-all outline-none text-sm cursor-pointer"
                      value={details.spreadType}
                      onChange={e => setDetails({ ...details, spreadType: e.target.value as SpreadType })}
                    >
                      {SPREADS.map(spread => (
                        <option key={spread.id} value={spread.id} className="bg-surface-container-highest">{spread.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary/60 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Name</label>
                  <input 
                    required
                    className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background placeholder:text-on-surface-variant/20 transition-all outline-none"
                    placeholder="NAME"
                    value={details.name}
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Age</label>
                  <input 
                    type="number"
                    min="1"
                    max="120"
                    required
                    className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background transition-all outline-none"
                    placeholder="AGE"
                    value={details.age}
                    onChange={e => setDetails({ ...details, age: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-3">Query to the Infinite</label>
                <textarea 
                  required
                  className="w-full bg-surface-container-highest border border-white/10 rounded-xl py-4 px-6 focus:ring-1 focus:ring-tertiary/40 focus:border-tertiary/40 text-on-background placeholder:text-on-surface-variant/20 transition-all outline-none resize-none"
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

        {/* Expectations Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel p-8 space-y-8 border-tertiary/10 bg-white/[0.02]">
            <div className="space-y-2">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-tertiary/60">Archetype & Pattern</h3>
              <p className="text-sm font-serif italic text-on-background/40">Visualizing the selected ritual path...</p>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={details.lineage}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-tertiary/40 border-b border-white/5 pb-2">Lineage Dynamics</p>
                  <h4 className="font-serif text-lg text-tertiary">{selectedLineage?.name}</h4>
                  <p className="text-xs text-on-background/60 leading-relaxed font-body italic">
                    {selectedLineage?.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={details.spreadType}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-tertiary/40 border-b border-white/5 pb-2">Spread Blueprint</p>
                  <h4 className="font-serif text-lg text-tertiary">{selectedSpread?.name}</h4>
                  <p className="text-xs text-on-background/60 leading-relaxed font-body italic">
                    {selectedSpread?.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedSpread?.labels.map((label, i) => (
                      <span key={i} className="text-[8px] uppercase tracking-[0.2em] font-mono px-2 py-1 bg-white/5 rounded-full border border-white/5 text-on-background/40">
                        {label}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 bg-tertiary/5 p-4 rounded-xl border border-tertiary/10">
                <Info className="w-4 h-4 text-tertiary/60 mt-0.5" />
                <p className="text-[10px] text-on-background/50 leading-relaxed uppercase tracking-widest font-mono">
                  The selected combination will define the depth and narrative structure of the AI interpretative engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ShufflingView({ cardCount }: { cardCount: number }) {
  return (
    <motion.div 
      key="shuffling"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center space-y-16 py-20"
    >
      <div className="relative w-64 h-96 perspective-1000">
        {/* Particle Bursts Layer */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-tertiary/20 blur-xl"
            initial={{ width: 0, height: 0, x: "50%", y: "50%", opacity: 0 }}
            animate={{ 
              width: [0, 40, 0],
              height: [0, 40, 0],
              x: ["50%", `${20 + Math.random() * 60}%`],
              y: ["50%", `${20 + Math.random() * 60}%`],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          />
        ))}

        {[...Array(cardCount)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: [i * -3, i * 3, i * -3],
              x: [i * -8, i * 8, i * -8],
              y: [i * 3, i * -3, i * 3],
              rotateY: [0, 15, 0],
              filter: [
                "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))",
                "brightness(1.2) drop-shadow(0 0 15px rgba(255,215,0,0.3))",
                "brightness(1) drop-shadow(0 0 0px rgba(255,215,0,0))"
              ]
            }}
            transition={{ 
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 tarot-card-theme flex items-center justify-center rounded-xl overflow-hidden"
            style={{ zIndex: 50 - i }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="w-full h-full m-3 border border-white/10 rounded-lg flex flex-col items-center justify-center relative overflow-hidden card-border bg-black/40 backdrop-blur-[2px]">
               <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-8 ring-1 ring-white/10 card-border relative">
                 <motion.div 
                    className="absolute inset-0 rounded-full bg-tertiary/20 blur-md"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 />
                 <Sparkles className="w-10 h-10 opacity-40 animate-pulse card-accent relative z-10" />
               </div>
               <p className="font-serif text-[9px] tracking-[0.5em] uppercase font-bold opacity-40 card-accent">The Archive</p>
               <Sun className="absolute top-4 left-4 w-4 h-4 opacity-10 card-accent" />
               <Sun className="absolute top-4 right-4 w-4 h-4 opacity-10 card-accent" />
               <Sun className="absolute bottom-4 left-4 w-4 h-4 opacity-10 card-accent" />
               <Sun className="absolute bottom-4 right-4 w-4 h-4 opacity-10 card-accent" />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="space-y-6">
        <motion.h1 
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif text-3xl md:text-4xl text-tertiary tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]"
        >
          Interpreting the Flux
        </motion.h1>
        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-on-surface-variant/40 text-[10px] uppercase tracking-[0.4em]">
            Aligning with your signature...
          </p>
          <div className="w-32 h-[1px] bg-white/5 relative overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-tertiary/40"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ReadingView({ reading, userDetails, onReset, onCardClick, setReading }: { 
  reading: ReadingResult, 
  userDetails: UserDetails, 
  onReset: () => void, 
  onCardClick: (card: TarotCard) => void,
  setReading: React.Dispatch<React.SetStateAction<ReadingResult | null>>
}) {
  const toggleReveal = (index: number) => {
    if (!reading) return;
    const newCards = [...reading.cards];
    newCards[index] = { ...newCards[index], isRevealed: !newCards[index].isRevealed };
    setReading({ ...reading, cards: newCards });
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 items-stretch">
        {reading.cards.map((pos, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="perspective-1000 aspect-[2/3.2] mb-8 relative group">
              <motion.div
                initial={false}
                animate={{ rotateY: pos.isRevealed ? 0 : 180 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
                className="w-full h-full relative preserve-3d cursor-pointer"
                onClick={() => {
                  if (!pos.isRevealed) {
                    toggleReveal(i);
                  } else {
                    onCardClick(pos.card);
                  }
                }}
              >
                {/* Front Side (Face Up) */}
                <div className="absolute inset-0 backface-hidden z-10">
                  <div className="tarot-card-theme p-4 w-full h-full overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_50px_rgba(255,215,0,0.2)] transition-shadow">
                    <div className="absolute inset-4 border border-tertiary/10 rounded-lg pointer-events-none z-20" />
                    <div className="w-full h-full rounded-lg overflow-hidden relative">
                      <img 
                        src={pos.card.image} 
                        alt={pos.card.name} 
                        className="w-full h-full object-cover opacity-70 grayscale-[0.2]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#050208] via-transparent to-transparent opacity-80" />
                      
                      {/* Info Overlay on Hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-40 bg-background/20 backdrop-blur-[2px]">
                        <div className="bg-tertiary/20 backdrop-blur-md rounded-full p-4 border border-tertiary/40">
                          <Info className="w-6 h-6 text-tertiary" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-8 left-0 w-full flex justify-center z-30">
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em] px-4 py-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 card-border card-accent">
                        {pos.label}
                      </span>
                    </div>
                    <div className="absolute bottom-10 left-0 w-full px-6 text-center z-30">
                      <h2 className="font-serif text-2xl tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] card-accent">{pos.card.name}</h2>
                    </div>
                  </div>
                </div>

                {/* Back Side (Face Down) */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180 z-0"
                >
          <div className="tarot-card-theme p-3 w-full h-full bg-linear-to-br from-background to-black border-white/10 shadow-[0_0_30px_rgba(255,215,0,0.05)] hover:shadow-[0_0_40px_rgba(255,215,0,0.15)] transition-shadow">
            <div className="w-full h-full m-1 border rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-white/[0.02] card-border">
               <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 card-border">
                 <Sparkles className="w-8 h-8 opacity-30 animate-pulse card-accent" />
               </div>
               <p className="font-serif text-[8px] tracking-[0.6em] uppercase font-bold mb-4 opacity-30 card-accent">The Archive</p>
               <div className="h-[1px] w-12 bg-white/10 card-border" />
               
               <Sun className="absolute top-4 left-4 w-3 h-3 opacity-5 card-accent" />
               <Sun className="absolute top-4 right-4 w-3 h-3 opacity-5 card-accent" />
               <Sun className="absolute bottom-4 left-4 w-3 h-3 opacity-5 card-accent" />
               <Sun className="absolute bottom-4 right-4 w-3 h-3 opacity-5 card-accent" />

               {/* Reveal Label Overlay (Bottom) */}
               <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-40">
                 <span className="font-mono text-[8px] uppercase tracking-[0.3em] card-accent">Tap to Reveal</span>
               </div>
            </div>
          </div>
                </div>
              </motion.div>
            </div>
            
            <AnimatePresence>
              {pos.isRevealed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col justify-center text-center px-4"
                >
                  <p className="text-on-background/60 text-xs font-body tracking-[0.1em] leading-relaxed italic uppercase opacity-80">
                    {pos.insight}
                  </p>
                  <button 
                    onClick={() => toggleReveal(i)}
                    className="mt-4 text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-colors flex items-center justify-center gap-2 card-accent"
                  >
                    <Moon className="w-3 h-3" /> Hide
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
