import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Shield, Network, Puzzle, Play } from 'lucide-react';

export const StarField = () => {
  return (
    <div className="star-field">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent-blue/20 rounded-full"
          style={{
            width: Math.random() * 3 + 'px',
            height: Math.random() * 3 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.3 + 0.1,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export const Intro = ({ onStart }: { onStart: () => void, key?: string }) => {
  const [isTakingOff, setIsTakingOff] = useState(false);

  const handleStart = () => {
    setIsTakingOff(true);
    // Wait for the animation to finish before calling onStart
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center z-10 text-center px-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mb-8"
      >
        <div className="relative inline-block">
          <motion.div
            animate={isTakingOff ? { 
              x: 1000, 
              y: -1000, 
              scale: 1.5,
              rotate: 45
            } : { 
              y: [0, -15, 0],
              rotate: [45, 48, 45]
            }}
            transition={isTakingOff ? { 
              duration: 1.5, 
              ease: "easeIn" 
            } : { 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10"
          >
            <motion.img 
              src="/rocket.png" 
              alt="Foguete" 
              className="w-32 h-32 object-contain mb-4 mx-auto" 
              referrerPolicy="no-referrer"
              style={{ rotate: '30deg' }}
            />
            
            {/* Trail / Flame Effect during takeoff */}
            {isTakingOff && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [1, 2, 0.5] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute -bottom-4 -left-4 w-12 h-24 bg-gradient-to-t from-orange-500/0 via-orange-500 to-yellow-300 blur-xl -z-10 origin-top"
                style={{ transform: 'rotate(-135deg)' }}
              />
            )}
          </motion.div>

          <AnimatePresence>
            {!isTakingOff && (
              <motion.div
                initial={{ opacity: 0.3, scale: 1 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                exit={{ opacity: 0, scale: 2 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-blue/20 rounded-full blur-2xl -z-10"
              />
            )}
          </AnimatePresence>
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple">
          FRAGMENTADOS
        </h1>
        <p className="text-xl md:text-2xl font-medium text-text-muted tracking-[4px] uppercase">
          O Resgate do Arquivo Perdido
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        disabled={isTakingOff}
        className={`btn-primary flex items-center gap-2 text-lg transition-all ${isTakingOff ? 'opacity-0 scale-90 pointer-events-none' : ''}`}
      >
        <Play className="w-5 h-5 fill-current" />
        COMEÇAR
      </motion.button>
    </motion.div>
  );
};

export const Explanation = ({ onNext }: { onNext: () => void, key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-panel max-w-3xl p-8 md:p-10 z-10 mx-4"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
        <div className="w-full md:w-1/3 aspect-square bg-white rounded-3xl flex items-center justify-center border-2 border-slate-100 relative overflow-hidden group shadow-lg">
          <img 
            src="/incident.png" 
            alt="Ilustração da Mensagem Fragmentada" 
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-4 text-accent-blue uppercase tracking-wider">Relatório de Incidente</h2>
          <p className="text-lg text-text-light leading-snug text-justify">
            Uma mensagem importante foi enviada entre dois amigos. Ela foi quebrada em 4 partes e espalhada pela rede. Precisamos de você para recuperar esses pedaços e assim remontar a informação.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-lg text-text-light leading-snug">
        <p className="font-bold text-slate-700">Para solucionar esse problema, você deverá realizar os seguintes passos:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
          <li className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <span className="text-accent-blue font-black text-2xl mt-0.5">01</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Fragmentação</strong>
              <span className="text-base text-slate-700 text-justify block">Quebrar o arquivo em pedaços menores chamados <strong>pacotes</strong>.</span>
            </div>
          </li>
          <li className="flex items-start gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
            <span className="text-accent-blue font-black text-2xl mt-0.5">02</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Encapsulamento</strong>
              <span className="text-base text-slate-700 text-justify block">Identificar o destino e a ordem de cada pacote para o transporte.</span>
            </div>
          </li>
          <li className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <span className="text-accent-blue font-black text-2xl mt-0.5">03</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Roteamento</strong>
              <span className="text-base text-slate-700 text-justify block">Conduzir os pacotes de forma independente pelos caminhos da rede.</span>
            </div>
          </li>
          <li className="flex items-start gap-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <span className="text-accent-blue font-black text-2xl mt-0.5">04</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Remontagem</strong>
              <span className="text-base text-slate-700 text-justify block">Organizar e unir, no destino, os pacotes para restaurar a mensagem.</span>
            </div>
          </li>
        </ul>
      </div>
      
      <motion.button
        whileHover={{ x: 5 }}
        onClick={onNext}
        className="mt-8 w-full btn-primary py-4"
      >
        ENTENDIDO
      </motion.button>
    </motion.div>
  );
};
