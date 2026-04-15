import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, ArrowRight, CheckCircle2, Shield } from 'lucide-react';

interface Level1Props {
  onComplete: () => void;
  key?: string;
}

export const Level1 = ({ onComplete }: Level1Props) => {
  const [step, setStep] = useState<'explanation' | 'challenge' | 'success'>('explanation');
  const [isFragmented, setIsFragmented] = useState(false);
  const [placedFragments, setPlacedFragments] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);

  const fragments = [
    { id: 1, color: 'bg-blue-500' },
    { id: 2, color: 'bg-purple-500' },
    { id: 3, color: 'bg-indigo-500' },
    { id: 4, color: 'bg-cyan-500' },
  ];

  const handleFragment = () => {
    setIsFragmented(true);
  };

  const handleDrop = (id: number) => {
    if (!placedFragments.includes(id)) {
      setPlacedFragments([...placedFragments, id]);
      if (placedFragments.length + 1 === fragments.length) {
        setTimeout(() => setStep('success'), 1000);
      }
    }
  };

  return (
    <div className="z-10 w-full max-w-4xl px-4 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {step === 'explanation' && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel p-10 max-w-3xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-accent-blue uppercase tracking-wider flex items-center gap-4">
              <Box className="w-10 h-10" /> Fase 1: Fragmentação
            </h2>
            <div className="space-y-6 text-xl text-text-light leading-relaxed">
              <p>
                A informação digital (uma foto, um áudio ou um site) é geralmente grande demais para ser enviada de uma só vez. 
                Se tentássemos enviar um arquivo inteiro e ocorresse uma pequena falha no cabo, teríamos que recomeçar do zero.
              </p>
              <p>
                O que acontece: O computador divide o arquivo em pedaços minúsculos chamados <strong className="text-accent-blue">Pacotes</strong>. 
                Imagine enviar um livro de 500 páginas pelo correio, mas em vez de uma caixa grande, você envia 500 envelopes separados, cada um com uma página.
              </p>
              <p className="text-text-muted italic">
                Para compreender melhor, vamos usar o conceito de fragmentação na prática.
              </p>
            </div>
            <button 
              onClick={() => setStep('challenge')}
              className="mt-10 w-full btn-primary"
            >
              INICIAR DESAFIO
            </button>
          </motion.div>
        )}

        {step === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Desafio Espacial</h3>
              <p className="text-slate-400">
                {!isFragmented 
                  ? "Arraste o satélite para dentro do foguete para enviá-lo à órbita." 
                  : "Arraste os pacotes de dados (fragmentos) para as aberturas do foguete."}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-around w-full gap-12">
              {/* Source Area */}
              <div className="flex flex-col items-center gap-6 min-h-[300px] justify-center">
                {!isFragmented ? (
                  <motion.div
                    drag
                    dragMomentum={false}
                    dragElastic={0.1}
                    whileDrag={{ scale: 1.1, zIndex: 100 }}
                    onDragEnd={(_, info) => {
                      // Check if dropped near rocket (right side of screen)
                      if (info.point.x > window.innerWidth * 0.6) {
                        setShowError(true);
                        setTimeout(() => setShowError(false), 3000);
                      }
                    }}
                    className="w-52 h-52 bg-slate-50 border-4 border-slate-200 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl relative overflow-visible group z-50"
                  >
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      {/* Solar Panels Wings */}
                      <div className="absolute left-[-50px] w-16 h-28 bg-sky-600 border-2 border-sky-800 rounded-sm grid grid-cols-2 grid-rows-4 gap-1 p-1 shadow-lg">
                        {[...Array(8)].map((_, i) => <div key={i} className="bg-sky-400/40 border border-sky-300/30" />)}
                      </div>
                      <div className="absolute right-[-50px] w-16 h-28 bg-sky-600 border-2 border-sky-800 rounded-sm grid grid-cols-2 grid-rows-4 gap-1 p-1 shadow-lg">
                        {[...Array(8)].map((_, i) => <div key={i} className="bg-sky-400/40 border border-sky-300/30" />)}
                      </div>
                      
                      {/* Connecting Arms */}
                      <div className="absolute w-32 h-2 bg-slate-600 z-0" />

                      {/* Satellite Main Body (Gold Foil Look) */}
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-700 border-2 border-yellow-800 rounded-lg relative z-10 shadow-xl flex items-center justify-center">
                        <div className="absolute inset-1 border border-white/20 rounded-sm" />
                        {/* Sensors/Details */}
                        <div className="absolute top-2 left-2 w-3 h-3 bg-slate-800 rounded-full border border-slate-400" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-500 animate-pulse rounded-full shadow-[0_0_5px_red]" />
                      </div>

                      {/* Parabolic Dish */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <div className="w-16 h-8 bg-slate-300 border-2 border-slate-500 rounded-t-full relative shadow-md">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-600" />
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-400 border border-slate-600 rounded-full" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center rounded-b-lg">
                      <div className="text-[10px] font-black uppercase tracking-[2px] text-white">Satélite Alpha</div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {fragments.map((frag) => (
                      !placedFragments.includes(frag.id) && (
                        <motion.div
                          key={frag.id}
                          layoutId={`frag-${frag.id}`}
                          drag
                          dragMomentum={false}
                          whileDrag={{ scale: 1.1, zIndex: 100 }}
                          onDragEnd={(_, info) => {
                            if (info.point.x > window.innerWidth * 0.6) {
                              handleDrop(frag.id);
                            }
                          }}
                          className="w-24 h-24 bg-white border-4 border-accent-blue rounded-xl flex flex-col items-center justify-center shadow-md cursor-grab active:cursor-grabbing group relative overflow-hidden z-50"
                        >
                          <div className="absolute inset-0 bg-accent-blue/5" />
                          <span className="text-[10px] font-black text-accent-blue opacity-50">FRAGMENTO {frag.id}</span>
                          <Shield className="w-8 h-8 text-accent-blue/40 mt-1" />
                        </motion.div>
                      )
                    ))}
                  </div>
                )}

                {showError && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-accent-blue text-accent-blue px-6 py-4 rounded-xl text-sm text-center max-w-[220px] shadow-2xl z-50"
                  >
                    <p className="font-bold mb-3 uppercase tracking-tighter">Erro: Grande demais!</p>
                    <button 
                      onClick={handleFragment}
                      className="w-full btn-primary py-2 text-xs"
                    >
                      FRAGMENTAR
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Destination Area */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={step === 'success' ? { y: -1000, opacity: 0 } : {}}
                  transition={{ duration: 2, ease: "easeIn" }}
                  className="relative group"
                >
                  {/* Rocket Body */}
                  <div className="w-64 h-[480px] relative bg-slate-100 border-4 border-accent-blue rounded-t-[140px] rounded-b-[40px] flex flex-col items-center pt-24 gap-4 overflow-visible shadow-2xl z-20">
                    {/* Rocket Window */}
                    <div className="absolute top-8 w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
                      <div className="w-full h-full bg-gradient-to-tr from-sky-400 to-white opacity-40" />
                    </div>

                    {/* Fragment Slots */}
                    {fragments.map((frag) => (
                      <div 
                        key={frag.id}
                        className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all z-10
                          ${placedFragments.includes(frag.id) ? 'bg-accent-purple border-transparent text-white font-bold shadow-lg scale-105' : 'border-accent-blue/30 bg-white/50'}
                        `}
                      >
                        {placedFragments.includes(frag.id) ? (
                          <>
                            <span className="text-[8px] opacity-70">FRAGMENTO</span>
                            <span className="text-lg">{frag.id}</span>
                          </>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-dashed border-accent-blue/20" />
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-auto mb-10 font-black text-accent-blue text-[10px] uppercase tracking-[2px] bg-white/80 px-4 py-1 rounded-full z-10">
                      Transporte de Dados
                    </div>

                    {/* Rocket Fins */}
                    <div className="absolute -left-12 bottom-0 w-16 h-32 bg-accent-blue rounded-l-full rounded-t-full -z-10 border-l-4 border-t-4 border-slate-300" />
                    <div className="absolute -right-12 bottom-0 w-16 h-32 bg-accent-blue rounded-r-full rounded-t-full -z-10 border-r-4 border-t-4 border-slate-300" />
                    
                    {/* Rocket Engine/Thruster */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-800 rounded-b-xl border-x-4 border-b-4 border-slate-400" />
                  </div>

                  {/* Fire/Smoke Animation when launching */}
                  {step === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.2 }}
                      className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-24 h-40 bg-gradient-to-b from-orange-500 via-yellow-400 to-transparent rounded-full blur-md"
                    />
                  )}
                </motion.div>
                
                {/* Launch Pad */}
                <div className="h-6 w-80 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 rounded-full mt-4 shadow-xl border-t-2 border-slate-500" />
                <div className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Plataforma de Lançamento 01</div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <CheckCircle2 className="w-24 h-24 text-emerald-400" />
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-4">Parabéns!</h2>
            <p className="text-xl text-slate-300 mb-8">
              O satélite foi fragmentado e enviado com sucesso! <br/>
              Você liberou a primeira parte da mensagem.
            </p>
            <div className="bg-indigo-500/20 border border-indigo-500/50 p-6 rounded-2xl mb-8 inline-block">
              <span className="text-2xl font-mono text-indigo-300">"A internet "</span>
            </div>
            <button 
              onClick={onComplete}
              className="block w-full btn-primary"
            >
              VOLTAR AO MENU
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
