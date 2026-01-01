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

  // Campos futuros (placeholder visual)
  level?: number;
  currentQuest?: string;
};

type Props = {
  characters: Character[] | undefined | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
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
  onCreateNew
}: Props) {
  // 🔒 BLINDAGEM ABSOLUTA
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
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-zinc-900 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-6">
          <User className="w-12 h-12 text-zinc-700" />
        </div>

        <h2 className="text-zinc-300 mb-2">
          Nenhum personagem criado ainda
        </h2>

        <p className="text-zinc-500 text-sm mb-8 text-center max-w-sm">
          Crie seu primeiro personagem e comece sua jornada no mundo de Mythweaver
        </p>

        <button
          onClick={onCreateNew}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded transition-colors flex items-center gap-2"
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
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-amber-400 mb-2">
            Seus Personagens
          </h1>
          <p className="text-zinc-400">
            Escolha um personagem para continuar sua jornada
          </p>
        </div>

        {/* CREATE BUTTON */}
        <div className="flex justify-end mb-6">
          <button
            onClick={onCreateNew}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Personagem
          </button>
        </div>

        {/* CHARACTER CARDS */}
        <div className="space-y-4">
          {safeCharacters.map(character => {
            const name = character.identity?.name ?? "Sem nome";
            const race = character.identity?.race ?? "—";
            const charClass = character.identity?.class ?? "—";

            return (
              <div
                key={character.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
              >
                <div className="p-6 flex items-center gap-6">

                  {/* AVATAR */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-zinc-800 border-2 border-amber-500/50 rounded-full flex items-center justify-center overflow-hidden">
                      {character.avatar ? (
                        <img
                          src={character.avatar}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-zinc-600" />
                      )}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-zinc-100 mb-1 truncate">
                      {name}
                    </h3>

                    <p className="text-zinc-400 text-sm mb-2">
                      {race} · {charClass}
                    </p>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-zinc-500">
                        Nível {character.level ?? "—"}
                      </span>

                      <span className="text-zinc-700">•</span>

                      <span className="text-zinc-500">
                        {character.currentQuest
                          ? `Missão: ${character.currentQuest}`
                          : "Nenhuma missão ativa"}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => onSelect(character.id)}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Jogar
                    </button>

                    <button
                      onClick={() => onCopy(character.id)}
                      className="p-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-300 transition-colors"
                      title="Duplicar personagem"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDelete(character.id)}
                      className="p-2.5 bg-zinc-800 hover:bg-red-950 border border-zinc-700 hover:border-red-900 rounded text-zinc-400 hover:text-red-400 transition-colors"
                      title="Excluir personagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
