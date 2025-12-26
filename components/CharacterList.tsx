type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
};

type Props = {
  characters: Character[];
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCopy: (id: string) => void;
};

export default function CharacterList({
  characters,
  loading,
  onSelect,
  onDelete,
  onCopy
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-400">
        Carregando personagens…
      </div>
    );
  }

  if (!characters.length) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Nenhum personagem encontrado.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {characters.map(character => (
        <div
          key={character.id}
          className="flex items-center justify-between border border-zinc-800 rounded px-4 py-3 bg-zinc-900"
        >
          {/* INFO */}
          <div>
            <div className="font-semibold">
              {character.name}
            </div>
            <div className="text-sm text-zinc-400">
              {character.race} · {character.class}
            </div>
          </div>

          {/* AÇÕES */}
          <div className="flex gap-3 text-sm">
            <button
              onClick={() => onSelect(character.id)}
              className="px-3 py-1 bg-amber-600 text-black rounded hover:bg-amber-500"
            >
              Jogar
            </button>

            <button
              onClick={() => onCopy(character.id)}
              className="text-amber-400 hover:underline"
            >
              Copiar
            </button>

            <button
              onClick={() => onDelete(character.id)}
              className="text-red-400 hover:underline"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
