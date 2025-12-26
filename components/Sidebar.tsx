type Character = {
  id: string;
  name: string;
  race?: string;
  class?: string;
  currentEmotion?: string;
  inventory?: { name: string; quantity?: number }[];
  reputation?: {
    local?: Record<string, number>;
    regional?: Record<string, number>;
    global?: {
      fama?: number;
      infamia?: number;
    };
  };
};

type Props = {
  character: Character | null;
};

export default function Sidebar({ character }: Props) {
  // 🔒 Guard total
  if (!character) {
    return (
      <aside className="sidebar w-72 border-r border-zinc-800 bg-zinc-950 p-4 text-zinc-500">
        <p className="text-sm italic">
          Nenhum personagem selecionado.
        </p>
      </aside>
    );
  }

  const inventory = Array.isArray(character.inventory)
    ? character.inventory
    : [];

  const fama = character.reputation?.global?.fama ?? 0;
  const infamia = character.reputation?.global?.infamia ?? 0;

  return (
    <aside className="sidebar w-72 border-r border-zinc-800 bg-zinc-950 p-4 space-y-6">
      {/* =============================
         👤 Perfil
      ============================== */}
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-amber-400">
          <span>👤</span>
          <span>{character.name}</span>
        </h2>

        <p className="text-sm text-zinc-400 ml-6">
          {character.race ?? "Raça desconhecida"} ·{" "}
          {character.class ?? "Classe desconhecida"}
        </p>
      </div>

      {/* =============================
         🎭 Emoção
      ============================== */}
      <div>
        <h3 className="flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-500 mb-1">
          <span>🎭</span>
          <span>Emoção Atual</span>
        </h3>
        <p className="italic text-zinc-300 ml-6">
          {character.currentEmotion ?? "neutra"}
        </p>
      </div>

      {/* =============================
         🎒 Inventário
      ============================== */}
      <div>
        <h3 className="flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-500 mb-2">
          <span>🎒</span>
          <span>Inventário</span>
        </h3>

        {inventory.length === 0 ? (
          <p className="text-sm text-zinc-500 italic ml-6">
            Inventário vazio.
          </p>
        ) : (
          <ul className="space-y-1 text-sm ml-6">
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

      {/* =============================
         ⭐ Reputação
      ============================== */}
      <div>
        <h3 className="flex items-center gap-2 text-sm uppercase tracking-wide text-zinc-500 mb-2">
          <span>⭐</span>
          <span>Reputação</span>
        </h3>

        <div className="text-sm text-zinc-300 space-y-1 ml-6">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <span>🌟</span> Fama
            </span>
            <span>{fama}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <span>⚠️</span> Infâmia
            </span>
            <span>{infamia}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
