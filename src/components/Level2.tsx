import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, CheckCircle2, AlertTriangle, Clock, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface Level2Props {
  onComplete: () => void;
  onBack: () => void;
  key?: string;
}

interface Challenge {
  fileSize: number;
  options: { id: string; count: number; size: number; label: string }[];
  tunnels: { id: string; capacity: number; label: string; color: string }[];
}

const CHALLENGES: Challenge[] = [
  {
    fileSize: 4000,
    options: [
      { id: 'opt1', count: 4, size: 1000, label: '4 PACOTES / 1000 BYTES' },
      { id: 'opt2', count: 8, size: 500, label: '8 PACOTES / 500 BYTES' },
      { id: 'opt3', count: 2, size: 2000, label: '2 PACOTES / 2000 BYTES' },
      { id: 'opt4', count: 6, size: 1500, label: '6 PACOTES / 1500 BYTES' },
    ],
    tunnels: [
      { id: 't1', capacity: 2000, label: 'TÚNEL C: 2000 BYTES/PACOTE', color: 'bg-green-500' },
      { id: 't2', capacity: 500, label: 'TÚNEL B: 500 BYTES/PACOTE', color: 'bg-blue-500' },
      { id: 't3', capacity: 1500, label: 'TÚNEL A: 1500 BYTES/PACOTE', color: 'bg-orange-500' },
    ],
  },
  {
    fileSize: 3000,
    options: [
      { id: 'opt1', count: 3, size: 1000, label: '3 PACOTES / 1000 BYTES' },
      { id: 'opt2', count: 6, size: 500, label: '6 PACOTES / 500 BYTES' },
      { id: 'opt3', count: 2, size: 1500, label: '2 PACOTES / 1500 BYTES' },
      { id: 'opt4', count: 1, size: 3000, label: '1 PACOTE / 3000 BYTES' },
    ],
    tunnels: [
      { id: 't1', capacity: 1000, label: 'TÚNEL X: 1000 BYTES/PACOTE', color: 'bg-purple-500' },
      { id: 't2', capacity: 2000, label: 'TÚNEL Y: 2000 BYTES/PACOTE', color: 'bg-pink-500' },
      { id: 't3', capacity: 500, label: 'TÚNEL Z: 500 BYTES/PACOTE', color: 'bg-cyan-500' },
    ],
  },
  {
    fileSize: 6000,
    options: [
      { id: 'opt1', count: 4, size: 1500, label: '4 PACOTES / 1500 BYTES' },
      { id: 'opt2', count: 3, size: 2000, label: '3 PACOTES / 2000 BYTES' },
      { id: 'opt3', count: 12, size: 500, label: '12 PACOTES / 500 BYTES' },
      { id: 'opt4', count: 2, size: 3000, label: '2 PACOTES / 3000 BYTES' },
    ],
    tunnels: [
      { id: 't1', capacity: 1500, label: 'TÚNEL ALFA: 1500 BYTES/PACOTE', color: 'bg-emerald-500' },
      { id: 't2', capacity: 3000, label: 'TÚNEL BETA: 3000 BYTES/PACOTE', color: 'bg-rose-500' },
      { id: 't3', capacity: 1000, label: 'TÚNEL GAMA: 1000 BYTES/PACOTE', color: 'bg-amber-500' },
    ],
  },
  {
    fileSize: 2400,
    options: [
      { id: 'opt1', count: 3, size: 800, label: '3 PACOTES / 800 BYTES' },
      { id: 'opt2', count: 2, size: 1200, label: '2 PACOTES / 1200 BYTES' },
      { id: 'opt3', count: 4, size: 600, label: '4 PACOTES / 600 BYTES' },
      { id: 'opt4', count: 6, size: 400, label: '6 PACOTES / 400 BYTES' },
    ],
    tunnels: [
      { id: 't1', capacity: 1200, label: 'TÚNEL NORTE: 1200 BYTES/PACOTE', color: 'bg-indigo-500' },
      { id: 't2', capacity: 800, label: 'TÚNEL SUL: 800 BYTES/PACOTE', color: 'bg-teal-500' },
      { id: 't3', capacity: 500, label: 'TÚNEL LESTE: 500 BYTES/PACOTE', color: 'bg-violet-500' },
    ],
  }
];

export const Level2 = ({ onComplete, onBack }: Level2Props) => {
  const [step, setStep] = useState<'explanation' | 'challenge' | 'success'>('explanation');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'slow' | 'success', message: string } | null>(null);
  const [droppedInTunnel, setDroppedInTunnel] = useState<string | null>(null);
  const [droppedPackets, setDroppedPackets] = useState<{ packetIndex: number, tunnelId: string }[]>([]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [hoveredTunnel, setHoveredTunnel] = useState<string | null>(null);

  const tunnelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const challenge = CHALLENGES[currentChallenge];
  const option = challenge.options.find(o => o.id === selectedOption);

  const startTransmission = (tunnelId: string) => {
    const tunnel = challenge.tunnels.find(t => t.id === tunnelId)!;
    const opt = challenge.options.find(o => o.id === selectedOption)!;

    setLoading(true);
    setIsTransmitting(true);
    setProgress(0);
    setFeedback(null);
    setDroppedInTunnel(tunnelId);

    // Find the best tunnel for this option (closest capacity without exceeding)
    const validTunnels = challenge.tunnels.filter(t => t.capacity >= opt.size);
    const bestTunnel = validTunnels.reduce((prev, curr) => 
      (curr.capacity < prev.capacity ? curr : prev)
    );

    const isBest = tunnelId === bestTunnel.id;
    const duration = isBest ? 2500 : 5000;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setIsTransmitting(false);
          if (isBest) {
            setFeedback({ type: 'success', message: 'EXCELENTE! Transmissão otimizada e caminho ideal. Toda a informação foi enviada rapidamente!' });
          } else {
            setFeedback({ type: 'slow', message: 'LENTO: Este túnel é muito maior que o necessário ou menos eficiente para este tamanho de pacote. A transmissão demorou mais.' });
          }
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);
  };

  const handleDrop = (tunnelId: string, packetIndex: number) => {
    if (!selectedOption || loading || feedback) return;
    
    setDroppedPackets(prev => {
      const filtered = prev.filter(p => p.packetIndex !== packetIndex);
      const newDropped = [...filtered, { packetIndex, tunnelId }];
      
      if (newDropped.length === (option?.count || 0)) {
        const firstTunnelId = newDropped[0].tunnelId;
        const allSameTunnel = newDropped.every(p => p.tunnelId === firstTunnelId);

        if (!allSameTunnel) {
          setFeedback({ 
            type: 'error', 
            message: 'ERRO: Todos os pacotes devem ser enviados pelo mesmo tubo para garantir a integridade da transmissão!' 
          });
        } else {
          const tunnel = challenge.tunnels.find(t => t.id === firstTunnelId)!;
          const opt = challenge.options.find(o => o.id === selectedOption)!;

          if (opt.size > tunnel.capacity) {
            setFeedback({ 
              type: 'error', 
              message: `ERRO: O caminho não suporta pacotes de ${opt.size} bytes! (Capacidade: ${tunnel.capacity} bytes)` 
            });
          } else {
            setTimeout(() => startTransmission(firstTunnelId), 100);
          }
        }
      }
      return newDropped;
    });
  };

  const handleRemovePacket = (packetIndex: number) => {
    setDroppedPackets(prev => prev.filter(p => p.packetIndex !== packetIndex));
    setFeedback(null);
  };

  const nextChallenge = () => {
    if (currentChallenge < CHALLENGES.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
      setProgress(0);
      setDroppedInTunnel(null);
      setDroppedPackets([]);
      setIsTransmitting(false);
      setHoveredTunnel(null);
    } else {
      setStep('success');
    }
  };

  const resetChallenge = () => {
    setFeedback(null);
    setDroppedInTunnel(null);
    setDroppedPackets([]);
    setProgress(0);
    setLoading(false);
    setIsTransmitting(false);
    setHoveredTunnel(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-6xl px-4 py-8 relative">
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
              <Shield className="w-10 h-10" /> Fase 2: Encapsulamento
            </h2>
            <div className="space-y-6 text-xl text-text-light leading-relaxed">
              <p className="text-justify">
                Nem todos os caminhos na rede são iguais. Cada "túnel" de conexão tem um limite de tamanho chamado <strong className="text-accent-blue">MTU (Maximum Transmission Unit)</strong>.
              </p>
              <p className="text-justify">
                Se você enviar pacotes maiores que o túnel permite, eles serão bloqueados. Se enviar pacotes pequenos demais para um túnel grande, você desperdiça tempo!
              </p>
              <p className="text-text-muted font-semibold text-justify">
                Seu objetivo: Escolher o tamanho ideal para os pacotes e os direcionar para o túnel de capacidade compatível.
              </p>
            </div>
            <button 
              onClick={() => setStep('challenge')}
              className="mt-10 w-full btn-primary"
            >
              INICIAR MISSÃO
            </button>
          </motion.div>
        )}

        {step === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Panel: Options */}
            <div className="lg:col-span-4 glass-panel p-6 bg-green-600/5 border-green-600/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">Tamanho dos pacotes</h3>
              </div>

              <p className="text-green-900 font-medium mb-6 leading-relaxed">
                Escolha o tamanho ideal para os pacotes e os direcionar para o túnel de capacidade compatível: O objetivo é garantir que toda a informação seja enviada no menor tempo possível.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (!loading) {
                        setSelectedOption(opt.id);
                        setFeedback(null);
                        setDroppedInTunnel(null);
                        setDroppedPackets([]);
                        setIsTransmitting(false);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      selectedOption === opt.id 
                        ? 'border-green-600 bg-green-600 text-white shadow-lg' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-green-400'
                    }`}
                  >
                    <span className="text-[10px] font-black tracking-tighter">{opt.label.split(' / ')[0]}</span>
                    <div className="h-[1px] w-full bg-current opacity-30" />
                    <span className="text-sm font-bold">{opt.label.split(' / ')[1]}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 bg-white/50 rounded-2xl border border-green-200">
                <h4 className="text-xs font-black text-green-700 uppercase tracking-widest mb-2">Status do Desafio</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600">Progresso:</span>
                  <span className="text-sm font-black text-green-600">{currentChallenge + 1} / 4</span>
                </div>
              </div>
            </div>

            {/* Right Panel: Tunnels and Drag Area */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Tunnels Area */}
              <div className="glass-panel p-8 flex flex-col gap-6 bg-slate-50/50">
                {challenge.tunnels.map(tun => (
                  <div 
                    key={tun.id}
                    ref={el => tunnelRefs.current[tun.id] = el}
                    className={`relative h-20 w-full rounded-full border-4 flex items-center px-12 transition-all overflow-hidden ${
                      hoveredTunnel === tun.id ? 'border-accent-blue bg-accent-blue/5 scale-[1.02]' : 'border-slate-300 bg-slate-50/50'
                    } ${droppedInTunnel === tun.id ? 'ring-4 ring-offset-2 ring-accent-blue' : ''}`}
                  >
                    {/* Tube Visual */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-white to-slate-200 opacity-50" />
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-400 rounded-l-full border-r-4 border-slate-500" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-slate-400 rounded-r-full border-l-4 border-slate-500" />
                    
                    {/* Labels */}
                    <div className="relative z-10 flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tun.color} animate-pulse`} />
                      <span className="font-black text-slate-800 tracking-tighter text-sm uppercase">{tun.label}</span>
                    </div>

                    {/* Dropped Packets Visual */}
                    <div className="absolute inset-0 flex items-center gap-2 px-12 overflow-hidden">
                      {droppedPackets
                        .filter(p => p.tunnelId === tun.id)
                        .map((p, idx) => (
                          <motion.div
                            key={p.packetIndex}
                            drag
                            dragSnapToOrigin
                            onDrag={(e, info) => {
                              let found = false;
                              const scrollX = window.scrollX || window.pageXOffset;
                              const scrollY = window.scrollY || window.pageYOffset;
                              Object.entries(tunnelRefs.current).forEach(([id, ref]) => {
                                if (ref) {
                                  const rect = (ref as HTMLDivElement).getBoundingClientRect();
                                  if (
                                    info.point.x > rect.left + scrollX &&
                                    info.point.x < rect.right + scrollX &&
                                    info.point.y > rect.top + scrollY &&
                                    info.point.y < rect.bottom + scrollY
                                  ) {
                                    setHoveredTunnel(id);
                                    found = true;
                                  }
                                }
                              });
                              if (!found) setHoveredTunnel(null);
                            }}
                            onDragEnd={(_, info) => {
                              setHoveredTunnel(null);
                              const scrollX = window.scrollX || window.pageXOffset;
                              const scrollY = window.scrollY || window.pageYOffset;
                              let dropped = false;
                              Object.entries(tunnelRefs.current).forEach(([id, ref]) => {
                                if (ref) {
                                  const rect = (ref as HTMLDivElement).getBoundingClientRect();
                                  if (
                                    info.point.x > rect.left + scrollX &&
                                    info.point.x < rect.right + scrollX &&
                                    info.point.y > rect.top + scrollY &&
                                    info.point.y < rect.bottom + scrollY
                                  ) {
                                    handleDrop(id, p.packetIndex);
                                    dropped = true;
                                  }
                                }
                              });
                              if (!dropped) {
                                handleRemovePacket(p.packetIndex);
                              }
                            }}
                            initial={{ scale: 0, x: -20 }}
                            animate={{ scale: 1, x: 0 }}
                            whileDrag={{ scale: 1.1, zIndex: 100 }}
                            className={`w-10 h-10 rounded-lg ${tun.color} shadow-sm flex items-center justify-center text-[10px] font-black text-white z-30 cursor-grab active:cursor-grabbing`}
                          >
                            P{p.packetIndex + 1}
                          </motion.div>
                        ))}
                    </div>

                    {/* Drop Target Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-end pr-12">
                      <ArrowRight className={`w-6 h-6 transition-colors ${hoveredTunnel === tun.id ? 'text-accent-blue' : 'text-slate-300'}`} />
                    </div>

                    {/* Progress Fill */}
                    {droppedInTunnel === tun.id && loading && (
                      <motion.div 
                        className={`absolute inset-0 ${tun.color} opacity-20`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    )}

                    {/* Transmission Animation (Moving Packets) */}
                    {isTransmitting && droppedInTunnel === tun.id && (
                      <div className="absolute inset-0 flex items-center overflow-hidden z-40">
                        {[...Array(option?.count)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ 
                              x: ['0%', '120%'],
                              opacity: [0, 1, 1, 0]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity, 
                              delay: i * 0.2,
                              ease: "linear"
                            }}
                            className={`w-10 h-10 rounded-lg ${tun.color} shadow-lg flex items-center justify-center text-[8px] font-black text-white`}
                          >
                            P{i+1}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Packets Area */}
              <div className="glass-panel p-8 min-h-[200px] flex flex-col items-center justify-center relative bg-white/80">
                <AnimatePresence mode="wait">
                  {!selectedOption ? (
                    <motion.div
                      key="consolidated"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-green-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-80 h-16 bg-white border-4 border-green-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                          <div className="absolute inset-0 bg-green-600/5" />
                          <div className="flex items-center gap-3">
                            <Shield className="w-6 h-6 text-green-700" />
                            <span className="font-black text-green-800 tracking-tighter">PACOTE CONSOLIDADO: {challenge.fileSize} BYTES</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest animate-pulse">Selecione uma fragmentação acima</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="fragmented"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
                        {[...Array(option?.count)].map((_, i) => {
                          const isDropped = droppedPackets.some(p => p.packetIndex === i);
                          return (
                            <motion.div
                              key={i}
                              drag={!isDropped}
                              dragSnapToOrigin
                              onDrag={(e, info) => {
                                // Check collision with tunnels for hover effect
                                let found = false;
                                const scrollX = window.scrollX || window.pageXOffset;
                                const scrollY = window.scrollY || window.pageYOffset;

                                Object.entries(tunnelRefs.current).forEach(([id, ref]) => {
                                  if (ref) {
                                    const rect = (ref as HTMLDivElement).getBoundingClientRect();
                                    if (
                                      info.point.x > rect.left + scrollX &&
                                      info.point.x < rect.right + scrollX &&
                                      info.point.y > rect.top + scrollY &&
                                      info.point.y < rect.bottom + scrollY
                                    ) {
                                      setHoveredTunnel(id);
                                      found = true;
                                    }
                                  }
                                });
                                if (!found) setHoveredTunnel(null);
                              }}
                              onDragEnd={(_, info) => {
                                if (isDropped) return;
                                setHoveredTunnel(null);
                                
                                const scrollX = window.scrollX || window.pageXOffset;
                                const scrollY = window.scrollY || window.pageYOffset;

                                // Check collision with tunnels
                                Object.entries(tunnelRefs.current).forEach(([id, ref]) => {
                                  if (ref) {
                                    const rect = (ref as HTMLDivElement).getBoundingClientRect();
                                    if (
                                      info.point.x > rect.left + scrollX &&
                                      info.point.x < rect.right + scrollX &&
                                      info.point.y > rect.top + scrollY &&
                                      info.point.y < rect.bottom + scrollY
                                    ) {
                                      handleDrop(id, i);
                                    }
                                  }
                                });
                              }}
                              animate={isDropped ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                              whileDrag={{ scale: 1.1, zIndex: 100 }}
                              className={`w-20 h-20 bg-white border-4 border-accent-blue rounded-xl flex flex-col items-center justify-center shadow-md cursor-grab active:cursor-grabbing group relative overflow-hidden ${isDropped ? 'pointer-events-none' : ''}`}
                            >
                              <div className="absolute inset-0 bg-accent-blue/5" />
                              <span className="text-[10px] font-black text-accent-blue opacity-50">P{i+1}</span>
                              <span className="font-black text-accent-blue text-xs">{option?.size}B</span>
                            </motion.div>
                          );
                        })}
                      </div>
                      <p className="text-sm font-bold text-accent-blue uppercase tracking-widest animate-bounce">
                        {droppedPackets.length} de {option?.count} pacotes arrastados
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feedback Overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                      animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-white/60 rounded-3xl"
                    >
                      <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="glass-panel p-8 max-w-md text-center shadow-2xl border-2 border-slate-200"
                      >
                        {feedback.type === 'error' && <AlertTriangle className="w-16 h-16 text-danger mx-auto mb-4" />}
                        {feedback.type === 'slow' && <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />}
                        {feedback.type === 'success' && <Zap className="w-16 h-16 text-success mx-auto mb-4" />}
                        
                        <h4 className={`text-2xl font-black mb-4 uppercase tracking-tighter ${
                          feedback.type === 'error' ? 'text-danger' : 
                          feedback.type === 'slow' ? 'text-orange-600' : 'text-success'
                        }`}>
                          {feedback.type === 'error' ? 'Falha na Transmissão' : 
                           feedback.type === 'slow' ? 'Transmissão Lenta' : 'Sucesso Total!'}
                        </h4>
                        
                        <p className="text-slate-600 font-bold mb-8 leading-relaxed">
                          {feedback.message}
                        </p>

                        <div className="flex gap-3">
                          {feedback.type === 'success' ? (
                            <button onClick={nextChallenge} className="btn-primary w-full flex items-center justify-center gap-2">
                              PRÓXIMO DESAFIO <ArrowRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <button onClick={resetChallenge} className="btn-secondary w-full">
                              TENTAR NOVAMENTE
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading Bar Overlay */}
                {loading && (
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/90 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black text-accent-blue uppercase tracking-widest">Transmitindo Pacotes...</span>
                      <span className="text-xs font-black text-accent-blue">{progress}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <motion.div 
                        className="h-full bg-accent-blue shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-12 text-center max-w-2xl"
          >
            <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Missão Cumprida!</h2>
            <p className="text-xl text-slate-700 mb-10 font-medium">
              Você dominou a arte da fragmentação inteligente. Os pacotes agora viajam de forma eficiente pela rede, respeitando os limites de cada caminho!
            </p>
            <div className="bg-slate-100 p-8 rounded-3xl mb-10 border border-slate-200 shadow-inner">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-4 font-black">Parte da Mensagem Resgatada:</p>
              <p className="text-2xl font-mono font-black text-accent-purple tracking-tighter">"é massa ver como a mensagem sai do celular"</p>
            </div>
            <button onClick={onComplete} className="btn-primary w-full shadow-xl">
              CONTINUAR PARA FASE 3
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
