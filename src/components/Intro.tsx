import { motion } from 'motion/react';
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
          <Rocket className="w-24 h-24 text-accent-blue mb-4 mx-auto" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-accent-blue rounded-full blur-xl"
          />
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
        onClick={onStart}
        className="btn-primary flex items-center gap-2 text-lg"
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="glass-panel max-w-3xl p-8 md:p-10 z-10 mx-4"
    >
      <h2 className="text-3xl font-bold mb-6 text-accent-blue uppercase tracking-wider">Relatório de Incidente</h2>
      <div className="space-y-4 text-lg text-text-light leading-snug">
        <p className="mb-4">
          Uma mensagem importante foi enviada entre dois amigos. Ela foi quebrada em 4 partes e espalhada pela rede. Precisamos de você para recuperar esses pedaços e assim remontar a informação.
          </p>
        <ul className="space-y-4 list-none p-0">
          <li className="flex items-start gap-3">
            <span className="text-accent-blue font-black text-xl mt-0.5">01</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Fragmentação</strong>
              <span className="text-base">Quebrar o arquivo em pedaços menores chamados <strong>pacotes</strong>.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-blue font-black text-xl mt-0.5">02</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Encapsulamento</strong>
              <span className="text-base">Identificar o destino e a ordem de cada pacote para o transporte.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-blue font-black text-xl mt-0.5">03</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Roteamento</strong>
              <span className="text-base">Os pacotes viajam de forma independente pelos caminhos da rede.</span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-accent-blue font-black text-xl mt-0.5">04</span>
            <div>
              <strong className="text-accent-blue block text-xl leading-none mb-1">Remontagem</strong>
              <span className="text-base">No destino, os pacotes são organizados e unidos para restaurar a mensagem.</span>
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
