import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Network, Cpu, ArrowRight, CheckCircle2, AlertTriangle, Zap, Clock, ArrowLeft } from 'lucide-react';

interface Level3Props {
  onComplete: () => void;
  onBack: () => void;
  key?: string;
}

interface Node {
  id: number;
  type: 'start' | 'router' | 'end';
  label: string;
  x: number;
  y: number;
}

interface Connection {
  from: number;
  to: number;
  isBlocked: boolean;
  speed: 'fast' | 'slow';
}

const baseNodes: Node[] = [
  { id: 0, type: 'start', label: 'Origem', x: 10, y: 50 },
  { id: 1, type: 'router', label: 'R1', x: 30, y: 20 },
  { id: 2, type: 'router', label: 'R2', x: 30, y: 50 },
  { id: 3, type: 'router', label: 'R3', x: 30, y: 80 },
  { id: 4, type: 'router', label: 'R4', x: 55, y: 20 },
  { id: 5, type: 'router', label: 'R5', x: 55, y: 50 },
  { id: 6, type: 'router', label: 'R6', x: 55, y: 80 },
  { id: 7, type: 'router', label: 'R7', x: 75, y: 35 },
  { id: 8, type: 'router', label: 'R8', x: 75, y: 65 },
  { id: 9, type: 'end', label: 'Destino', x: 90, y: 50 },
];

const baseConnections: Connection[] = [
  { from: 0, to: 1, isBlocked: false, speed: 'fast' },
  { from: 0, to: 2, isBlocked: false, speed: 'slow' },
  { from: 0, to: 3, isBlocked: false, speed: 'fast' },
  { from: 1, to: 4, isBlocked: false, speed: 'fast' },
  { from: 1, to: 5, isBlocked: false, speed: 'slow' },
  { from: 2, to: 5, isBlocked: false, speed: 'fast' },
  { from: 3, to: 6, isBlocked: false, speed: 'fast' },
  { from: 4, to: 7, isBlocked: false, speed: 'fast' },
  { from: 5, to: 7, isBlocked: false, speed: 'fast' },
  { from: 5, to: 8, isBlocked: false, speed: 'slow' },
  { from: 6, to: 8, isBlocked: false, speed: 'fast' },
  { from: 7, to: 9, isBlocked: false, speed: 'fast' },
  { from: 8, to: 9, isBlocked: false, speed: 'fast' },
];

export const Level3 = ({ onComplete, onBack }: Level3Props) => {
  const [step, setStep] = useState<'explanation' | 'challenge' | 'success'>('explanation');
  const [currentSubChallenge, setCurrentSubChallenge] = useState(1);
  const [currentNode, setCurrentNode] = useState(0);
  const [path, setPath] = useState<number[]>([0]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmittingTo, setTransmittingTo] = useState<number | null>(null);
  const [isFailed, setIsFailed] = useState(false);
  const [blockedConnections, setBlockedConnections] = useState<{from: number, to: number}[]>([]);
  const [activeConnections, setActiveConnections] = useState<Connection[]>(baseConnections);
  const [activeNodes, setActiveNodes] = useState<Node[]>(baseNodes);

  const generateChallenge = () => {
    // Randomize node positions with jitter
    const newNodes = baseNodes.map(node => {
      if (node.type === 'start' || node.type === 'end') return node;
      
      const jitterX = (Math.random() - 0.5) * 10;
      const jitterY = (Math.random() - 0.5) * 15;
      
      return {
        ...node,
        x: Math.max(20, Math.min(80, node.x + jitterX)),
        y: Math.max(15, Math.min(85, node.y + jitterY))
      };
    });

    setActiveNodes(newNodes);

    // BFS to check if path exists
    const hasPath = (connections: Connection[]) => {
      const visited = new Set<number>();
      const queue = [0];
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (curr === 9) return true;
        if (visited.has(curr)) continue;
        visited.add(curr);
        connections
          .filter(c => c.from === curr && !c.isBlocked)
          .forEach(c => queue.push(c.to));
      }
      return false;
    };

    let newConnections: Connection[] = [];
    let attempts = 0;
    
    do {
      newConnections = baseConnections.map(c => ({ ...c, isBlocked: false }));
      const blockable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 
      const shuffled = [...blockable].sort(() => Math.random() - 0.5);
      const toBlock = shuffled.slice(0, 4); // Block 4 random connections
      
      toBlock.forEach(idx => {
        newConnections[idx].isBlocked = true;
      });
      attempts++;
    } while (!hasPath(newConnections) && attempts < 10);

    setActiveConnections(newConnections);
    setCurrentNode(0);
    setPath([0]);
    setBlockedConnections([]);
  };

  useEffect(() => {
    if (step === 'challenge') {
      generateChallenge();
    }
  }, [step, currentSubChallenge]);

  const handleNodeClick = (targetId: number) => {
    if (isTransmitting || isFailed) return;

    // Check if moving backward (to a node already in path)
    const isBacktrack = path.includes(targetId) && targetId !== currentNode;

    if (isBacktrack) {
      const targetIndex = path.indexOf(targetId);
      setPath(path.slice(0, targetIndex + 1));
      setCurrentNode(targetId);
      return;
    }

    const conn = activeConnections.find(c => c.from === currentNode && c.to === targetId);
    if (!conn) return;

    setIsTransmitting(true);
    setTransmittingTo(targetId);

    const duration = conn.speed === 'fast' ? 800 : 1500;

    setTimeout(() => {
      if (conn.isBlocked) {
        setIsFailed(true);
        setBlockedConnections(prev => [...prev, { from: currentNode, to: targetId }]);
        setTimeout(() => {
          setIsFailed(false);
          setIsTransmitting(false);
          setTransmittingTo(null);
        }, 1500);
      } else {
        setCurrentNode(targetId);
        setPath(prev => [...prev, targetId]);
        setIsTransmitting(false);
        setTransmittingTo(null);
        if (activeNodes[targetId].type === 'end') {
          if (currentSubChallenge < 5) {
            setTimeout(() => {
              setCurrentSubChallenge(prev => prev + 1);
            }, 1000);
          } else {
            setTimeout(() => setStep('success'), 800);
          }
        }
      }
    }, duration);
  };

  const resetChallenge = () => {
    generateChallenge();
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
              <Network className="w-10 h-10" /> Fase 3: Roteamento Dinâmico
            </h2>
            <div className="space-y-6 text-xl text-text-light leading-relaxed">
              <p>
                A internet é dinâmica! Roteadores buscam o <strong className="text-accent-blue">caminho mais rápido</strong>, mas às vezes encontram bloqueios inesperados.
              </p>
              <p>
                Nesta fase, você deve guiar o pacote até o destino. Alguns caminhos são mais lentos e outros podem estar <strong className="text-danger">bloqueados</strong>.
              </p>
              <p className="text-text-muted italic">
                Dica: Se um caminho falhar, o roteador voltará automaticamente para que você tente uma rota alternativa.
              </p>
            </div>
            <button 
              onClick={() => setStep('challenge')}
              className="mt-10 w-full btn-primary"
            >
              INICIAR ROTEAMENTO
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Traçando a Rota ({currentSubChallenge}/5)</h3>
              <p className="text-slate-700 font-medium">Encontre o caminho mais eficiente. Cuidado com os bloqueios ocultos!</p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentSubChallenge / 5) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative w-full aspect-[16/9] bg-slate-100/80 rounded-3xl border-4 border-slate-200 p-8 overflow-hidden shadow-2xl">
              {/* Network Grid Background */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
              
              {/* Connections (Lines) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {activeConnections.map((conn, i) => {
                  const fromNode = activeNodes[conn.from];
                  const toNode = activeNodes[conn.to];
                  const isBlocked = blockedConnections.some(bc => bc.from === conn.from && bc.to === conn.to);
                  const isCurrentPath = path.includes(conn.from) && path.includes(conn.to) && path.indexOf(conn.to) === path.indexOf(conn.from) + 1;
                  
                  return (
                    <g key={i}>
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={isBlocked ? '#ef4444' : isCurrentPath ? '#10b981' : '#cbd5e1'}
                        strokeWidth={isBlocked ? "4" : "3"}
                        strokeDasharray={conn.speed === 'slow' ? "8,8" : "0"}
                        className="transition-colors duration-500"
                      />
                      {/* Transmission Animation */}
                      {isTransmitting && transmittingTo === conn.to && currentNode === conn.from && (
                        <motion.circle
                          r="6"
                          fill="#3b82f6"
                          initial={{ cx: `${fromNode.x}%`, cy: `${fromNode.y}%` }}
                          animate={{ cx: `${toNode.x}%`, cy: `${toNode.y}%` }}
                          transition={{ 
                            duration: conn.speed === 'fast' ? 0.8 : 1.5,
                            ease: "linear"
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {activeNodes.map(node => {
                const isCurrent = currentNode === node.id;
                const isInPath = path.includes(node.id);
                const isBacktrackable = isInPath && !isCurrent;
                const isTargetable = activeConnections.some(c => c.from === currentNode && c.to === node.id);
                
                return (
                  <motion.button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    disabled={(!isTargetable && !isBacktrackable) || isTransmitting}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center border-4 transition-all z-10
                      ${isCurrent ? 'bg-accent-blue border-white text-white shadow-[0_0_20px_rgba(0,242,255,0.5)] scale-110' : 
                        isBacktrackable ? 'bg-emerald-100 border-emerald-500 text-emerald-600 hover:scale-110 cursor-pointer' :
                        isInPath ? 'bg-emerald-500 border-white text-white' : 
                        isTargetable ? 'bg-white border-accent-blue text-accent-blue hover:scale-110 cursor-pointer' : 
                        'bg-slate-200 border-slate-300 text-slate-400 opacity-50'}
                    `}
                  >
                    {node.type === 'start' ? <Cpu className="w-6 h-6" /> : 
                     node.type === 'end' ? <CheckCircle2 className="w-6 h-6" /> : 
                     <Network className="w-5 h-5" />}
                    
                    {/* Label */}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-tighter text-slate-700 whitespace-nowrap">
                      {node.label}
                    </span>
                  </motion.button>
                );
              })}

              {/* Backtrack Hint */}
              {(() => {
                const outgoing = activeConnections.filter(c => c.from === currentNode);
                const allBlocked = outgoing.length > 0 && outgoing.every(c => blockedConnections.some(bc => bc.from === c.from && bc.to === c.to));
                if (allBlocked && path.length > 1) {
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg z-50 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Caminho sem saída! Clique em um roteador anterior para voltar.
                    </motion.div>
                  );
                }
                return null;
              })()}

              {/* Overlays */}
              <AnimatePresence>
                {isFailed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-8 z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-white p-6 rounded-3xl shadow-2xl border-4 border-red-500 max-w-xs"
                    >
                      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                      <h4 className="text-xl font-black text-red-600 mb-1 uppercase tracking-tighter">Caminho Bloqueado!</h4>
                      <p className="text-slate-600 text-sm font-bold">O roteador detectou uma falha. Retornando para buscar nova rota...</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Speed Legend */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-white/80 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 bg-slate-500" />
                  <span className="text-[10px] font-black text-slate-700 uppercase">Rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-1 border-b-2 border-dashed border-slate-500" />
                  <span className="text-[10px] font-black text-slate-700 uppercase">Lento</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button 
                onClick={resetChallenge}
                className="btn-secondary px-6 py-2 text-sm"
              >
                REINICIAR ROTA
              </button>
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Network className="w-24 h-24 text-emerald-500" />
            </motion.div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4 uppercase tracking-tighter">Rota Concluída!</h2>
            <p className="text-xl text-slate-700 mb-8 font-medium">
              Os pacotes encontraram o melhor caminho através da rede. <br/>
              Você liberou a terceira parte da mensagem.
            </p>
            <div className="bg-indigo-50 border-4 border-indigo-200 p-8 rounded-3xl mb-8 inline-block shadow-inner">
              <p className="text-xs uppercase tracking-widest text-indigo-400 mb-4 font-black">Parte da Mensagem Resgatada:</p>
              <p className="text-3xl font-mono font-black text-indigo-600 tracking-tighter">"ENVIADOS ATRAVÉS DE"</p>
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
