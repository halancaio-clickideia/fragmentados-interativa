import { motion } from 'motion/react';
import { Rocket, Shield, Network, Puzzle, Lock, CheckCircle2 } from 'lucide-react';
import { GameProgress } from '../types';

interface LevelSelectionProps {
  progress: GameProgress;
  onSelectLevel: (level: string) => void;
  key?: string;
}

export const LevelSelection = ({ progress, onSelectLevel }: LevelSelectionProps) => {
  const levels = [
    { id: 'level1', title: 'Fragmentação', icon: Rocket, description: 'Dividindo a informação' },
    { id: 'level2', title: 'Encapsulamento', icon: Shield, description: 'Etiquetando pacotes' },
    { id: 'level3', title: 'Roteamento', icon: Network, description: 'Encontrando caminhos' },
    { id: 'level4', title: 'Remontagem', icon: Puzzle, description: 'O quebra-cabeça final' },
  ];

  return (
    <div className="z-10 w-full max-w-4xl px-4">
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-center mb-12 uppercase tracking-[4px]"
      >
        Seletor de Fases
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level, index) => {
          const levelData = progress.levels[level.id];
          const isUnlocked = true; // Forçado para teste: levelData.unlocked;
          const isCompleted = levelData.completed;

          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              disabled={!isUnlocked}
              onClick={() => onSelectLevel(level.id)}
              className={`phase-card ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'border-success' : ''}`}
            >
              {!isUnlocked && (
                <div className="absolute top-4 right-4 text-xl">🔒</div>
              )}
              
              <div className="flex items-center gap-6">
                <div className={`
                  p-5 rounded-2xl 
                  ${isUnlocked ? 'bg-accent-blue/10 text-accent-blue' : 'bg-slate-900 text-text-muted'}
                `}>
                  <level.icon className="w-10 h-10" />
                </div>
                
                <div className="text-left">
                  <div className="text-[11px] uppercase tracking-widest text-accent-blue mb-1">
                    Fase 0{index + 1}
                  </div>
                  <h3 className={`text-2xl font-bold ${isUnlocked ? 'text-slate-900' : 'text-text-muted'}`}>
                    {level.title}
                  </h3>
                  <p className={`text-xs ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                    {level.description}
                  </p>
                  {isCompleted && (
                    <div className="flex items-center gap-2 mt-1 text-success text-xs font-bold uppercase tracking-tighter">
                      <CheckCircle2 className="w-4 h-4" /> Concluída
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
