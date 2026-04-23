import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puzzle, CheckCircle2, MessageSquare, AlertTriangle, Keyboard, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

interface Level4Props {
  onComplete: () => void;
  onBack: () => void;
  key?: string;
}

interface Part {
  id: number;
  text: string;
  original: string;
  isCorrupted: boolean;
}

interface Challenge {
  title: string;
  parts: Part[];
}

const CHALLENGES: Challenge[] = [
  {
    title: "Conexão Global",
    parts: [
      { id: 1, text: "A INT3RN3T", original: "A INTERNET", isCorrupted: true },
      { id: 2, text: "CONECTA", original: "CONECTA", isCorrupted: false },
      { id: 3, text: "O MUND0", original: "O MUNDO", isCorrupted: true },
      { id: 4, text: "T0D0", original: "TODO", isCorrupted: true },
    ]
  },
  {
    title: "Fluxo de Pacotes",
    parts: [
      { id: 1, text: "DADOS SÃO", original: "DADOS SÃO", isCorrupted: false },
      { id: 2, text: "ENV1AD0S", original: "ENVIADOS", isCorrupted: true },
      { id: 3, text: "EM P3QU3N0S", original: "EM PEQUENOS", isCorrupted: true },
      { id: 4, text: "P4C0T3S", original: "PACOTES", isCorrupted: true },
    ]
  },
  {
    title: "Roteamento de Dados",
    parts: [
      { id: 1, text: "R0T3AD0R3S", original: "ROTEADORES", isCorrupted: true },
      { id: 2, text: "ESCOLHEM O", original: "ESCOLHEM O", isCorrupted: false },
      { id: 3, text: "M3LH0R", original: "MELHOR", isCorrupted: true },
      { id: 4, text: "C4M1NH0", original: "CAMINHO", isCorrupted: true },
    ]
  },
  {
    title: "Gestão de Buffer",
    parts: [
      { id: 1, text: "O BUFF3R", original: "O BUFFER", isCorrupted: true },
      { id: 2, text: "ORG4N1Z4", original: "ORGANIZA", isCorrupted: true },
      { id: 3, text: "A CHEGADA", original: "A CHEGADA", isCorrupted: false },
      { id: 4, text: "D0S DAD0S", original: "DOS DADOS", isCorrupted: true },
    ]
  },
  {
    title: "Integridade Total",
    parts: [
      { id: 1, text: "S3GUR4NÇ4", original: "SEGURANÇA", isCorrupted: true },
      { id: 2, text: "E INT3GR1D4D3", original: "E INTEGRIDADE", isCorrupted: true },
      { id: 3, text: "SÃO", original: "SÃO", isCorrupted: false },
      { id: 4, text: "FUND4M3NT41S", original: "FUNDAMENTAIS", isCorrupted: true },
    ]
  }
];

export const Level4 = ({ onComplete, onBack }: Level4Props) => {
  const [step, setStep] = useState<'explanation' | 'regeneration' | 'challenge' | 'success'>('explanation');
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [verifiedIds, setVerifiedIds] = useState<number[]>([]);
  const [activeFixId, setActiveFixId] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');
  const [order, setOrder] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);
  const [shuffledParts, setShuffledParts] = useState<Part[]>([]);

  const currentChallenge = CHALLENGES[currentChallengeIdx];

  useEffect(() => {
    if (step === 'challenge') {
      const shuffled = [...currentChallenge.parts].sort(() => Math.random() - 0.5);
      setShuffledParts(shuffled);
    }
  }, [step, currentChallengeIdx, currentChallenge.parts]);

  const handleStartFix = (id: number) => {
    const part = currentChallenge.parts.find(p => p.id === id);
    if (part && !verifiedIds.includes(id)) {
      if (part.isCorrupted) {
        setActiveFixId(id);
        setUserInput('');
        setShowError(false);
      } else {
        // If it's already correct, just verify it
        setVerifiedIds(prev => [...prev, id]);
        checkAllVerified([...verifiedIds, id]);
      }
    }
  };

  const handleCheckFix = (id: number) => {
    const part = currentChallenge.parts.find(p => p.id === id);
    if (part && userInput.toUpperCase().trim() === part.original) {
      const newVerifiedIds = [...verifiedIds, id];
      setVerifiedIds(newVerifiedIds);
      setActiveFixId(null);
      checkAllVerified(newVerifiedIds);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const checkAllVerified = (currentVerified: number[]) => {
    if (currentVerified.length === currentChallenge.parts.length) {
      setTimeout(() => setStep('challenge'), 800);
    }
  };

  const handlePartClick = (id: number) => {
    if (!order.includes(id)) {
      const newOrder = [...order, id];
      setOrder(newOrder);
      
      if (newOrder.length === currentChallenge.parts.length) {
        const isCorrect = newOrder.every((val, index) => val === index + 1);
        if (isCorrect) {
          if (currentChallengeIdx < CHALLENGES.length - 1) {
            setTimeout(() => {
              setCurrentChallengeIdx(prev => prev + 1);
              setVerifiedIds([]);
              setOrder([]);
              setStep('regeneration');
            }, 1000);
          } else {
            setTimeout(() => setStep('success'), 1000);
          }
        } else {
          setTimeout(() => setOrder([]), 1000);
        }
      }
    }
  };

  return (
    <div className="z-10 w-full max-w-5xl px-4 flex flex-col items-center relative">
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
              <Puzzle className="w-10 h-10" /> Fase 4: Remontagem
            </h2>
            <div className="space-y-6 text-xl text-text-light leading-relaxed">
              <p className="text-justify">
                Os pacotes chegaram, mas o canal de comunicação está instável. Alguns fragmentos sofreram interferência e outros estão intactos.
              </p>
              <p className="text-justify">
                <strong className="text-accent-blue">Seu Desafio:</strong> Identifique quais fragmentos estão com caracteres incorretos, clique neles e digite a versão corrigida.
              </p>
              <p className="text-text-muted text-justify">
                Você enfrentará 5 sequências de dados. Após regenerar cada uma, coloque os blocos na ordem correta para prosseguir.
              </p>
            </div>
            <button 
              onClick={() => setStep('regeneration')}
              className="mt-10 w-full btn-primary"
            >
              INICIAR MISSÃO
            </button>
          </motion.div>
        )}

        {step === 'regeneration' && (
          <motion.div
            key="regeneration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <div className="text-[10px] font-black text-accent-blue uppercase tracking-[4px] mb-2">Desafio {currentChallengeIdx + 1} de 5</div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{currentChallenge.title}</h3>
              <p className="text-slate-700 font-medium">Encontre e corrija os fragmentos danificados.</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${currentChallenge.parts.length > 3 ? '2' : '3'} gap-6 w-full max-w-5xl`}>
              {currentChallenge.parts.map((part) => (
                <div key={part.id} className="relative">
                  <motion.button
                    onClick={() => handleStartFix(part.id)}
                    disabled={activeFixId !== null}
                    whileHover={!verifiedIds.includes(part.id) && activeFixId === null ? { scale: 1.02 } : {}}
                    className={`w-full p-8 rounded-[32px] border-4 flex flex-col items-center justify-center gap-4 transition-all relative overflow-hidden min-h-[180px]
                      ${verifiedIds.includes(part.id)
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-inner' 
                        : activeFixId === part.id
                          ? 'bg-white border-accent-blue shadow-2xl scale-105 z-30'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-accent-blue shadow-lg'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {verifiedIds.includes(part.id) ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Bloco #{part.id}</span>
                    </div>
                    
                    <span className="text-xl font-mono font-black tracking-tighter">
                      {verifiedIds.includes(part.id) ? part.original : part.text}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {activeFixId === part.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-40 bg-white rounded-[32px] p-6 flex flex-col items-center justify-center gap-4 shadow-2xl border-4 border-accent-blue"
                      >
                        <div className="text-[10px] font-black text-accent-blue uppercase tracking-widest">Corrija o fragmento:</div>
                        <input
                          autoFocus
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleCheckFix(part.id)}
                          className={`w-full bg-slate-100 border-2 rounded-xl px-4 py-3 text-center font-mono font-black text-lg focus:outline-none uppercase transition-colors
                            ${showError ? 'border-danger bg-danger/5 text-danger' : 'border-slate-200 focus:border-accent-blue text-slate-800'}
                          `}
                        />
                        <div className="flex gap-2 w-full">
                          <button 
                            onClick={() => setActiveFixId(null)}
                            className="flex-1 py-2 text-[10px] font-black uppercase bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => handleCheckFix(part.id)}
                            className="flex-1 py-2 text-[10px] font-black uppercase bg-accent-blue text-white rounded-lg hover:bg-blue-600 shadow-md"
                          >
                            Corrigir
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="text-center mb-12">
              <div className="text-[10px] font-black text-accent-purple uppercase tracking-[4px] mb-2">Fase de Montagem</div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Ordene os Fragmentos</h3>
              <p className="text-slate-700 font-medium">Coloque as partes regeneradas na sequência correta.</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-${currentChallenge.parts.length > 3 ? '2' : '3'} gap-6 w-full max-w-5xl mb-12`}>
              {shuffledParts.map((part) => {
                const id = part.id;
                const isSelected = order.includes(id);
                const selectedIndex = order.indexOf(id);

                return (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePartClick(id)}
                    className={`
                      p-8 rounded-[32px] border-4 flex flex-col items-center justify-center gap-2 transition-all relative min-h-[140px]
                      ${isSelected 
                        ? 'bg-accent-blue border-white text-white shadow-xl scale-95 opacity-50' 
                        : 'bg-white border-slate-200 text-slate-800 hover:border-accent-blue shadow-lg'}
                    `}
                  >
                    <span className="font-mono text-xl font-black tracking-tighter uppercase">{part.original}</span>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-10 h-10 bg-white text-accent-blue rounded-full flex items-center justify-center text-lg font-black shadow-md">
                        {selectedIndex + 1}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="w-full max-w-4xl glass-panel p-10 min-h-[140px] flex items-center justify-center border-dashed border-4 border-slate-300 bg-slate-50/50 rounded-[40px]">
              <div className="flex flex-wrap justify-center gap-3">
                {order.length === 0 && (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Puzzle className="w-10 h-10" />
                    <span className="text-sm font-black uppercase tracking-widest">Aguardando Sequência...</span>
                  </div>
                )}
                {order.map(id => (
                  <motion.span 
                    key={id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black text-accent-purple tracking-tighter bg-white px-6 py-3 rounded-2xl shadow-md border-2 border-accent-purple/20"
                  >
                    {currentChallenge.parts.find(p => p.id === id)?.original}
                  </motion.span>
                ))}
              </div>
            </div>

            {order.length === currentChallenge.parts.length && !order.every((val, index) => val === index + 1) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center gap-3 text-danger font-black uppercase tracking-tighter bg-danger/10 px-8 py-4 rounded-full"
              >
                <AlertTriangle className="w-6 h-6" />
                Erro de Sequência! Tente novamente.
              </motion.div>
            )}
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
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <MessageSquare className="w-32 h-32 text-emerald-500" />
            </motion.div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Último Fragmento Liberado!</h2>
            <p className="text-2xl text-slate-700 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              Você regenerou todas as sequências e restaurou a integridade da rede! <br/>
              O último fragmento do Arquivo Perdido foi desbloqueado.
            </p>
            <div className="bg-emerald-50 border-4 border-emerald-200 p-12 rounded-[48px] mb-12 inline-block shadow-2xl relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                Fragmento Desbloqueado
              </div>
              <p className="text-3xl md:text-4xl font-black text-emerald-700 tracking-tighter leading-tight">
                "passando por vários caminhos."
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="block w-full btn-primary py-8 text-2xl"
            >
              MONTAR MENSAGEM FINAL
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
