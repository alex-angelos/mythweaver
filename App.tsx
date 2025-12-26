import { useEffect, useState } from "react";
import CharacterList from "./components/CharacterList";
import CharacterCreation from "./components/CharacterCreation";
import GameChat from "./components/GameChat";
import Sidebar from "./components/Sidebar";
import { apiPost } from "./services/api";

/* ================================
   📦 Tipos
================================= */

export type Character = {
  id: string;
  name: string;
  race: string;
  class: string;
};

/* ================================
   🧠 App
================================= */

export default function App() {
  const [campaignId] = useState("main_campaign");

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] =
    useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [loadingCharacters, setLoadingCharacters] = useState(false);

  // 🔹 Controle da Sidebar no mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ================================
     🔁 Backend → listar personagens
  ================================= */

  async function loadCharacters() {
    setLoadingCharacters(true);

    try {
      const data = await apiPost<{ characters: Character[] }>(
        "/listCharacters",
        { campaignId }
      );

      setCharacters(
        Array.isArray(data?.characters) ? data.characters : []
      );
    } catch (error) {
      console.error("Erro ao carregar personagens:", error);
      setCharacters([]);
    } finally {
      setLoadingCharacters(false);
    }
  }

  useEffect(() => {
    loadCharacters();
  }, []);

  /* ================================
     🗑️ Excluir personagem
  ================================= */

  async function deleteCharacter(characterId: string) {
    try {
      await apiPost("/deleteCharacter", {
        campaignId,
        characterId
      });

      setSelectedCharacterId(null);
      setIsSidebarOpen(false);
      loadCharacters();
    } catch (error) {
      console.error("Erro ao excluir personagem:", error);
    }
  }

  /* ================================
     📋 Copiar personagem
  ================================= */

  async function copyCharacter(characterId: string) {
    try {
      await apiPost("/copyCharacter", {
        campaignId,
        characterId
      });

      setSelectedCharacterId(null);
      setIsSidebarOpen(false);
      loadCharacters();
    } catch (error) {
      console.error("Erro ao copiar personagem:", error);
    }
  }

  /* ================================
     🎭 Personagem selecionado
  ================================= */

  const selectedCharacter =
    characters.find(c => c.id === selectedCharacterId) ?? null;

  const isInGame = Boolean(selectedCharacter);

  /* ================================
     📖 Render
  ================================= */

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-[#f4f4f5]">
      {/* =============================
         📂 SIDEBAR
         Desktop: fixa
         Mobile: drawer
      ============================== */}
      {selectedCharacter && (
        <>
          {/* Overlay mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <div
            className={`
              fixed md:static z-50 md:z-auto
              inset-y-0 left-0
              transform transition-transform duration-300
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
            `}
          >
            <Sidebar
              character={selectedCharacter}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* =============================
         📜 CONTEÚDO PRINCIPAL
      ============================== */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header (fora do jogo) */}
        {!isInGame && (
          <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <h1 className="text-xl font-semibold tracking-wide">
              Mythweaver
            </h1>

            <button
              onClick={() => setIsCreating(true)}
              className="px-3 py-1 bg-amber-600 text-black rounded hover:bg-amber-500"
            >
              Novo Personagem
            </button>
          </header>
        )}

        {/* Header mobile (dentro do jogo) */}
        {isInGame && (
          <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-zinc-300 text-lg"
            >
              ☰
            </button>

            <span className="text-sm tracking-wide text-zinc-400">
              Mythweaver
            </span>

            <div className="w-6" />
          </header>
        )}

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden min-h-0">
          {isCreating ? (
            <CharacterCreation
              campaignId={campaignId}
              onCreated={() => {
                setIsCreating(false);
                loadCharacters();
              }}
              onCancel={() => setIsCreating(false)}
            />
          ) : isInGame && selectedCharacter ? (
            <GameChat
              campaignId={campaignId}
              characterId={selectedCharacter.id}
              onExit={() => {
                setSelectedCharacterId(null);
                setIsSidebarOpen(false);
              }}
            />
          ) : (
            <CharacterList
              characters={characters}
              loading={loadingCharacters}
              onSelect={id => setSelectedCharacterId(id)}
              onDelete={deleteCharacter}
              onCopy={copyCharacter}
            />
          )}
        </div>
      </main>
    </div>
  );
}
