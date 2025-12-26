import { useEffect, useState } from "react";
import avatarPadrao from "../assets/avatar_padrao.png";

type Character = {
  id: string;
  name: string;
  race?: string;
  class?: string;

  currentEmotion?: string;

  inventory?: { name: string; quantity?: number }[];

  reputation?: {
    global?: {
      fama?: number;
      infamia?: number;
    };
  };

  currentMission?: {
    title?: string;
    objective?: string;
  };

  location?: {
    world?: string;
    region?: string;
    city?: string;
  };

  stats?: {
    level?: number;

    hp?: {
      current: number;
      max: number;
    };

    points?: {
      label?: string;
      current: number;
      max: number;
    };

    xp?: {
      current: number;
      nextLevel: number;
    };
  };
};

type Props = {
  character: Character | null;
  onClose?: () => void;
};

export default function Sidebar({ character, onClose }: Props) {
  const [openStatus, setOpenStatus] = useState(true);
  const [openEquipment, setOpenEquipment] = useState(false);
  const [openSpells, setOpenSpells] = useState(false);

  const [animatePointer, setAnimatePointer] = useState(false);
  const [showReputationHint, setShowReputationHint] = useState(false);

  /* =============================
     🖼️ AVATAR
  ============================== */

  const [avatar, setAvatar] = useState<string>(avatarPadrao);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (!character) {
    return (
      <aside className="sidebar w-72 border-r border-zinc-800 bg-zinc-950 p-4 text-zinc-500">
        <p className="text-sm italic">Nenhum personagem selecionado.</p>
      </aside>
    );
  }

  /* =============================
     DADOS BÁSICOS
  ============================== */

  const inventory = Array.isArray(character.inventory)
    ? character.inventory
    : [];

  const fama = character.reputation?.global?.fama ?? 0;
  const infamia = character.reputation?.global?.infamia ?? 0;

  const reputationScore = Math.max(
    -100,
    Math.min(100, fama * 10 - infamia * 10)
  );

  const pointerPosition = ((reputationScore + 100) / 200) * 100;

  useEffect(() => {
    setAnimatePointer(true);
    const timer = setTimeout(() => setAnimatePointer(false), 250);
    return () => clearTimeout(timer);
  }, [fama, infamia]);

  let reputationNarrative =
    "O mundo observa suas escolhas com cautela.";
  if (reputationScore <= -30) {
    reputationNarrative =
      "Seu nome é sussurrado com medo. Onde você passa, a desconfiança o precede.";
  } else if (reputationScore >= 30) {
    reputationNarrative =
      "Histórias sobre seus feitos correm à sua frente. Muitos veem você como esperança.";
  }

  const missionTitle =
    character.currentMission?.title ?? "Sem missão ativa";

  const missionObjective =
    character.currentMission?.objective ??
    "Nenhum objetivo definido.";

  const location = {
    world: character.location?.world ?? "Mundo desconhecido",
    region: character.location?.region ?? "Região desconhecida",
    city: character.location?.city ?? "Local não identificado"
  };

  /* =============================
     STATUS VITAIS
  ============================== */

  const level = character.stats?.level ?? 1;

  const hpCurrent = character.stats?.hp?.current ?? 10;
  const hpMax = character.stats?.hp?.max ?? 10;
  const hpPercent = Math.min(100, (hpCurrent / hpMax) * 100);

  const pointsLabel =
    character.stats?.points?.label ?? "Pontos";
  const pointsCurrent = character.stats?.points?.current ?? 5;
  const pointsMax = character.stats?.points?.max ?? 5;
  const pointsPercent = Math.min(
    100,
    (pointsCurrent / pointsMax) * 100
  );

  const xpCurrent = character.stats?.xp?.current ?? 0;
  const xpNext = character.stats?.xp?.nextLevel ?? 100;
  const xpPercent = Math.min(100, (xpCurrent / xpNext) * 100);

  /* =============================
     📷 UPLOAD AVATAR
  ============================== */

  function handleAvatarChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setTempAvatar(reader.result);
        setOffset({ x: 0, y: 0 });
        setShowAvatarEditor(true);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <aside className="sidebar relative w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* ❌ FECHAR (MOBILE) */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 text-lg z-10"
        >
          ✕
        </button>
      )}

      {/* 🖼️ AVATAR */}
      <div className="p-4 border-b border-zinc-800 flex flex-col items-center gap-3">
        <img
          src={avatar}
          alt="Avatar do personagem"
          className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-md"
        />

        <label className="text-xs text-amber-400 cursor-pointer hover:underline">
          Alterar avatar
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>

        <h2 className="text-lg font-semibold text-amber-400 mt-2">
          {character.name}
        </h2>

        <p className="text-sm text-zinc-400">
          {character.race ?? "Raça desconhecida"} ·{" "}
          {character.class ?? "Classe desconhecida"}
        </p>
      </div>

      {/* 🌍 LOCALIZAÇÃO */}
      <div className="px-4 py-3 border-b border-zinc-800 text-xs text-zinc-400">
        <p className="uppercase tracking-wide text-zinc-500 mb-1">
          Localização
        </p>
        <p className="text-zinc-300">{location.city}</p>
        <p className="text-zinc-500">
          {location.region} · {location.world}
        </p>
      </div>

      {/* 📜 CONTEÚDO */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 🎯 MISSÃO */}
        <div className="border-l-4 border-amber-600 bg-zinc-900/60 p-3 rounded-lg">
          <h3 className="text-xs uppercase tracking-wide text-amber-400 mb-1">
            Missão Atual
          </h3>
          <p className="text-sm font-semibold text-zinc-100">
            {missionTitle}
          </p>
          <p className="text-sm text-zinc-300 mt-1">
            {missionObjective}
          </p>
        </div>

        {/* 📊 STATUS VITAIS */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
          <button
            onClick={() => setOpenStatus(!openStatus)}
            className="w-full flex justify-between items-center text-zinc-200 font-semibold mb-3"
          >
            <span>Status</span>
            <span className="text-sm">
              Nível {level} {openStatus ? "▾" : "▸"}
            </span>
          </button>

          {openStatus && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>HP</span>
                  <span>{hpCurrent}/{hpMax}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all"
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>{pointsLabel}</span>
                  <span>{pointsCurrent}/{pointsMax}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${pointsPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>XP</span>
                  <span>{xpCurrent}/{xpNext}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ⭐ REPUTAÇÃO */}
        <div className="relative bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
          <h3 className="text-xs uppercase tracking-wide text-zinc-400 mb-3">
            Reputação
          </h3>

          <div className="flex justify-between text-[10px] mb-1">
            <div className="text-red-400 text-center">😈<div>Vilão</div></div>
            <div className="text-zinc-300 text-center">⚖️<div>Neutro</div></div>
            <div className="text-green-400 text-center">🛡️<div>Herói</div></div>
          </div>

          <div className="relative h-4">
            <div
              className={`absolute text-cyan-400 text-xs transition-all duration-300 ${
                animatePointer ? "scale-125" : ""
              }`}
              style={{ left: `calc(${pointerPosition}% - 6px)` }}
            >
              ▼
            </div>
          </div>

          <div className="h-2 rounded-full bg-gradient-to-r from-red-600 via-zinc-400 to-green-600 mt-1" />
        </div>

        {/* 🎒 EQUIPAMENTO */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
          <button
            onClick={() => setOpenEquipment(!openEquipment)}
            className="w-full flex justify-between items-center text-zinc-200 font-semibold"
          >
            <span>Equipamento</span>
            <span>{openEquipment ? "▾" : "▸"}</span>
          </button>

          {openEquipment && (
            <div className="mt-3">
              {inventory.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">
                  Inventário vazio.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {inventory.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between text-zinc-300"
                    >
                      <span>{item.name}</span>
                      {item.quantity !== undefined && (
                        <span className="text-zinc-500">
                          x{item.quantity}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* ✨ MAGIAS */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
          <button
            onClick={() => setOpenSpells(!openSpells)}
            className="w-full flex justify-between items-center text-zinc-200 font-semibold"
          >
            <span>Magias</span>
            <span>{openSpells ? "▾" : "▸"}</span>
          </button>

          {openSpells && (
            <p className="mt-3 text-sm text-zinc-500 italic">
              Nenhuma magia ativa.
            </p>
          )}
        </div>
      </div>

      {/* 🪟 MODAL DE AJUSTE DO AVATAR */}
      {showAvatarEditor && tempAvatar && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 w-80">
            <h3 className="text-sm text-zinc-200 mb-3">
              Ajustar avatar
            </h3>

            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-2 border-amber-500 bg-zinc-800">
              <img
                src={tempAvatar}
                alt="Avatar em edição"
                draggable={false}
                className="absolute cursor-move select-none"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px)`
                }}
                onMouseDown={(e) => {
                  const startX = e.clientX;
                  const startY = e.clientY;

                  function onMove(ev: MouseEvent) {
                    setOffset(prev => ({
                      x: prev.x + (ev.clientX - startX),
                      y: prev.y + (ev.clientY - startY)
                    }));
                  }

                  function onUp() {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                  }

                  window.addEventListener("mousemove", onMove);
                  window.addEventListener("mouseup", onUp);
                }}
              />
            </div>

            <p className="text-xs text-zinc-400 text-center mt-3">
              Arraste a imagem para posicionar
            </p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowAvatarEditor(false);
                  setTempAvatar(null);
                }}
                className="text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  if (!tempAvatar) return;

                  const canvas = document.createElement("canvas");
                  const size = 256;
                  canvas.width = size;
                  canvas.height = size;

                  const ctx = canvas.getContext("2d");
                  if (!ctx) return;

                  const img = new Image();
                  img.src = tempAvatar;

                  img.onload = () => {
                    const scale = img.width / 192;

                    const sx = -offset.x * scale;
                    const sy = -offset.y * scale;
                    const sw = 192 * scale;
                    const sh = 192 * scale;

                    ctx.clearRect(0, 0, size, size);
                    ctx.drawImage(
                      img,
                      sx,
                      sy,
                      sw,
                      sh,
                      0,
                      0,
                      size,
                      size
                    );

                    setAvatar(canvas.toDataURL("image/png"));
                    setShowAvatarEditor(false);
                    setTempAvatar(null);
                  };
                }}
                className="text-sm bg-amber-600 text-black px-3 py-1 rounded hover:bg-amber-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
