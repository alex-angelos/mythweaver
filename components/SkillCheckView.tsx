import React, { useState, useEffect } from 'react';

interface SkillOption {
  skill: string;
  attribute?: string;
}

interface SkillCheck {
  prompt: string;
  difficultyClass: number;
  options: SkillOption[];
}

interface Props {
  skillCheck: SkillCheck;
  onSubmit: (diceRoll: {
    skill: string;
    attribute: string;
    value: number;
  }) => void;
}

const SkillCheckView: React.FC<Props> = ({ skillCheck, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState<SkillOption | null>(null);
  const [rollValue, setRollValue] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [displayRoll, setDisplayRoll] = useState<number | null>(null);

  /* ================= VISUAL-ONLY DICE ANIMATION ================= */

  useEffect(() => {
    if (!isRolling) return;

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayRoll(Math.floor(Math.random() * 20) + 1); // 🎲 VISUAL ONLY
      iterations++;

      if (iterations > 14) {
        clearInterval(interval);
        setIsRolling(false);
        setDisplayRoll(null);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isRolling]);

  /* ================= HANDLERS ================= */

  const handleSelect = (option: SkillOption) => {
    setSelectedOption(option);
    setRollValue('');
    setIsRolling(true);
  };

  const handleConfirm = () => {
    if (!selectedOption || !rollValue) return;

    onSubmit({
      skill: selectedOption.skill,
      attribute: selectedOption.attribute || 'Sabedoria',
      value: Number(rollValue)
    });
  };

  /* ================= RENDER ================= */

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
      <div className="bg-slate-900 border border-white/5 p-10 rounded-[2.5rem] max-w-lg w-full shadow-2xl space-y-8 fade-in">

        {/* HEADER */}
        <header className="space-y-3">
          <div className="inline-flex px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
            Intervenção do Destino
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            Teste de Perícia
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {skillCheck.prompt}
          </p>
        </header>

        {/* OPTIONS */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">
            Abordagem
          </label>

          <div className="flex flex-wrap gap-3">
            {skillCheck.options.map(option => (
              <button
                key={option.skill}
                disabled={isRolling}
                onClick={() => handleSelect(option)}
                className={`px-5 py-2.5 rounded-xl border text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                  selectedOption?.skill === option.skill
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-slate-800/50 border-white/5 text-slate-500 hover:border-indigo-500/30'
                }`}
              >
                {option.skill}
              </button>
            ))}
          </div>
        </div>

        {/* ROLL VISUAL / INPUT */}
        <div className="space-y-6 flex flex-col items-center">

          {isRolling && (
            <div className="h-32 flex items-center justify-center">
              <div className="text-6xl font-black text-indigo-500 animate-pulse">
                {displayRoll}
              </div>
            </div>
          )}

          {!isRolling && selectedOption && (
            <div className="w-full space-y-4 fade-in">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center block">
                Role seu D20 fora do sistema e informe o valor
              </label>

              <input
                type="number"
                min={1}
                max={30}
                autoFocus
                value={rollValue}
                onChange={e => setRollValue(e.target.value)}
                placeholder="?"
                className="w-full bg-slate-950 border border-white/5 p-6 rounded-3xl text-indigo-500 text-center text-5xl font-black focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          )}

          {!selectedOption && !isRolling && (
            <div className="h-32 flex items-center justify-center text-slate-700 italic text-sm">
              Selecione uma perícia para iniciar o teste
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="pt-4 space-y-6 text-center">
          <button
            disabled={!selectedOption || !rollValue || isRolling}
            onClick={handleConfirm}
            className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-2xl shadow-indigo-600/20"
          >
            Confirmar Destino
          </button>

          <div className="flex items-center justify-center gap-3">
            <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">
              Dificuldade: {skillCheck.difficultyClass}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillCheckView;
