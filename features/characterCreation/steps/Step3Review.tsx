import { useEffect, useState } from "react";
import { saveCharacter } from "@/services/characterService";
import {
  Edit2,
  Sparkles,
  RefreshCw,
  User,
  Sword,
  Shield,
  Heart,
  Brain,
  Eye,
  Smile,
  Backpack,
  Coins
} from "lucide-react";
import avatarPadrao from "@/assets/avatar_padrao.png";

/* ===============================
   TYPES
=============================== */

interface Props {
  data: any;
  onConfirm: () => void;
  onEditStep: (step: 1 | 2) => void;
  onUpdate: (partial: any) => void;
}

/* ===============================
   EQUIPAMENTO INICIAL (PHB 5e)
=============================== */

const STARTING_EQUIPMENT: Record<string, string[]> = {
  Guerreiro: [
    "Espada longa",
    "Escudo",
    "Cota de malha",
    "Pacote do explorador"
  ],
  Mago: [
    "Cajado",
    "Livro de magias",
    "Bolsa de componentes",
    "Pacote do estudioso"
  ],
  Ladino: [
    "Rapiera",
    "Arco curto",
    "Ferramentas de ladrão",
    "Pacote do ladrão"
  ],
  Clérigo: [
    "Maça",
    "Escudo",
    "Símbolo sagrado",
    "Pacote do acólito"
  ],
  Paladino: [
    "Espada marcial",
    "Escudo",
    "Cota de malha",
    "Símbolo sagrado"
  ],
  Bárbaro: [
    "Machado grande",
    "Duas machadinhas",
    "Pacote do explorador"
  ],
  Bardo: [
    "Rapiera",
    "Instrumento musical",
    "Armadura leve",
    "Pacote do artista"
  ],
  Ranger: [
    "Espadas curtas",
    "Arco longo",
    "Pacote do explorador"
  ],
  Druida: [
    "Cajado",
    "Escudo de madeira",
    "Símbolo druídico",
    "Pacote do explorador"
  ],
  Monge: [
    "Bastão",
    "10 dardos",
    "Pacote do explorador"
  ],
  Feiticeiro: [
    "Adagas",
    "Bolsa de componentes",
    "Pacote do explorador"
  ],
  Bruxo: [
    "Adaga",
    "Foco arcano",
    "Pacote do estudioso"
  ]
};

/* ===============================
   OURO INICIAL (PHB 5e)
=============================== */

const STARTING_GOLD: Record<string, number> = {
  Bárbaro: 10,
  Bardo: 15,
  Clérigo: 15,
  Druida: 10,
  Guerreiro: 10,
  Monge: 5,
  Paladino: 15,
  Ranger: 10,
  Ladino: 15,
  Mago: 10,
  Feiticeiro: 10,
  Bruxo: 10
};

/* ===============================
   SKILL LABELS (PT-BR)
=============================== */

const SKILL_LABELS: Record<string, string> = {
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
   COMPONENT
=============================== */

export default function Step3Review({
  data,
  onConfirm,
  onEditStep,
  onUpdate
}: Props) {
  const [generatingAvatar, setGeneratingAvatar] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    data?.avatar || null
  );

  /* ===============================
     HELPERS
  =============================== */

  function calculateModifier(value?: number) {
    if (typeof value !== "number") return "—";
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  function getAttributeLabel(key: string) {
    switch (key) {
      case "strength":
        return "Força";
      case "dexterity":
        return "Destreza";
      case "constitution":
        return "Constituição";
      case "intelligence":
        return "Inteligência";
      case "wisdom":
        return "Sabedoria";
      case "charisma":
        return "Carisma";
      default:
        return key;
    }
  }

  const ATTRIBUTE_ICONS: Record<string, React.ReactNode> = {
    strength: <Sword className="w-4 h-4 text-red-400" />,
    dexterity: <Shield className="w-4 h-4 text-green-400" />,
    constitution: <Heart className="w-4 h-4 text-rose-400" />,
    intelligence: <Brain className="w-4 h-4 text-indigo-400" />,
    wisdom: <Eye className="w-4 h-4 text-cyan-400" />,
    charisma: <Smile className="w-4 h-4 text-amber-400" />
  };

  /* ===============================
     DATA NORMALIZATION (CORRIGIDO)
  =============================== */

  const attributes = data?.attributes ?? {};

  const backgroundSkills: string[] =
    data?.background?.grantedSkills ?? [];

  const racialSkills: string[] =
    data?.identity?.race === "Elfo" ? ["Perception"] : [];

  const classSkills: string[] =
    data?.classSkills ?? [];

  const skills: string[] = Array.from(
    new Set([
      ...backgroundSkills,
      ...racialSkills,
      ...classSkills
    ])
  );

  const backgroundDescription =
    data?.background?.description ?? "—";

  const characterClass = data?.identity?.class;

  const equipment =
    STARTING_EQUIPMENT[characterClass] ?? [];

  const gold =
    STARTING_GOLD[characterClass] ?? 0;

  /* ===============================
     RENDER
  =============================== */

    /* ===============================
     CONFIRM HANDLER (FINAL STEP)
  =============================== */

  const handleConfirm = async () => {
    try {
      const payload = {
        ...data,
        equipment,
        gold
      };

      console.log("📦 Payload final do personagem:", payload);

      await saveCharacter(payload);

      onConfirm();
    } catch (error) {
      console.error("Erro ao salvar personagem:", error);
    }
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);





  return (
    <div className="space-y-8 pb-32">

      {/* PROGRESS */}
      <div className="flex gap-2 md:gap-3">
        <div className="h-1.5 w-full bg-amber-500 rounded-full" />
        <div className="h-1.5 w-full bg-amber-500 rounded-full" />
        <div className="h-1.5 w-full bg-amber-500 rounded-full" />
      </div>


      <h1 className="text-xl md:text-2xl text-amber-400 mb-1">

        Revisão Final
      </h1>
      <p className="text-sm md:text-base text-zinc-400 mb-6">
        Confirme os detalhes do seu personagem antes de começar
      </p>

      <div className="space-y-6 mb-12">

        {/* AVATAR */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h2 className="text-zinc-300">
              Avatar do Personagem
            </h2>
          </header>

          <div className="p-4 md:p-6 flex flex-col items-center gap-4">
            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-amber-500 bg-zinc-800">
              <img
                src={avatarUrl || avatarPadrao}
                alt="Avatar do personagem"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => onEditStep(1)}
              className="text-sm text-amber-400 hover:underline"
            >
              Editar avatar e aparência
            </button>
          </div>
        </section>

        {/* IDENTIDADE */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-zinc-300">
              Identidade
            </h2>
            <button
              onClick={() => onEditStep(1)}
              className="text-amber-400 flex items-center gap-2 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </header>

          <div className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-zinc-500 text-sm">Nome</span>
                <p className="text-zinc-100">
                  {data?.identity?.name ?? "—"}
                </p>
              </div>

              <div>
                <span className="text-zinc-500 text-sm">Gênero</span>
                <p className="text-zinc-100">
                  {data?.identity?.gender ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="text-zinc-500 text-sm">Raça</span>
                <p className="text-zinc-100">
                  {data?.identity?.race ?? "—"}
                </p>
              </div>

              <div>
                <span className="text-zinc-500 text-sm">Classe</span>
                <p className="text-zinc-100">
                  {data?.identity?.class ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BACKGROUND */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800">
            <h2 className="text-zinc-300">
              Background
            </h2>
          </header>

          <div className="p-4 md:p-6 text-zinc-300 text-sm leading-relaxed">
            {backgroundDescription}
          </div>
        </section>

        {/* ATRIBUTOS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-zinc-300">Atributos</h2>
            <button
              onClick={() => onEditStep(2)}
              className="text-amber-400 flex items-center gap-2 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          </header>

          <div className="p-4 md:p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(attributes as Record<string, number>).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-center"
                >
                  <div className="flex justify-center gap-2 text-sm text-zinc-400 mb-1">
                    {ATTRIBUTE_ICONS[key]}
                    {getAttributeLabel(key)}
                  </div>
                  <div className="text-zinc-100 text-xl">
                    {value}
                  </div>
                  <div className="text-violet-400 text-sm">
                    {calculateModifier(value)}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* PERÍCIAS */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800">
            <h2 className="text-zinc-300">
              Perícias Iniciais
            </h2>
          </header>

          <div className="p-4 md:p-6 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-sm"
                >
                  {SKILL_LABELS[skill] ?? skill}
                </span>
              ))
            ) : (
              <span className="text-zinc-500 text-sm">
                Nenhuma perícia definida
              </span>
            )}
          </div>
        </section>

        {/* EQUIPAMENTO + OURO */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <header className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center gap-2">
            <Backpack className="w-5 h-5 text-amber-400" />
            <h2 className="text-zinc-300">
              Equipamento Inicial
            </h2>
          </header>

          <div className="p-4 md:p-6 space-y-4">
            <ul className="list-disc list-inside text-zinc-200">
              {equipment.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-amber-400">
              <Coins className="w-5 h-5" />
              <span>
                Bolsa com {gold} peças de ouro (gp)
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* CTA FINAL */}
      <div className="pt-6 border-t border-zinc-800">
  <button
    className="w-full md:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded transition-colors text-lg"
          onClick={handleConfirm}
        >
          Criar Personagem
        </button>
      </div>
    </div>
  );
}
