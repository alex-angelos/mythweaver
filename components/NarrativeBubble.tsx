type Props = {
  text: string;
  avatar: string;
  speaker?: string;
};

export default function NarrativeBubble({
  text,
  avatar,
  speaker = "Mestre"
}: Props) {
  return (
    <div className="flex items-start gap-4 max-w-3xl mx-auto">
      {/* Avatar com destaque */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full bg-amber-600/30 flex items-center justify-center">
          <img
            src={avatar}
            alt="Mestre"
            className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1">
        <span className="block mb-1 text-xs uppercase tracking-widest text-zinc-400">
          {speaker}
        </span>

       <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl px-5 py-4 narrative-text bubble-in-left">
          {text.split("\n\n").map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
