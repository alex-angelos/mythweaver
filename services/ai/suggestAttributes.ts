type SuggestAttributesInput = {
  race: string;
  raceDetail?: string;
  class: string;
  archetype?: string;
  style: "ofensivo" | "defensivo" | "versatil";
};

type SuggestAttributesResponse = {
  suggestedAttributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  reasoning: string;
};

export async function suggestAttributesWithAI(
  input: SuggestAttributesInput
): Promise<SuggestAttributesResponse> {
  const response = await fetch(
    "https://us-central1-mythweaver-mvp.cloudfunctions.net/suggestAttributes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao sugerir atributos");
  }

  return response.json();
}
