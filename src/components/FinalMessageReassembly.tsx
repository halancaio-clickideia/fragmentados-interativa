import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Puzzle, CheckCircle2, AlertTriangle, Trophy, ArrowLeft } from 'lucide-react';

interface FinalMessageReassemblyProps {
  onComplete: () => void;
  onBack: () => void;
  key?: string;
}

const FINAL_PARTS = [
  { id: 1, text: "OS DADOS SÃO" },
  { id: 2, text: "FRAGMENTADOS E" },
  { id: 3, text: "ENVIADOS ATRAVÉS DE" },
  { id: 4, text: "MÚLTIPLOS CAMINHOS" },
];

export const FinalMessageReassembly = ({ onComplete, onBack }: FinalMessageReassemblyProps) => {
  const [order, setOrder] = useState<number[]>([]);
  const [shuffledParts, setShuffledParts] = useState<typeof FINAL_PARTS>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const shuffled = [...FINAL_PARTS].sort(() => Math.random() - 0.5);
    setShuffledParts(shuffled);
  }, []);

  const handlePartClick = (id: number) => {
    if (!order.includes(id)) {
      const newOrder = [...order, id];
      setOrder(newOrder);
      
      if (newOrder.length === FINAL_PARTS.length) {
        const isCorrect = newOrder.every((val, index) => val === index + 1);
        if (isCorrect) {
          setTimeout(onComplete, 1500);
        } else {
          setShowError(true);
          setTimeout(() => {
            setOrder([]);
            setShowError(false);
          }, 1500);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 w-full max-w-4xl text-center"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-bounce" />
        <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
          O Arquivo foi Desbloqueado!
        </h2>
        <p className="text-xl text-slate-700 mb-10 font-medium">
          Você recuperou o último fragmento. Agora, organize a mensagem original para completar o resgate do Arquivo Perdido.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {shuffledParts.map((part) => {
            const isSelected = order.includes(part.id);
            const selectedIndex = order.indexOf(part.id);

            return (
              <motion.button
                key={part.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePartClick(part.id)}
                className={`
                  p-8 rounded-[32px] border-4 flex flex-col items-center justify-center gap-2 transition-all relative min-h-[120px]
                  ${isSelected 
                    ? 'bg-accent-blue border-white text-white shadow-xl scale-95 opacity-50' 
                    : 'bg-white border-slate-200 text-slate-800 hover:border-accent-blue shadow-lg'}
                `}
              >
                <span className="font-mono text-xl font-black tracking-tighter uppercase">{part.text}</span>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white text-accent-blue rounded-full flex items-center justify-center text-lg font-black shadow-md">
                    {selectedIndex + 1}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="w-full glass-panel p-10 min-h-[160px] flex items-center justify-center border-dashed border-4 border-slate-300 bg-slate-50/50 rounded-[40px] mb-6">
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
                {FINAL_PARTS.find(p => p.id === id)?.text}
              </motion.span>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-3 text-danger font-black uppercase tracking-tighter bg-danger/10 px-8 py-4 rounded-full"
            >
              <AlertTriangle className="w-6 h-6" />
              Sequência Incorreta! Tente novamente.
            </motion.div>
          )}
          {order.length === FINAL_PARTS.length && !showError && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 text-success font-black uppercase tracking-tighter bg-success/10 px-8 py-4 rounded-full"
            >
              <CheckCircle2 className="w-6 h-6" />
              Mensagem Restaurada!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
