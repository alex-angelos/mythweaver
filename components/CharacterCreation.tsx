import React, { useState } from "react";
import { apiPost } from "../services/api";

/* ===============================
   CONSTANTES (V1.1)
   Futuramente podem vir do backend
=============================== */

const RACES = [
  "Humano",
  "Elfo",
  "Anão",
  "Halfling",
  "Tiefling",
  "Draconato",
  "Gnomo",
  "Meio-Elfo",
  "Meio-Orc"
];

const CLASSES = [
  "Guerreiro",
  "Mago",
  "Clérigo",
  "Ladino",
  "Bardo",
  "Druida",
  "Patrulheiro",
  "Paladino",
  "Monge",
  "Feiticeiro",
  "Bruxo"
];

const GENDERS = [
  "Masculino",
  "Feminino",
  "Não-binário",
  "Outro",
  "Prefiro não definir"
];

/* ===============================
   TYPES
=============================== */

interface CharacterDraft {
  name: string;
  gender: string;
  race: string;
  class: string;
  backstory: string;
  motivation: string;
  ambition: string;
  fear: string;
}

interface Props {
  campaignId: string;
  onCreated: () => void;
  onCancel: () => void;
}

/* ===============================
   COMPONENT
=============================== */

const CharacterCreation: React.FC<Props> = ({
  campaignId,
  onCreated,
  onCancel
}) => {
  const [character, setCharacter] = useState<CharacterDraft>({
    name: "",
    gender: "",
    race: "",
    class: "",
    backstory: "",
    motivation: "",
    ambition: "",
    fear: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
     HANDLERS
  =============================== */

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setCharacter(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const isValid = Object.values(character).every(
    value => value.trim() !== ""
  );

  async function handleSubmit() {
    if (!isValid || loading) return;

    setLoading(true);
    setError(null);

    try {
      await apiPost("/createCharacter", {
        campaignId,
        character
      });

      onCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao criar personagem");
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     RENDER
  =============================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-6">
      <div className="w-full max-w-xl bg-slate-900/80 border border-white/10 rounded-3xl p-10 space-y-8">

        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-white">
            Forjar Personagem
          </h1>
          <p className="text-slate-400 text-sm">
            Defina os traços fundamentais que moldam sua presença no mundo.
          </p>
        </header>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="space-y-5">

          <input
            name="name"
            placeholder="Nome"
            value={character.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          />

          <select
            name="gender"
            value={character.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          >
            <option value="">Gênero</option>
            {GENDERS.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            name="race"
            value={character.race}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          >
            <option value="">Raça</option>
            {RACES.map(race => (
              <option key={race} value={race}>
                {race}
              </option>
            ))}
          </select>

          <select
            name="class"
            value={character.class}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          >
            <option value="">Classe</option>
            {CLASSES.map(classe => (
              <option key={classe} value={classe}>
                {classe}
              </option>
            ))}
          </select>

          <textarea
            name="backstory"
            placeholder="Origem / História"
            value={character.backstory}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60 resize-none"
          />

          <input
            name="motivation"
            placeholder="Motivação"
            value={character.motivation}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          />

          <input
            name="ambition"
            placeholder="Ambição"
            value={character.ambition}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          />

          <input
            name="fear"
            placeholder="Medo"
            value={character.fear}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-slate-200 focus:outline-none focus:border-violet-500/60"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 transition"
          >
            {loading ? "Criando…" : "Criar Personagem"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
