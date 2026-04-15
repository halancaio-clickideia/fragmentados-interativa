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

  // Load progress from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('fragmentados_progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('fragmentados_progress', JSON.stringify(progress));
  }, [progress]);

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
    localStorage.removeItem('fragmentados_progress');
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
          <LevelSelection 
            key="menu" 
            progress={progress} 
            onSelectLevel={(level) => setGameState(level as GameState)} 
          />
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
            className="glass-panel p-12 text-center z-10 max-w-2xl mx-4"
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600">
              ARQUIVO RESGATADO!
            </h2>
            <p className="text-xl text-slate-700 mb-8 font-medium">
              Você dominou os conceitos de transmissão de dados e restaurou a mensagem original:
            </p>
            
            <div className="bg-emerald-50 border-4 border-emerald-200 p-8 rounded-[32px] mb-10 shadow-inner">
              <p className="text-2xl md:text-3xl font-black text-emerald-700 tracking-tighter leading-tight uppercase">
                "OS DADOS SÃO FRAGMENTADOS E ENVIADOS ATRAVÉS DE MÚLTIPLOS CAMINHOS"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-black text-accent-blue text-xs uppercase tracking-widest mb-1">01. Fragmentação</p>
                <p className="text-sm text-slate-700 font-medium">Divisão do arquivo em pacotes para o transporte.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-black text-accent-blue text-xs uppercase tracking-widest mb-1">02. Encapsulamento</p>
                <p className="text-sm text-slate-700 font-medium">Identificação de destino e ordem em cada pacote.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-black text-accent-blue text-xs uppercase tracking-widest mb-1">03. Roteamento</p>
                <p className="text-sm text-slate-700 font-medium">Viagem independente por múltiplos caminhos.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-black text-accent-blue text-xs uppercase tracking-widest mb-1">04. Remontagem</p>
                <p className="text-sm text-slate-700 font-medium">Organização final para restaurar a mensagem.</p>
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="btn-primary w-full"
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
