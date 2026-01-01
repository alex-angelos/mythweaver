import { useEffect, useRef, useState } from "react";
import {
  HelpCircle,
  Sparkles, 
  User, 
  Scissors, 
  X,
  BookOpen,
  VenetianMask,
  Skull,
  Music,
  Users,
  Hammer,
  Scroll,
  Crown,
  Mountain,
  Brain,
  Anchor,
  Shield
} from "lucide-react";


async function suggestEssenceFromAI(character: any) {
  const response = await fetch(
    "https://us-central1-mythweaver-mvp.cloudfunctions.net/suggestCharacterEssence",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: character.identity.name,
        race: character.identity.race,
        class: character.identity.class,
        gender: character.identity.gender,
        appearanceHint: character.appearance || "",
        backstoryHint: character.background?.description || ""
      })
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar sugestão da IA");
  }

  return response.json();
}

/* ===============================
   D&D 5e DATA
=============================== */

const RACES: Record<string, string[]> = {
  Humano: [],
  Elfo: ["Alto Elfo", "Elfo da Floresta", "Elfo Negro (Drow)"],
  Anão: ["Anão da Colina", "Anão da Montanha"],
  Halfling: ["Pés-Leves", "Robusto"],
  MeioElfo: [],
  Tiefling: [
    "Asmodeus",
    "Baalzebul",
    "Dispater",
    "Fierna",
    "Glasya",
    "Levistus",
    "Mammon",
    "Mephistopheles",
    "Zariel"
  ],
  Draconato: [
    "Fogo – Vermelho",
    "Relâmpago – Azul",
    "Veneno – Verde",
    "Ácido – Preto",
    "Gelo – Branco",
    "Fogo – Dourado",
    "Gelo – Prateado",
    "Relâmpago – Bronze",
    "Ácido – Cobre",
    "Fogo – Latão"
  ]
};

const CLASSES: Record<string, string[]> = {
  Guerreiro: ["Campeão", "Mestre de Batalha", "Cavaleiro Arcano"],
  Mago: ["Evocação", "Abjuração", "Ilusão", "Necromancia"],
  Ladino: ["Ladrão", "Assassino", "Trapaceiro Arcano"],
  Clérigo: ["Vida", "Guerra", "Luz", "Conhecimento"],
  Paladino: ["Devoção", "Vingança", "Anciões"],
  Bárbaro: ["Berserker", "Totem Espiritual"],
  Bardo: ["Conhecimento", "Bravura"],
  Ranger: ["Caçador", "Mestre das Feras"],
  Druida: ["Círculo da Terra", "Círculo da Lua"],
  Monge: [
    "Caminho da Mão Aberta",
    "Caminho da Sombra",
    "Caminho dos Quatro Elementos"
  ],
  Feiticeiro: ["Linhagem Dracônica", "Magia Selvagem"],
  Bruxo: ["Arquifada", "Demônio", "Grande Antigo"]
};

const GENDERS = ["Masculino", "Feminino", "Não-binário", "Outro"];

const BACKGROUNDS: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    grantedSkills: string[];
    description: string;
  }
> = {
  Acolito: {
    label: "Acólito",
    icon: <BookOpen className="w-4 h-4" />,
    grantedSkills: ["Insight", "Religion"],
    description:
      "Criado em templos e locais sagrados, você serviu uma divindade e aprendeu rituais, tradições religiosas e doutrinas antigas."
  },
  Charlatao: {
    label: "Charlatão",
    icon: <VenetianMask className="w-4 h-4" />,
    grantedSkills: ["Deception", "Sleight of Hand"],
    description:
      "Você viveu enganando os outros, usando truques, identidades falsas e lábia para sobreviver."
  },
  Criminoso: {
    label: "Criminoso",
    icon: <Skull className="w-4 h-4" />,
    grantedSkills: ["Deception", "Stealth"],
    description:
      "Você atuou à margem da lei, envolvido em roubos, contrabando ou atividades ilegais."
  },
  Artista: {
    label: "Artista",
    icon: <Music className="w-4 h-4" />,
    grantedSkills: ["Acrobatics", "Performance"],
    description:
      "Você se apresentou para multidões, vivendo de música, dança, atuação ou espetáculos."
  },
  HeroiPopular: {
    label: "Herói Popular",
    icon: <Users className="w-4 h-4" />,
    grantedSkills: ["Animal Handling", "Survival"],
    description:
      "Você veio do povo simples e tornou-se um símbolo de esperança para comunidades humildes."
  },
  Artesao: {
    label: "Artesão de Guilda",
    icon: <Hammer className="w-4 h-4" />,
    grantedSkills: ["Insight", "Persuasion"],
    description:
      "Membro de uma guilda, você aprendeu um ofício e a negociar dentro de organizações formais."
  },
  Eremita: {
    label: "Eremita",
    icon: <Scroll className="w-4 h-4" />,
    grantedSkills: ["Medicine", "Religion"],
    description:
      "Você viveu isolado, afastado da sociedade, refletindo sobre os mistérios do mundo."
  },
  Nobre: {
    label: "Nobre",
    icon: <Crown className="w-4 h-4" />,
    grantedSkills: ["History", "Persuasion"],
    description:
      "Criado entre a elite, você entende política, etiqueta e jogos de poder."
  },
  Forasteiro: {
    label: "Forasteiro",
    icon: <Mountain className="w-4 h-4" />,
    grantedSkills: ["Athletics", "Survival"],
    description:
      "Você cresceu em regiões selvagens, aprendendo a sobreviver longe da civilização."
  },
  Sabio: {
    label: "Sábio",
    icon: <Brain className="w-4 h-4" />,
    grantedSkills: ["Arcana", "History"],
    description:
      "Você dedicou sua vida ao estudo, pesquisa e busca por conhecimento."
  },
  Marinheiro: {
    label: "Marinheiro",
    icon: <Anchor className="w-4 h-4" />,
    grantedSkills: ["Athletics", "Perception"],
    description:
      "Você viveu nos mares, enfrentando tempestades e perigos em longas viagens."
  },
  Soldado: {
    label: "Soldado",
    icon: <Shield className="w-4 h-4" />,
    grantedSkills: ["Athletics", "Intimidation"],
    description:
      "Você serviu em exércitos ou milícias, treinado para combate e disciplina."
  }
};





/* ===============================
   TYPES
=============================== */

interface Props {
  data: any;
  onUpdate: (partial: any) => void;
  onValidityChange: (valid: boolean) => void;
}

/* ===============================
   AVATAR PROMPT BUILDER
=============================== */

function buildAvatarPrompt(data: any) {
  const identity = data.identity || {};
  const parts: string[] = [];

  // 🎨 Base técnica
  parts.push(
    "High fantasy character portrait, ultra detailed, cinematic lighting, realistic style"
  );

  // 🧍 Identidade
  if (identity.name) parts.push(`Character name: ${identity.name}`);
  if (identity.race) parts.push(`Race: ${identity.race}`);
  if (identity.raceDetail)
    parts.push(`Lineage / subrace / ancestry: ${identity.raceDetail}`);
  if (identity.class) parts.push(`Class: ${identity.class}`);
  if (identity.archetype)
    parts.push(`Archetype or path: ${identity.archetype}`);
  if (identity.gender)
    parts.push(`Gender expression: ${identity.gender}`);

  // 🌍 Ambiente narrativo por classe
  const classEnvironmentMap: Record<string, string> = {
    Druida:
      "Natural environment background such as ancient forests, stone circles, misty groves, sacred trees, or wild landscapes",
    Guerreiro:
      "Martial environment such as battlefields, training grounds, war camps, or fortified strongholds",
    Paladino:
      "Sacred or noble setting such as temples, radiant halls, holy ruins, or battlefield sanctuaries",
    Clérigo:
      "Religious environment such as shrines, cathedrals, holy libraries, or ritual chambers",
    Mago:
      "Arcane environment such as ancient towers, libraries, arcane laboratories, or rune-filled chambers",
    Feiticeiro:
      "Mystical and volatile environment reflecting innate magic, elemental energies, or arcane surges",
    Bruxo:
      "Dark or otherworldly environment with eldritch symbols, shadowed ruins, infernal or fey influences",
    Ladino:
      "Urban or shadowy environment such as alleyways, rooftops, hidden rooms, or dimly lit interiors",
    Ranger:
      "Wilderness environment such as forests, mountains, borderlands, or untamed nature",
    Bárbaro:
      "Harsh or primal environment such as frozen tundras, wild plains, tribal lands, or stormy landscapes",
    Bardo:
      "Expressive environment such as taverns, stages, courts, or travel roads with artistic elements",
    Monge:
      "Serene or ascetic environment such as monasteries, mountain temples, or tranquil courtyards"
  };

  if (identity.class && classEnvironmentMap[identity.class]) {
    parts.push(`Background environment: ${classEnvironmentMap[identity.class]}`);
  }

  // 👁️ Aparência física
  if (data.appearance) {
    parts.push(`Physical appearance: ${data.appearance}`);
  }

  // 📜 História molda visual
  if (data.background?.description) {
    parts.push(
      `Backstory influence visible in scars, attire, posture, or symbolic details: ${data.background.description}`
    );
  }

  // 🧠 Motivação define emoção dominante
  if (data.background?.motivation) {
    parts.push(
      `Dominant emotional tone and personality: ${data.background.motivation}`
    );
    parts.push(
      "Facial expression, posture, gaze, and mood must clearly reflect this motivation"
    );
  }

  // 🎭 Direção emocional explícita
  parts.push(
    "Avoid neutral expressions. The character must visually convey a clear emotional state such as serenity, wrath, determination, melancholy, vengeance, curiosity, devotion, or inner conflict, according to their story"
  );

  // 🖌️ Estilo final
  parts.push(
    "dark fantasy, dramatic shadows, painterly realism, expressive eyes, storytelling through pose, lighting, and environment, no anime, no cartoon, high realism"
  );

  return parts.join(", ");
}


/* ===============================
   COMPONENT
=============================== */

export default function Step1Essence({
  data,
  onUpdate,
  onValidityChange
}: Props) {
  const identity = data.identity || {};

  

  const [appearance, setAppearance] = useState(data.appearance || "");

  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  


  const [backstory, setBackstory] = useState(
    data.background?.description || ""
  );
  const [motivation, setMotivation] = useState(
    data.background?.motivation || ""
  );

  const [selectedBackground, setSelectedBackground] = useState<string>(
  data.background?.key || ""
);
const [showBackgroundHelp, setShowBackgroundHelp] = useState(false);



  const [avatarPrompt, setAvatarPrompt] = useState(
    data.avatar?.prompt || ""
  );

  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const [avatarImage, setAvatarImage] = useState<string | null>(
  data.avatar || null
);


  const [isSuggesting, setIsSuggesting] = useState(false);

  /* ===============================
     IA REAL — HANDLERS
  =============================== */

async function handleSuggestName() {
  if (!identity.race || !identity.class || !identity.gender) return;

  try {
    setIsLoadingName(true);
    setNameError(null);

    const response = await fetch(
      "https://us-central1-mythweaver-mvp.cloudfunctions.net/suggestCharacterName",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          race: identity.race,
          class: identity.class,
          gender: identity.gender
        })
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao buscar nomes");
    }

    const data = await response.json();
    setNameSuggestions(data.names || []);
  } catch (err) {
    setNameError("Não foi possível gerar nomes agora.");
  } finally {
    setIsLoadingName(false);
  }
}




  async function handleSuggestAppearance() {
    try {
      setIsSuggesting(true);
      const result = await suggestEssenceFromAI(data);
      if (result.appearance) {
        setAppearance(result.appearance);
      }
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSuggestBackstory() {
    try {
      setIsSuggesting(true);
      const result = await suggestEssenceFromAI(data);
      if (result.backstory) {
        setBackstory(result.backstory);
      }
    } finally {
      setIsSuggesting(false);
    }
  }

  async function handleSuggestMotivation() {
    try {
      setIsSuggesting(true);
      const result = await suggestEssenceFromAI(data);
      if (result.motivation) {
        setMotivation(result.motivation);
      }
    } finally {
      setIsSuggesting(false);
    }
  }

  /* ===============================
     IA MOCK (PRESERVADO)
  =============================== */

  function suggest(type: string) {
    if (type === "name") {
      onUpdate({
        identity: { ...identity, name: "Azael" }
      });
    }
    if (type === "appearance") {
      setAppearance("Traços marcantes, vestes naturais e postura confiante.");
    }
    if (type === "backstory") {
      setBackstory("Criado longe da civilização, moldado por rituais antigos.");
    }
    if (type === "motivation") {
      setMotivation(
        "Busca compreender sua origem e proteger o equilíbrio do mundo."
      );
    }
  }



  /* ===============================
     VALIDATION
  =============================== */

  useEffect(() => {
    const valid =
      identity.name &&
      identity.race &&
      identity.class &&
      appearance.trim().length > 0 &&
      backstory.trim().length > 0;

    onValidityChange(Boolean(valid));
  }, [identity, appearance, backstory, onValidityChange]);

  /* ===============================
     SYNC
  =============================== */

      useEffect(() => {
        onUpdate({
          identity,
          appearance,
          background: {
            key: selectedBackground,
            label: BACKGROUNDS[selectedBackground]?.label,
            grantedSkills:
              BACKGROUNDS[selectedBackground]?.grantedSkills || [],
            description: backstory,
            motivation
          },
          avatar: avatarImage
        });
      }, [
        identity,
        appearance,
        backstory,
        motivation,
        avatarImage,
        selectedBackground
      ]);


  // 🔁 SINCRONIZA AVATAR AO VOLTAR PARA O STEP
  useEffect(() => {
    if (data.avatar) {
      setAvatarImage(data.avatar);
    }
  }, [data.avatar]);


  /* ===============================
     CROP STATE
  =============================== */

  const [rawImage, setRawImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const lastTouchDistance = useRef<number | null>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ===============================
     CANVAS DRAW
  =============================== */

  function drawCanvas() {
    if (!canvasRef.current || !imgRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const size = 256;
    canvasRef.current.width = size;
    canvasRef.current.height = size;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.translate(size / 2 + offset.x, size / 2 + offset.y);
    ctx.scale(zoom, zoom);

    ctx.drawImage(
      imgRef.current,
      -imgRef.current.width / 2,
      -imgRef.current.height / 2
    );

    ctx.restore();
  }

  useEffect(() => {
    drawCanvas();
  }, [zoom, offset, rawImage]);

  /* ===============================
     CROP ACTIONS
  =============================== */

function applyCrop() {
  if (!canvasRef.current) return;

  const croppedImage = canvasRef.current.toDataURL("image/png");

  setAvatarImage(croppedImage);
  setIsCropping(false);
  setRawImage(null);
  setZoom(1);
  setOffset({ x: 0, y: 0 });

  onUpdate({
    avatar: croppedImage
  });
}


  function resetAvatar() {
    setAvatarImage(null);
    setRawImage(null);
    setIsCropping(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });

    onUpdate({
    avatar: null
      });
  }

function handleCopyAvatarPrompt() {
  if (!avatarPrompt) return;

  // Clipboard moderno (HTTPS)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(avatarPrompt).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 1500);
    });
    return;
  }

  // Fallback (dev / ambientes inseguros)
  const textarea = document.createElement("textarea");
  textarea.value = avatarPrompt;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  } catch (err) {
    console.error("Falha ao copiar prompt", err);
  } finally {
    document.body.removeChild(textarea);
  }
}



  /* ===============================
     POINTER HANDLERS
  =============================== */

  function onPointerDown(x: number, y: number) {
    isDragging.current = true;
    lastPos.current = { x, y };
  }

  function onPointerMove(x: number, y: number) {
    if (!isDragging.current) return;
    setOffset(o => ({ x: o.x + (x - lastPos.current.x), y: o.y + (y - lastPos.current.y) }));
    lastPos.current = { x, y };
  }

  function onPointerUp() {
    isDragging.current = false;
    lastTouchDistance.current = null;
  }

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      onPointerMove(e.clientX, e.clientY);
    }
    function handleMouseUp() {
      onPointerUp();
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDistance.current !== null) {
          setZoom(z =>
            Math.min(2, Math.max(0.5, z + (dist - lastTouchDistance.current!) / 200))
          );
        }
        lastTouchDistance.current = dist;
      }
    }
    function handleTouchEnd() {
      onPointerUp();
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  /* ===============================
     RENDER
  =============================== */



  return (
    <div className="max-w-4xl mx-auto px-6 py-8 pb-40 overflow-y-auto max-h-[calc(100vh-140px)]">

      {showBackgroundHelp && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-lg p-6 space-y-4">
      <div className="flex items-center gap-2 text-amber-400">
        {selectedBackground && BACKGROUNDS[selectedBackground]?.icon}
        <h3 className="text-lg">
          {selectedBackground
            ? BACKGROUNDS[selectedBackground].label
            : "O que é Background?"}
        </h3>
      </div>

      <p className="text-zinc-300 text-sm leading-relaxed">
        {selectedBackground
          ? BACKGROUNDS[selectedBackground].description
          : "O background representa a vida do personagem antes da aventura começar."}
      </p>

      {selectedBackground && (
        <div className="text-sm text-zinc-400">
          <strong>Perícias concedidas:</strong>{" "}
          {BACKGROUNDS[selectedBackground].grantedSkills.join(", ")}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setShowBackgroundHelp(false)}
          className="px-4 py-2 bg-amber-500 text-zinc-900 rounded hover:bg-amber-400 transition"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
)}

      {/* HEADER */}
      <h1 className="text-amber-400 mb-2">Forjar Personagem</h1>
      <p className="text-zinc-400 mb-10">
        Defina a essência do seu personagem
      </p>

      {/* IDENTIDADE */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 mb-8">
        <h2 className="text-zinc-300">Identidade</h2>

        <div className="flex gap-2">
          <input
            placeholder="Nome do personagem"
            value={identity.name || ""}
            onChange={e =>
              onUpdate({ identity: { ...identity, name: e.target.value } })
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-3"
          />
          <button
              onClick={handleSuggestName}
              disabled={!identity.race || !identity.class || !identity.gender || isLoadingName}
              className={`px-4 border rounded ${
                !identity.race || !identity.class || !identity.gender
                  ? "bg-zinc-800 border-zinc-700 opacity-40 cursor-not-allowed"
                  : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
              }`}
              title="Sugestão baseada em raça, classe e gênero"
            >
              {isLoadingName ? "…" : <Sparkles className="w-4 h-4" />}
</button>

        </div>

        {nameSuggestions.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-3">
    {nameSuggestions.map(name => (
      <button
        key={name}
        onClick={() => {
          onUpdate({ identity: { ...identity, name } });
          setNameSuggestions([]);
        }}
        className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-amber-500 hover:text-zinc-900 transition"
      >
        {name}
      </button>
    ))}
  </div>
)}

{nameError && (
  <p className="text-sm text-red-400 mt-2">{nameError}</p>
)}


        {/* RAÇA */}
        <select
          value={identity.race || ""}
          onChange={e =>
            onUpdate({
              identity: { ...identity, race: e.target.value, raceDetail: "" }
            })
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
        >
          <option value="">Selecione a raça</option>
          {Object.keys(RACES).map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>

        {RACES[identity.race]?.length > 0 && (
          <select
            value={identity.raceDetail || ""}
            onChange={e =>
              onUpdate({
                identity: { ...identity, raceDetail: e.target.value }
              })
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
          >
            <option value="">Detalhe da raça</option>
            {RACES[identity.race].map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}

        {/* CLASSE */}
        <select
          value={identity.class || ""}
          onChange={e =>
            onUpdate({
              identity: { ...identity, class: e.target.value, archetype: "" }
            })
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
        >
          <option value="">Selecione a classe</option>
          {Object.keys(CLASSES).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {CLASSES[identity.class]?.length > 0 && (
          <select
            value={identity.archetype || ""}
            onChange={e =>
              onUpdate({
                identity: { ...identity, archetype: e.target.value }
              })
            }
            className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
          >
            <option value="">Arquétipo</option>
            {CLASSES[identity.class].map(a => (
              <option key={a}>{a}</option>
            ))}
          </select>
        )}

        {/* GÊNERO */}
        <select
          value={identity.gender || ""}
          onChange={e =>
            onUpdate({ identity: { ...identity, gender: e.target.value } })
          }
          className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
        >
          <option value="">Gênero</option>
          {GENDERS.map(g => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </section>

      {/* NARRATIVA */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4 mb-8">

               <div className="space-y-2">
  <div className="flex items-center gap-2 text-zinc-300 text-sm">
    <span>Background</span>
    <button
      type="button"
      onClick={() => setShowBackgroundHelp(true)}
      className="text-zinc-400 hover:text-amber-400 transition"
      title="O que é Background?"
    >
      <HelpCircle className="w-4 h-4" />
    </button>
  </div>

  <select
    value={selectedBackground}
    onChange={e => {
      const key = e.target.value;
      const bg = BACKGROUNDS[key];

      setSelectedBackground(key);

      onUpdate({
        background: {
          key,
          label: bg.label,
          grantedSkills: bg.grantedSkills,
          description: bg.description,
          motivation
        }
      });

      // preenche a história base automaticamente
      setBackstory(bg.description);
    }}
    className="w-full bg-zinc-900 border border-zinc-800 rounded p-3"
  >
    <option value="">Selecione o background</option>
    {Object.entries(BACKGROUNDS).map(([key, bg]) => (
      <option key={key} value={key}>
        {bg.label}
      </option>
    ))}
  </select>
</div>


        <div className="flex gap-2">
          <textarea
            value={appearance}
            onChange={e => setAppearance(e.target.value)}
            placeholder="Aparência"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-3 resize-none"
          />
          <button
              onClick={handleSuggestAppearance}
              disabled={isSuggesting}
              className="h-11 w-11 flex items-center justify-center border rounded
                  bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition
                  disabled:opacity-40 disabled:cursor-not-allowed"
              title="Sugestão assistida por IA"
            >
              {isSuggesting ? "…" : <Sparkles className="w-4 h-4" />}
            </button>

        </div>

        <div className="flex gap-2">
          <textarea
            value={backstory}
            onChange={e => setBackstory(e.target.value)}
            placeholder="História"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-3 resize-none"
          />
          <button
                onClick={handleSuggestBackstory}
                disabled={isSuggesting}
                className="h-11 w-11 flex items-center justify-center border rounded
                  bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition
                  disabled:opacity-40 disabled:cursor-not-allowed"

                title="Sugestão assistida por IA"
              >
                {isSuggesting ? "…" : <Sparkles className="w-4 h-4" />}
              </button>

        </div>

        <div className="flex gap-2">
          <textarea
            value={motivation}
            onChange={e => setMotivation(e.target.value)}
            placeholder="Motivação"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-3 resize-none"
          />
           <button
                onClick={handleSuggestMotivation}
                disabled={isSuggesting}
                className="h-11 w-11 flex items-center justify-center border rounded
                  bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition
                  disabled:opacity-40 disabled:cursor-not-allowed"
                title="Sugestão assistida por IA"
              >
                {isSuggesting ? "…" : <Sparkles className="w-4 h-4" />}
              </button>
        </div>
      </section>

      {/* AVATAR */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h2 className="text-zinc-300 mb-4">Avatar</h2>

        {!isCropping && (
          <div className="flex flex-col items-center gap-4">
            {!avatarImage ? (
              <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-zinc-600" />
              </div>
            ) : (
              <img
                src={avatarImage}
                className="w-32 h-32 rounded-full object-cover border-2 border-amber-500"
              />
            )}

            <button
              onClick={() => setAvatarPrompt(buildAvatarPrompt(data))}
              className="px-4 py-2 bg-violet-900/30 border border-violet-700/40 rounded text-violet-300 text-sm"
            >
              ✨ Gerar prompt de avatar
            </button>

           {avatarPrompt && (
            <div className="space-y-2">
              <textarea
                readOnly
                value={avatarPrompt}
                rows={6}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-sm"
              />

              <button
                onClick={handleCopyAvatarPrompt}
                className="px-3 py-1 text-sm border border-zinc-700 rounded
                  bg-zinc-800 hover:bg-zinc-700 transition
                  flex items-center gap-2"
              >
                {copiedPrompt ? "✔ Copiado" : "📋 Copiar prompt"}
              </button>
            </div>
          )}


            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setRawImage(URL.createObjectURL(file));
                setIsCropping(true);
              }}
            />

            {avatarImage && (
              <button
                onClick={resetAvatar}
                className="text-sm text-zinc-400 underline"
              >
                Trocar imagem
              </button>
            )}
          </div>
        )}

        {isCropping && (
          <div className="flex flex-col items-center gap-4">
            <canvas
              ref={canvasRef}
              className="border border-zinc-700 touch-none cursor-grab active:cursor-grabbing"
              onMouseDown={e => {
                e.preventDefault();
                onPointerDown(e.clientX, e.clientY);
              }}
              onTouchStart={e => {
                e.preventDefault();
                if (e.touches.length === 1) {
                  onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
            />

            <img
              ref={imgRef}
              src={rawImage || ""}
              className="hidden"
              onLoad={drawCanvas}
            />

            <input
              type="range"
              min={0.5}
              max={2}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
            />

            <div className="flex gap-4">
              <button
                onClick={applyCrop}
                className="px-4 py-2 bg-amber-500 text-zinc-900 rounded flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Aplicar corte
              </button>
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 text-zinc-400 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
