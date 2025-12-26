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
        Array.isArray(data?.characters)
          ? data.characters
          : []
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
      {/* Sidebar (somente no jogo) */}
      {isInGame && <Sidebar character={selectedCharacter} />}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header (somente fora do jogo) */}
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

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">
          {isCreating ? (
            <CharacterCreation
              campaignId={campaignId}
              onCreated={() => {
                setIsCreating(false);
                loadCharacters();
              }}
              onCancel={() => setIsCreating(false)}
            />
          ) : isInGame ? (
            <GameChat
              campaignId={campaignId}
              characterId={selectedCharacter.id}
              onExit={() => {
                setSelectedCharacterId(null);
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
