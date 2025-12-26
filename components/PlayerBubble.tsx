type Props = {
  text: string;
  playerName?: string;
  avatar?: string;
};

export default function PlayerBubble({
  text,
  playerName = "Você",
  avatar
}: Props) {
  return (
    <div className="flex items-start gap-4 max-w-3xl mx-auto justify-end">
      {/* Conteúdo */}
      <div className="flex-1 text-right">
        <span className="block mb-1 text-xs uppercase tracking-widest text-zinc-500">
          {playerName}
        </span>

       <div className="inline-block bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-100 bubble-in-right">
          {text}
        </div>
      </div>

      {/* Avatar com destaque */}
      {avatar && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-zinc-600/30 flex items-center justify-center">
            <img
              src={avatar}
              alt="Jogador"
              className="w-8 h-8 rounded-full border border-zinc-700 bg-zinc-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
