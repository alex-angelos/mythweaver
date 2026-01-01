// ===============================
//  MOCK CHARACTER SERVICE (OFFLINE)
// ===============================

console.log("✅ [MOCK] characterService.ts ativo");

type Draft = {
  id: string;
  data: any;
  campaignId: string;
  userId: string;
};

// Banco de dados em memória (mock)
const mockDB: Record<string, Draft> = {};

// ==================================================
// 🔹 GET DRAFT CHARACTER
// ==================================================
export async function getDraftCharacter(campaignId: string, userId: string) {
  console.log("[mock] getDraftCharacter", { campaignId, userId });

  // delay fake para simular Firestore
  await new Promise((resolve) => setTimeout(resolve, 300));

  const draft = Object.values(mockDB).find(
    (d) => d.campaignId === campaignId && d.userId === userId
  );

  if (!draft) {
    console.warn("⚠️ Nenhum draft encontrado no mockDB");
    return null;
  }

  console.log("📄 [mock] Draft existente encontrado:", draft.id);
  return draft;
}

// ==================================================
// 🔹 CREATE CHARACTER DRAFT
// ==================================================
export async function createCharacterDraft(campaignId: string, userId: string) {
  console.log("[mock] createCharacterDraft", { campaignId, userId });

  await new Promise((resolve) => setTimeout(resolve, 300)); // delay fake

  const id = "draft-" + Math.random().toString(36).substring(2, 8);

  mockDB[id] = {
    id,
    campaignId,
    userId,
    data: {
      status: "draft",
      identity: null,
      appearance: "",
      background: null,
      attributes: {
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8,
      },
      remainingPoints: 27,
      aiReasoning: "",
      gameplay: {},
      inventory: [],
      magic: [],
      reputation: {
        global: { fame: 0, infamy: 0 },
      },
      avatar: null,
    },
  };

  console.log("✅ [mock] Draft criado com sucesso:", id);
  return id;
}

// ==================================================
// 🔹 UPDATE CHARACTER (LOCAL + MOCK)
// ==================================================
export async function updateCharacter(
  campaignId: string,
  characterId: string,
  partial: any
) {
  if (!mockDB[characterId]) {
    console.warn("⚠️ [mock] updateCharacter: ID não encontrado", characterId);
    return;
  }

  mockDB[characterId].data = {
    ...mockDB[characterId].data,
    ...partial,
  };

  console.log("📝 [mock] updateCharacter", mockDB[characterId].data);
}

// ==================================================
// 🔹 ACTIVATE CHARACTER (FINALIZA CRIAÇÃO)
// ==================================================
export async function activateCharacter(
  campaignId: string,
  characterId: string
) {
  if (!mockDB[characterId]) {
    console.warn("⚠️ [mock] activateCharacter: ID não encontrado", characterId);
    return;
  }

  mockDB[characterId].data.status = "active";

  console.log("🌟 [mock] activateCharacter", {
    id: characterId,
    data: mockDB[characterId].data,
  });
}

// ==================================================
// 🔹 DEBUG UTIL (Opcional)
// ==================================================
export function _debugListCharacters() {
  return Object.values(mockDB);
}

// ==================================================
// 🔹 SAVE CHARACTER (FIRESTORE - FINAL)
// ==================================================

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/services/firebase";

export async function saveCharacter(character: any): Promise<string> {
  if (!character) {
    throw new Error("saveCharacter: character is undefined");
  }

  if (!character.identity?.name) {
    throw new Error("saveCharacter: identity.name is required");
  }

  if (!character.identity?.race) {
    throw new Error("saveCharacter: identity.race is required");
  }

  if (!character.identity?.class) {
    throw new Error("saveCharacter: identity.class is required");
  }

  const payload = {
    identity: character.identity,
    background: character.background,
    appearance: character.appearance,
    attributes: character.attributes,
    classSkills: character.classSkills,
    avatar: character.avatar ?? null,
    equipment: character.equipment,
    gold: character.gold,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

 const docRef = await addDoc(
  collection(db, "campaigns", "main_campaign", "characters"),
  payload
);


  return docRef.id;
}

