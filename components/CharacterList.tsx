import { Play, Copy, Trash2, Plus, User } from "lucide-react";

/* ===============================
   TYPES
=============================== */

type Character = {
  id: string;

  identity?: {
    name?: string;
    race?: string;
    class?: string;
  };

  avatar?: string | null;

  level?: number;
  currentQuest?: string;
};

type Props = {
  characters: Character[] | undefined | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

/* ===============================
   COMPONENT
=============================== */

export default function CharacterList({
  characters,
  loading,
  onSelect,
  onCopy,
  onDelete,
  onCreate
}: Props) {
  const safeCharacters: Character[] = Array.isArray(characters)
    ? characters
    : [];

  /* ===============================
     LOADING STATE
  =============================== */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-zinc-400">
        Carregando personagens…
      </div>
    );
  }

  /* ===============================
     EMPTY STATE
  =============================== */

  if (safeCharacters.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-6">
          <User className="w-12 h-12 text-zinc-700" />
        </div>

        <h2 className="text-zinc-300 mb-2 text-lg">
          Nenhum personagem criado
        </h2>

        <p className="text-zinc-500 text-sm mb-8 max-w-sm">
          Crie seu primeiro personagem e comece sua jornada no mundo de Mythweaver
        </p>

        <button
          onClick={onCreate}
          className="w-full max-w-sm h-12 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Criar Novo Personagem
        </button>
      </div>
    );
  }

  /* ===============================
     LIST
  =============================== */

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* HEADER */}
      <div className="px-4 pt-6 pb-4 md:px-6 md:pt-10">
        <h1 className="text-amber-400 text-xl md:text-2xl mb-1">
          Seus Personagens
        </h1>
        <p className="text-zinc-400 text-sm md:text-base">
          Escolha um personagem para continuar sua jornada
        </p>
      </div>

      {/* LIST */}
      <div className="flex-1 px-4 md:px-6 pb-28 md:pb-12 space-y-4 max-w-5xl mx-auto w-full">
        {safeCharacters.map(character => {
          const name = character.identity?.name ?? "Sem nome";
          const race = character.identity?.race ?? "—";
          const charClass = character.identity?.class ?? "—";

          return (
            <div
              key={character.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 md:p-6"
            >
              {/* TOP */}
              <div className="flex gap-4 items-center">
                {/* AVATAR */}
                <div className="w-14 h-14 md:w-20 md:h-20 bg-zinc-800 border-2 border-amber-500/50 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {character.avatar ? (
                    <img
                      src={character.avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 md:w-8 md:h-8 text-zinc-600" />
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-zinc-100 truncate">
                    {name}
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    {race} · {charClass}
                  </p>
                </div>
              </div>

              {/* META */}
              <div className="mt-3 text-xs text-zinc-500">
                Nível {character.level ?? "—"} ·{" "}
                {character.currentQuest
                  ? `Missão: ${character.currentQuest}`
                  : "Nenhuma missão ativa"}
              </div>

              {/* ACTIONS */}
              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                <button
                  onClick={() => onSelect(character.id)}
                  className="w-full md:w-auto h-11 px-6 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Jogar
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => onCopy(character.id)}
                    className="flex-1 md:flex-none h-11 px-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300"
                    title="Duplicar personagem"
                  >
                    <Copy className="w-4 h-4 mx-auto" />
                  </button>

                  <button
                    onClick={() => onDelete(character.id)}
                    className="flex-1 md:flex-none h-11 px-4 bg-zinc-800 hover:bg-red-950 border border-zinc-700 hover:border-red-900 rounded text-zinc-400 hover:text-red-400"
                    title="Excluir personagem"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE BUTTON — MOBILE FIXED */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <button
          onClick={onCreate}
          className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Personagem
        </button>
      </div>

    </div>
  );
}
