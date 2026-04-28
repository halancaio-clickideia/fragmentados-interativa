import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameState, GameProgress, INITIAL_PROGRESS } from './types';
import { StarField, Intro, Explanation } from './components/Intro';
import { LevelSelection } from './components/LevelSelection';
import { Level1 } from './components/Level1';
import { Level2 } from './components/Level2';
import { Level3 } from './components/Level3';
import { Level4 } from './components/Level4';
import { FinalMessageReassembly } from './components/FinalMessageReassembly';
import { Trophy, RefreshCcw, Home } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [progress, setProgress] = useState<GameProgress>(INITIAL_PROGRESS);

  const handleLevelComplete = (levelId: string) => {
    const nextLevelId = levelId === 'level1' ? 'level2' : levelId === 'level2' ? 'level3' : levelId === 'level3' ? 'level4' : null;
    
    setProgress(prev => {
      const newProgress = { ...prev };
      newProgress.levels[levelId].completed = true;
      if (nextLevelId) {
        newProgress.levels[nextLevelId].unlocked = true;
      }
      return newProgress;
    });

    if (levelId === 'level4') {
      setGameState('final_reassembly');
    } else {
      setGameState('menu');
    }
  };

  const resetGame = () => {
    setProgress(INITIAL_PROGRESS);
    setGameState('intro');
  };

  return (
    <div className="game-container font-sans">
      <div className="space-bg" />
      <StarField />
      
      {/* HUD / Navigation REMOVED */}
      
      <div className="flex-1 w-full flex flex-col items-center justify-center relative py-12">
        <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <Intro key="intro" onStart={() => setGameState('explanation')} />
        )}

        {gameState === 'explanation' && (
          <Explanation key="explanation" onNext={() => setGameState('menu')} />
        )}

        {gameState === 'menu' && (
          <div className="flex flex-col items-center w-full">
            <LevelSelection 
              key="menu" 
              progress={progress} 
              onSelectLevel={(level) => setGameState(level as GameState)} 
            />
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              onClick={resetGame}
              className="mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-slate-500 hover:text-danger transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> Reiniciar Progresso
            </motion.button>
          </div>
        )}

        {gameState === 'level1' && (
          <Level1 key="level1" onComplete={() => handleLevelComplete('level1')} onBack={() => setGameState('menu')} />
        )}

        {gameState === 'level2' && (
          <Level2 key="level2" onComplete={() => handleLevelComplete('level2')} onBack={() => setGameState('menu')} />
        )}

        {gameState === 'level3' && (
          <Level3 key="level3" onComplete={() => handleLevelComplete('level3')} onBack={() => setGameState('menu')} />
        )}

        {gameState === 'level4' && (
          <Level4 key="level4" onComplete={() => handleLevelComplete('level4')} onBack={() => setGameState('menu')} />
        )}

        {gameState === 'final_reassembly' && (
          <FinalMessageReassembly key="final_reassembly" onComplete={() => setGameState('final')} onBack={() => setGameState('menu')} />
        )}

        {gameState === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 md:p-14 text-center z-10 max-w-6xl mx-4"
          >
            <div className="flex flex-col md:flex-row gap-12 items-center mb-12 text-left">
              {/* Final Illustration - Smaller and side-by-side */}
              <div className="w-full md:w-5/12 aspect-[4/3] bg-white rounded-[40px] border-2 border-slate-100 relative overflow-hidden flex items-center justify-center group shrink-0 shadow-lg p-4">
                <img 
                  src="/success.png" 
                  alt="Ilustração final: Mensagem entregue com sucesso"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[3px] text-white drop-shadow-md">Ilustração do Resgate Final</span>
                </div>
              </div>

              <div className="flex-1 text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mb-6 mx-auto" />
                <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 uppercase tracking-tighter leading-none text-center">
                  ARQUIVO RESGATADO!
                </h2>
                <p className="text-xl text-slate-700 font-medium leading-relaxed mb-6">
                  Você dominou os conceitos de transmissão de dados e restaurou a mensagem original:
                </p>

                <div className="bg-emerald-50 border-4 border-emerald-200 p-6 rounded-[24px] shadow-inner">
                  <p className="text-xl lg:text-2xl font-black text-emerald-700 leading-tight">
                    "Tô estudando redes hoje, é massa ver como a mensagem sai do celular e chega no outro mesmo passando por vários caminhos."
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-left mb-6">
              <p className="text-sm font-black uppercase tracking-[4px] text-slate-400 mb-2">Relembre o que você aprendeu.</p>
              <div className="w-24 h-1.5 bg-accent-blue rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 text-left">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-accent-blue transition-colors group">
                <p className="font-black text-accent-blue text-xs uppercase tracking-[2px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">01. Fragmentação</p>
                <p className="text-sm text-slate-700 font-bold leading-tight">Divisão do arquivo em pacotes para o transporte.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-accent-blue transition-colors group">
                <p className="font-black text-accent-blue text-xs uppercase tracking-[2px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">02. Encapsulamento</p>
                <p className="text-sm text-slate-700 font-bold leading-tight">Identificação de destino e ordem em cada pacote.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-accent-blue transition-colors group">
                <p className="font-black text-accent-blue text-xs uppercase tracking-[2px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">03. Roteamento</p>
                <p className="text-sm text-slate-700 font-bold leading-tight">Viagem independente por múltiplos caminhos.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-accent-blue transition-colors group">
                <p className="font-black text-accent-blue text-xs uppercase tracking-[2px] mb-2 opacity-70 group-hover:opacity-100 transition-opacity">04. Remontagem</p>
                <p className="text-sm text-slate-700 font-bold leading-tight">Organização final para restaurar a mensagem.</p>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="btn-primary w-full py-6 text-lg"
            >
              JOGAR NOVAMENTE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
