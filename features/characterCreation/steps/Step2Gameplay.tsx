import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Dumbbell,
  Feather,
  HeartPulse,
  Brain,
  Eye,
  Smile
} from "lucide-react";


/* ===============================
   SKILLS (PHB 5e)
=============================== */

export const SKILLS = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival"
] as const;

type Skill = typeof SKILLS[number];

/* ===============================
   CLASS SKILLS (PHB)
=============================== */

export const CLASS_SKILLS: Record<
  string,
  { choose: number; options: Skill[] }
> = {
  Guerreiro: {
    choose: 2,
    options: [
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "History",
      "Insight",
      "Intimidation",
      "Perception",
      "Survival"
    ]
  },
  Mago: {
    choose: 2,
    options: [
      "Arcana",
      "History",
      "Insight",
      "Investigation",
      "Medicine",
      "Religion"
    ]
  },
  Ladino: {
    choose: 4,
    options: [
      "Acrobatics",
      "Athletics",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Performance",
      "Persuasion",
      "Sleight of Hand",
      "Stealth"
    ]
  },
  Clérigo: {
    choose: 2,
    options: [
      "History",
      "Insight",
      "Medicine",
      "Persuasion",
      "Religion"
    ]
  },
  Paladino: {
    choose: 2,
    options: [
      "Athletics",
      "Insight",
      "Intimidation",
      "Medicine",
      "Persuasion",
      "Religion"
    ]
  },
  Bárbaro: {
    choose: 2,
    options: [
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival"
    ]
  },
  Bardo: {
    choose: 3,
    options: [...SKILLS]
  },
  Druida: {
    choose: 2,
    options: [
      "Arcana",
      "Animal Handling",
      "Insight",
      "Medicine",
      "Nature",
      "Perception",
      "Religion",
      "Survival"
    ]
  },
  Ranger: {
    choose: 3,
    options: [
      "Animal Handling",
      "Athletics",
      "Insight",
      "Investigation",
      "Nature",
      "Perception",
      "Stealth",
      "Survival"
    ]
  },
  Monge: {
    choose: 2,
    options: [
      "Acrobatics",
      "Athletics",
      "History",
      "Insight",
      "Religion",
      "Stealth"
    ]
  },
  Feiticeiro: {
    choose: 2,
    options: [
      "Arcana",
      "Deception",
      "Insight",
      "Intimidation",
      "Persuasion",
      "Religion"
    ]
  },
  Bruxo: {
    choose: 2,
    options: [
      "Arcana",
      "Deception",
      "History",
      "Intimidation",
      "Investigation",
      "Nature",
      "Religion"
    ]
  }
};

/* ===============================
   SKILL LABELS (PT-BR)
=============================== */

const SKILL_LABELS: Record<Skill, string> = {
  Acrobatics: "Acrobacia",
  "Animal Handling": "Adestrar Animais",
  Arcana: "Arcanismo",
  Athletics: "Atletismo",
  Deception: "Enganação",
  History: "História",
  Insight: "Intuição",
  Intimidation: "Intimidação",
  Investigation: "Investigação",
  Medicine: "Medicina",
  Nature: "Natureza",
  Perception: "Percepção",
  Performance: "Atuação",
  Persuasion: "Persuasão",
  Religion: "Religião",
  "Sleight of Hand": "Prestidigitação",
  Stealth: "Furtividade",
  Survival: "Sobrevivência"
};

/* ===============================
   TYPES
=============================== */

type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

type Props = {
  data: any;
  attributes: Attributes;
  remainingPoints: number;
  aiReasoning?: string;
  isSuggesting?: boolean;
  onIncrease: (key: keyof Attributes) => void;
  onDecrease: (key: keyof Attributes) => void;
  onSuggest: () => void;
  onUpdate: (partial: any) => void;
  onNext: () => void;
  onBack: () => void;
  onValidityChange: (valid: boolean) => void;
};

/* ===============================
   HELPERS
=============================== */

function getModifier(value: number) {
  return Math.floor((value - 10) / 2);
}

const ATTRIBUTE_LABELS: Record<keyof Attributes, string> = {
  strength: "Força",
  dexterity: "Destreza",
  constitution: "Constituição",
  intelligence: "Inteligência",
  wisdom: "Sabedoria",
  charisma: "Carisma"
};

const ATTRIBUTE_ICONS: Record<keyof Attributes, React.ReactNode> = {
  strength: <Dumbbell className="w-4 h-4 text-amber-400" />,
  dexterity: <Feather className="w-4 h-4 text-amber-400" />,
  constitution: <HeartPulse className="w-4 h-4 text-amber-400" />,
  intelligence: <Brain className="w-4 h-4 text-amber-400" />,
  wisdom: <Eye className="w-4 h-4 text-amber-400" />,
  charisma: <Smile className="w-4 h-4 text-amber-400" />
};


/* ===============================
   COMPONENT
=============================== */

const Step2Gameplay: React.FC<Props> = ({
  data,
  attributes,
  remainingPoints,
  aiReasoning,
  isSuggesting,
  onIncrease,
  onDecrease,
  onSuggest,
  onUpdate,
  onValidityChange
}) => {
  const [showExplanation, setShowExplanation] = React.useState(false);

  /* ===============================
     SKILLS — D&D 5e
  =============================== */

/* ===============================
   SKILLS — REGRAS D&D 5e
=============================== */

// 🔹 Background (vem do Step 1)
const backgroundSkills: Skill[] =
  data?.background?.grantedSkills || [];

// 🔹 Raça (automático)
const racialSkills: Skill[] =
  data?.identity?.race === "Elfo" ? ["Perception"] : [];

// 🔹 Todas as perícias automáticas (background + raça)
const automaticSkills = React.useMemo(
  () =>
    new Set<Skill>([
      ...backgroundSkills,
      ...racialSkills
    ]),
  [backgroundSkills, racialSkills]
);



  // 🧠 Classe
  const className: string | undefined = data?.identity?.class;
  const classRule = className ? CLASS_SKILLS[className] : null;

  const [selectedClassSkills, setSelectedClassSkills] =
    React.useState<Skill[]>([]);

  function toggleClassSkill(skill: Skill) {
    setSelectedClassSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      }

      if (classRule && prev.length < classRule.choose) {
        return [...prev, skill];
      }

      return prev;
    });
  }

  useEffect(() => {
  const valid = remainingPoints === 0;
  onValidityChange(valid);
}, [remainingPoints, onValidityChange]);




  // 🔄 Persistência FINAL (Step 3)
 React.useEffect(() => {
  onUpdate({
    classSkills: selectedClassSkills
  });
}, [selectedClassSkills]);


  /* ===============================
     RENDER
  =============================== */

        const TOTAL_POINTS = 27;
      const usedPoints = TOTAL_POINTS - remainingPoints;
      const pointsPercent = (remainingPoints / TOTAL_POINTS) * 100;


  return (
    <div className="space-y-8 pb-32">



      {/* PROGRESS */}
      <div className="flex gap-2 md:gap-3">
        <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
        <div className="h-1.5 w-full bg-amber-500 rounded-full" />
        <div className="h-1.5 w-full bg-zinc-800 rounded-full" />
      </div>


      {/* HEADER */}
      <header className="space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-amber-400">
          Atributos do Personagem
        </h2>
        <p className="text-sm md:text-base text-zinc-400">
          Distribua os pontos que definem as capacidades do seu personagem.
        </p>
      </header>

      {/* POINTS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-5
 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-400">
            Pontos disponíveis
          </span>
          <span className="text-sm text-zinc-300">
            {remainingPoints} / {TOTAL_POINTS}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${pointsPercent}%` }}
          />
        </div>

        <div className="text-xs text-zinc-500 text-right">
          {usedPoints} pontos utilizados
        </div>
      </div>


      {/* IA */}
      <button
        onClick={onSuggest}
        disabled={isSuggesting}
        className={`w-full px-6 py-3 border rounded-lg flex items-center justify-center gap-2 transition
          ${
            isSuggesting
              ? "bg-zinc-700 border-zinc-600 text-zinc-400"
              : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300"
          }`}
      >
        {isSuggesting
          ? "✨ Pensando na melhor distribuição…"
          : "✨ Sugerir atributos com IA"}
      </button>

      {/* ATTRIBUTES */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(Object.keys(attributes) as (keyof Attributes)[]).map(key => (
          <div
            key={key}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-5
"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-zinc-200">
              {ATTRIBUTE_ICONS[key]}
              <h3>{ATTRIBUTE_LABELS[key]}</h3>
            </div>
              <span className="text-zinc-400">
                {getModifier(attributes[key])}
              </span>
            </div>

            <div className="flex justify-between items-center mt-4">
             <button
                  onClick={() => onDecrease(key)}
                  className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>

              <span className="text-xl text-amber-400">
                {attributes[key]}
              </span>
              <button onClick={() => onIncrease(key)}>
                <Plus />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* SKILLS */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
        <h3 className="text-zinc-300">Perícias Iniciais</h3>

        <div className="text-sm text-zinc-400">Automáticas</div>
        <div className="flex flex-wrap gap-2">
          {/* BACKGROUND */}
              {backgroundSkills.length > 0 && (
                <>
                  <div className="text-sm text-zinc-400 mt-2">
                    Background
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {backgroundSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
                      >
                        {SKILL_LABELS[skill]}
                      </span>
                    ))}
                  </div>
                </>
)}

                {/* RAÇA */}
                {racialSkills.length > 0 && (
                  <>
                    <div className="text-sm text-zinc-400 mt-4">
                      Raça
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {racialSkills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300"
                        >
                          {SKILL_LABELS[skill]}
                        </span>
                      ))}
                    </div>
                  </>
                )}

        </div>

        {classRule && (
          <>
            <div className="text-sm text-zinc-400 mt-4">
              Escolha {classRule.choose} perícias da classe (
              {selectedClassSkills.length}/{classRule.choose})
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {classRule.options.map(skill => {
                const selected = selectedClassSkills.includes(skill);
              const disabled =
                (!selected && automaticSkills.has(skill)) ||
                (!selected && selectedClassSkills.length >= classRule.choose);


                return (
                  <button
                    key={skill}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleClassSkill(skill)}
                    className={`px-3 py-2 rounded border text-sm transition
                      ${
                        selected
                          ? "bg-amber-500 text-zinc-900 border-amber-500"
                          : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                      }
                      ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {SKILL_LABELS[skill]}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* AI REASONING */}
      {aiReasoning && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setShowExplanation(p => !p)}
            className="w-full px-6 py-4 flex justify-between"
          >
            🧠 Por que essa distribuição?
            {showExplanation ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showExplanation && (
            <div className="px-6 pb-4 text-sm text-zinc-400">
              {aiReasoning}
            </div>
          )}
        </div>
      )}
      </div>
  );
};

export default Step2Gameplay;
