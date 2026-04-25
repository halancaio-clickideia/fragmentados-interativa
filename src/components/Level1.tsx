import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Box, ArrowRight, CheckCircle2, Shield, ArrowLeft, Rocket } from 'lucide-react';

interface Level1Props {
  onComplete: () => void;
  onBack: () => void;
  key?: string;
}

export const Level1 = ({ onComplete, onBack }: Level1Props) => {
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
    setShowError(false);
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
    <div className="z-10 w-full max-w-4xl px-4 flex flex-col items-center relative">
      <button 
        onClick={onBack}
        className="mb-6 self-start flex items-center gap-2 text-slate-600 hover:text-accent-blue transition-colors uppercase text-[10px] font-black tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
      </button>
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
              <Rocket className="w-10 h-10" /> Fase 1: Fragmentação
            </h2>
            <div className="space-y-6 text-xl text-text-light leading-relaxed mb-8">
              <p className="text-justify">
                A informação digital (uma foto, um áudio ou um site) é geralmente grande demais para ser enviada de uma só vez. 
                Se tentássemos enviar um arquivo inteiro e ocorresse uma pequena falha no cabo, teríamos que recomeçar do zero.
              </p>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-square bg-white rounded-3xl flex items-center justify-center border-2 border-slate-100 relative overflow-hidden group shrink-0 shadow-lg">
                  <img 
                    src="/network_diagram.png" 
                    alt="Diagrama de Redes" 
                    className="w-full h-full object-cover z-10" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="flex-1 text-justify">
                  O que acontece: O computador divide o arquivo em pedaços minúsculos chamados <strong className="text-accent-blue">Pacotes</strong>. 
                  Imagine enviar um livro de 500 páginas pelo correio, mas em vez de uma caixa grande, você envia 500 envelopes separados, cada um com uma página.
                </p>
              </div>

              <p className="text-text-muted text-justify">
                Para compreender melhor, vamos usar o conceito de fragmentação na prática.
              </p>
            </div>
            <button 
              onClick={() => setStep('challenge')}
              className="mt-4 w-full btn-primary"
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Desafio Espacial</h3>
              <p className="text-slate-600 font-medium">
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
                    dragElastic={0.05}
                    whileDrag={{ scale: 1.05, zIndex: 100 }}
                    onDragEnd={(_, info) => {
                      // Check if dropped near rocket (right side of screen)
                      // Using a slightly more robust check or simply checking x coordinate
                      if (info.point.x > window.innerWidth * 0.55) {
                        setShowError(true);
                      }
                    }}
                    className="w-64 h-64 flex items-center justify-center cursor-grab active:cursor-grabbing relative group z-50 touch-none"
                  >
                    <motion.img 
                      src="/satellite.png" 
                      alt="Satélite" 
                      animate={{ 
                        y: [0, -15, 0],
                        rotate: [0, 2, 0]
                      }}
                      transition={{ 
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="w-56 h-56 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-none" 
                      referrerPolicy="no-referrer"
                    />
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
                    className="bg-white border-2 border-accent-blue text-accent-blue px-6 py-6 rounded-2xl text-sm text-center max-w-[300px] shadow-2xl z-50"
                  >
                    <p className="font-black mb-2 uppercase tracking-tighter text-base">Capacidade máxima excedida</p>
                    <p className="text-slate-600 font-medium mb-4 leading-tight">
                      O compartimento de carga do foguete não suporta o tamanho total do satélite para lançamento. Você deve fragmentá-lo para conseguir <span className="whitespace-nowrap">lançar o objeto.</span>
                    </p>
                    <button 
                      onClick={handleFragment}
                      className="w-full btn-primary py-3 text-xs"
                    >
                      FRAGMENTAR SATÉLITE
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
                  {/* Rocket Container */}
                  <div className="w-72 h-[520px] relative flex flex-col items-center pt-56 gap-2 overflow-visible z-20 translate-y-12">
                    {/* New Rocket Image from Attachment */}
                    <img 
                      src="/rocket.png" 
                      alt="Foguete de Transporte" 
                      className="absolute inset-0 w-full h-full object-contain -z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Fragment Slots - Only visible after fragmented */}
                    {isFragmented && (
                      <div className="flex flex-col gap-1.5 z-10">
                        {fragments.map((frag) => (
                          <div 
                            key={frag.id}
                            className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center transition-all
                              ${placedFragments.includes(frag.id) ? 'bg-accent-purple border-transparent text-white font-bold shadow-lg scale-110' : 'border-accent-blue/20 bg-white/30 backdrop-blur-sm'}
                            `}
                          >
                            {placedFragments.includes(frag.id) ? (
                              <>
                                <span className="text-[5px] opacity-70 leading-none">FRAG</span>
                                <span className="text-xs leading-tight">{frag.id}</span>
                              </>
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-dashed border-accent-blue/20" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
                <div className="text-[10px] font-bold text-slate-600 mt-2 uppercase tracking-widest">Plataforma de Lançamento 01</div>
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
              <CheckCircle2 className="w-24 h-24 text-emerald-500" />
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Parabéns!</h2>
            <p className="text-xl text-slate-700 mb-8 font-medium">
              O satélite foi fragmentado e enviado com sucesso! <br/>
              Você liberou a primeira parte da mensagem.
            </p>
            <div className="bg-indigo-500/20 border border-indigo-500/50 p-6 rounded-2xl mb-8 inline-block">
              <span className="text-2xl font-mono text-indigo-300">"Tô estudando redes hoje,"</span>
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
