import { useEffect, useRef, useState } from "react";
import { apiPost } from "../services/api";

import NarrativeBubble from "./NarrativeBubble";
import PlayerBubble from "./PlayerBubble";

import mestreAvatar from "../assets/mestre.png";

/* ================================
   TYPES
================================= */

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

/* ================================
   COMPONENT
================================= */

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

  const [hasStarted, setHasStarted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const thinkingTextRef = useRef(
    THINKING_TEXTS[Math.floor(Math.random() * THINKING_TEXTS.length)]
  );

  /* ================================
     📜 Scroll automático (APENAS NO MIOL0)
  ================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, skillCheck, loading]);

  /* ================================
     🌱 INÍCIO DA CAMPANHA (UMA VEZ)
  ================================= */

  useEffect(() => {
    if (!campaignId || !characterId || hasStarted) return;

    startNarrative();
    setHasStarted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, characterId, hasStarted]);

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
    <div className="game-chat h-full flex flex-col overflow-hidden bg-zinc-950 text-zinc-100">
      {/* HEADER — FIXO POR LAYOUT */}
      <header className="game-chat-header flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
        <h2 className="text-xs sm:text-sm uppercase tracking-widest text-zinc-400">
          Aventura em andamento
        </h2>

        <button
          onClick={() => {
            setHasStarted(false);
            setMessages([]);
            setSkillCheck(null);
            setSelectedSkill(null);
            setInput("");
            if (onExit) onExit();
          }}
          className="text-sm text-amber-400 hover:underline whitespace-nowrap"
        >
          ← Menu
        </button>
      </header>

      {/* MENSAGENS — ÚNICO SCROLL */}
      <div className="game-chat-messages flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-8 space-y-10">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.role === "narrative" ? (
              <NarrativeBubble
                text={msg.content}
                avatar={mestreAvatar}
                speaker="Mestre"
              />
            ) : (
              <PlayerBubble
                text={msg.content}
                playerName="Você"
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="max-w-3xl mx-auto font-serif text-zinc-400 text-lg italic animate-pulse">
            {thinkingTextRef.current}
          </div>
        )}

        {skillCheck && skillCheck.options?.length > 0 && (
          <div className="skill-check max-w-3xl mx-auto mt-8 p-6 border-l-4 border-amber-600 bg-zinc-900/70 rounded-xl">
            <p className="mb-6 font-serif text-lg italic text-amber-200">
              {skillCheck.prompt}
            </p>

            <div className="flex gap-3 flex-wrap mb-6">
              {skillCheck.options.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(skill)}
                  className={`skill-option px-4 py-2 text-sm rounded-full transition ${
                    selectedSkill === skill ? "selected" : ""
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
                className="roll-dice-button px-5 py-2 rounded transition"
              >
                🎲 Rolar d20
              </button>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT — FIXO POR LAYOUT */}
      <div className="game-chat-input flex-shrink-0 border-t border-zinc-800 px-3 sm:px-4 py-3 bg-zinc-950">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Descreva sua próxima ação…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || !!skillCheck}
            className="flex-1 bg-zinc-800/70 px-3 py-3 rounded text-zinc-100 text-sm disabled:opacity-40"
          />

          <button
            onClick={() => sendAction(input)}
            disabled={!input || loading || !!skillCheck}
            className="px-4 py-3 bg-amber-600 text-black rounded hover:bg-amber-500 disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
