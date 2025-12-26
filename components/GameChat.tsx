import { useEffect, useRef, useState } from "react";
import { apiPost } from "../services/api";

type SkillCheck = {
  prompt: string;
  difficultyClass: number;
  options: string[];
};

type Message = {
  role: "narrative" | "player";
  content: string;
};

type Props = {
  campaignId: string;
  characterId: string;
  onExit?: () => void;
};

/* ================================
   🧠 TEXTOS – IA “PENSANDO”
================================= */
const THINKING_TEXTS = [
  "O mundo parece suspender a respiração…",
  "Forças invisíveis se rearranjam ao seu redor…",
  "O destino pondera as consequências…",
  "Algo se move além do que seus sentidos alcançam…",
  "O silêncio carrega possibilidades ocultas…"
];

export default function GameChat({
  campaignId,
  characterId,
  onExit
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [skillCheck, setSkillCheck] =
    useState<SkillCheck | null>(null);
  const [selectedSkill, setSelectedSkill] =
    useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  const thinkingTextRef = useRef(
    THINKING_TEXTS[Math.floor(Math.random() * THINKING_TEXTS.length)]
  );

  /* ================================
     📜 Scroll automático
  ================================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, skillCheck, loading]);

  /* ================================
     🌱 INÍCIO DA CAMPANHA
  ================================= */
  useEffect(() => {
    if (!campaignId || !characterId) return;
    startNarrative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, characterId]);

  async function startNarrative() {
    thinkingTextRef.current =
      THINKING_TEXTS[Math.floor(Math.random() * THINKING_TEXTS.length)];

    setLoading(true);
    setMessages([]);
    setSkillCheck(null);
    setSelectedSkill(null);

    try {
      const data = await apiPost<any>("/playTurn", {
        campaignId,
        characterId,
        playerAction: "__START__"
      });

      setMessages([
        { role: "narrative", content: data.narrative }
      ]);

      setSkillCheck(data.skillCheck ?? null);
    } catch (err) {
      console.error("Erro ao iniciar campanha:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================================
     🎭 Ação textual
  ================================= */
  async function sendAction(actionText: string) {
    if (!actionText.trim() || loading || skillCheck) return;

    thinkingTextRef.current =
      THINKING_TEXTS[Math.floor(Math.random() * THINKING_TEXTS.length)];

    setLoading(true);

    try {
      const data = await apiPost<any>("/playTurn", {
        campaignId,
        characterId,
        playerAction: actionText
      });

      setMessages(prev => [
        ...prev,
        { role: "player", content: actionText },
        { role: "narrative", content: data.narrative }
      ]);

      setSkillCheck(data.skillCheck ?? null);
      setInput("");
    } catch (err) {
      console.error("Erro ao enviar ação:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================================
     🎲 Rolagem de dado
  ================================= */
  async function rollDice() {
    if (!selectedSkill || loading || !skillCheck) return;

    const roll = Math.floor(Math.random() * 20) + 1;
    const actionText = `Uso ${selectedSkill} e obtenho ${roll} no d20.`;

    thinkingTextRef.current =
      THINKING_TEXTS[Math.floor(Math.random() * THINKING_TEXTS.length)];

    setLoading(true);

    try {
      const data = await apiPost<any>("/playTurn", {
        campaignId,
        characterId,
        playerAction: actionText,
        diceRoll: {
          skill: selectedSkill,
          value: roll
        }
      });

      setMessages(prev => [
        ...prev,
        { role: "player", content: actionText },
        { role: "narrative", content: data.narrative }
      ]);

      setSkillCheck(null);
      setSelectedSkill(null);
    } catch (err) {
      console.error("Erro na rolagem:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ================================
     ⌨️ Enter
  ================================= */
  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && !skillCheck) {
      e.preventDefault();
      sendAction(input);
    }
  }

  /* ================================
     📖 Render
  ================================= */
  return (
    <div className="game-chat bg-zinc-950 text-zinc-100">
      <header className="game-chat-header flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <h2 className="text-sm uppercase tracking-widest text-zinc-400">
          Aventura em andamento
        </h2>

        <button
          onClick={() => {
            if (onExit) onExit();
          }}
          className="text-sm text-amber-400 hover:underline"
        >
          ← Voltar ao menu
        </button>
      </header>

      <div className="game-chat-messages px-6 py-8 space-y-10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.role === "narrative"
                ? "max-w-3xl mx-auto narrative-text whitespace-pre-line"
                : "max-w-3xl mx-auto text-right player-text"
            }
          >

            {msg.role === "player" && (
              <span className="block mb-1 text-xs text-zinc-500">
                Sua ação
              </span>
            )}

            {msg.content.split("\n\n").map((p, i) => (
              <p key={i} className="mb-6">
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* 🧠 IA pensando */}
        {loading && (
          <div className="max-w-3xl mx-auto font-serif text-zinc-400 text-lg italic animate-pulse">
            {thinkingTextRef.current}
          </div>
        )}

       {skillCheck && skillCheck.options?.length > 0 && (
  <div className="max-w-3xl mx-auto mt-8 p-5 border-l-4 border-amber-600 bg-zinc-900/60">
    <p className="mb-4 italic text-zinc-300">
      {skillCheck.prompt}
    </p>

    <div className="flex gap-2 flex-wrap">
      {skillCheck.options.map(skill => (

                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    selectedSkill === skill
                      ? "bg-amber-600 text-black"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {selectedSkill && (
              <button
                onClick={rollDice}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-zinc-800 rounded hover:bg-zinc-700"
              >
                🎲 Rolar d20
              </button>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

    <div className="game-chat-input border-t border-zinc-800 px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Descreva sua próxima ação…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || !!skillCheck}
            className="flex-1 bg-zinc-800/70 px-3 py-2 rounded text-zinc-100 text-sm disabled:opacity-40"
          />

          <button
            onClick={() => sendAction(input)}
            disabled={!input || loading || !!skillCheck}
            className="px-4 py-2 bg-amber-600 text-black rounded hover:bg-amber-500 disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
