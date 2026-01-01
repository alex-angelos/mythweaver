import { useEffect, useRef, useState } from "react";
import Step1Essence from "./steps/Step1Essence";
import Step2Gameplay from "./steps/Step2Gameplay";
import Step3Review from "./steps/Step3Review";
import {
  createCharacterDraft,
  updateCharacter,
  activateCharacter,
  getDraftCharacter
} from "../../services/characterService";
import { useAuth } from "../../auth/useAuth";
import { suggestAttributesWithAI } from "../../services/ai/suggestAttributes";


/* ===============================
   TYPES
=============================== */
type WizardStep = 1 | 2 | 3;

interface Props {
  campaignId: string;
  onCreated: () => void;
}

type Attributes = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
};

/* ===============================
   EMPTY DRAFT (SAFE)
=============================== */
const emptyCharacterDraft: any = {
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
    charisma: 8
  },
  remainingPoints: 27,
  aiReasoning: "",
  gameplay: {},
  inventory: [],
  magic: [],
  reputation: {
    global: { fame: 0, infamy: 0 }
  },
  avatar: null
};

/* ===============================
   COMPONENT
=============================== */
export default function CharacterCreationWizard({ campaignId, onCreated }: Props) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [step, setStep] = useState<WizardStep>(1);
  const [character, setCharacter] = useState<any>(emptyCharacterDraft);
  const [isStepValid, setIsStepValid] = useState(false);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStyleModal, setShowStyleModal] = useState(false);
const [pendingStyleResolve, setPendingStyleResolve] =
  useState<((style: "ofensivo" | "defensivo" | "versatil") => void) | null>(null);
const [isSuggestingAttributes, setIsSuggestingAttributes] = useState(false);




  const initializedUser = useRef<string | null>(null);

  // Congela o user (evita remount)
  useEffect(() => {
    if (authUser && !user) setUser(authUser);
  }, [authUser]);

  /* ===============================
   INIT — LOAD OR CREATE DRAFT
=============================== */

useEffect(() => {
  let cancelled = false;

  async function initDraft() {
    console.log("🧠 initDraft start", { campaignId, user });

    try {
      const existingDraft = await getDraftCharacter(campaignId, user.uid);
      console.log("📄 existingDraft:", existingDraft);

      if (cancelled) return;

      if (existingDraft?.id) {
        setCharacterId(existingDraft.id);
        setCharacter({
          ...emptyCharacterDraft,
          ...existingDraft.data,
        });
      } else {
        const id = await createCharacterDraft(campaignId, user.uid);
        console.log("🆕 draft criado:", id);
        if (!cancelled) {
          setCharacterId(id);
          setCharacter({ ...emptyCharacterDraft });
        }
      }
    } catch (err) {
      console.error("❌ Erro initDraft:", err);
    } finally {
      if (!cancelled) {
        console.log("✅ Wizard liberado (loading = false)");
        setLoading(false);
      }
    }
  }

  if (user?.uid) {
    initDraft();
  } else {
    console.warn("⚠️ user.uid ausente, aguardando mock...");
    setTimeout(() => {
      // fallback de segurança
      if (!cancelled) {
        console.log("🪄 mock-user forçado");
        initDraft();
      }
    }, 200);
  }

  return () => {
    cancelled = true;
  };
}, [campaignId, user]);

  // ===============================
  // UPDATE CHARACTER
  // ===============================
  function updateCharacterData(partial: any) {
    setCharacter((prev) => ({ ...prev, ...partial }));
    if (characterId) updateCharacter(campaignId, characterId, partial);
  }

  // ===============================
  // NAVIGATION
  // ===============================
  function nextStep() {
    if (!isStepValid) return;
    setStep((prev) => (prev < 3 ? ((prev + 1) as WizardStep) : prev));
    setIsStepValid(false);
  }

  function prevStep() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : prev));
    setIsStepValid(true);
  }

  function goToStep(step: WizardStep) {
    setStep(step);
    setIsStepValid(true);
  }

// ===============================
// ATTRIBUTES
// ===============================
function getAttributeCost(value: number) {
  return value >= 14 ? 2 : 1;
}

function handleIncreaseAttribute(key: keyof Attributes) {
  setCharacter((prev) => {
    const current = prev.attributes?.[key] ?? 8;
    if (current >= 15) return prev;

    const cost = getAttributeCost(current);
    if ((prev.remainingPoints ?? 0) < cost) return prev;

    const updated = {
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: current + 1
      },
      remainingPoints: (prev.remainingPoints ?? 0) - cost,
      aiReasoning: ""
    };

    updateCharacterData(updated);
    return updated;
  });
}

function handleDecreaseAttribute(key: keyof Attributes) {
  setCharacter((prev) => {
    const current = prev.attributes?.[key] ?? 8;
    if (current <= 8) return prev;

    const refund = getAttributeCost(current - 1);

    const updated = {
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: current - 1
      },
      remainingPoints: (prev.remainingPoints ?? 0) + refund,
      aiReasoning: ""
    };

    updateCharacterData(updated);
    return updated;
  });
}

function applySuggestedAttributes(suggested: Attributes) {
  setCharacter((prev) => {
    let updated = {
      ...prev,
      attributes: {
        strength: 8,
        dexterity: 8,
        constitution: 8,
        intelligence: 8,
        wisdom: 8,
        charisma: 8
      },
      remainingPoints: 27
    };

    (Object.keys(suggested) as (keyof Attributes)[]).forEach(
      (key) => {
        let current = 8;
        const target = suggested[key];

        while (current < target) {
          const cost = current >= 13 ? 2 : 1;
          if (updated.remainingPoints < cost) break;

          updated.attributes[key] += 1;
          updated.remainingPoints -= cost;
          current++;
        }
      }
    );

    return updated;
  });
}

function requestPlaystyle(): Promise<
  "ofensivo" | "defensivo" | "versatil"
> {
  setShowStyleModal(true);

  return new Promise((resolve) => {
    setPendingStyleResolve(() => resolve);
  });
}

async function handleSuggestAttributes() {
  try {
    setIsSuggestingAttributes(true);

    const style = await requestPlaystyle();
    if (!style) return;

    const response = await suggestAttributesWithAI({
      race: character.identity.race,
      raceDetail: character.identity.raceDetail,
      class: character.identity.class,
      archetype: character.identity.archetype,
      style
    });

    applySuggestedAttributes(response.suggestedAttributes);

    updateCharacterData({
      aiReasoning: response.reasoning
    });
  } catch (err) {
    console.error(err);
  } finally {
    setIsSuggestingAttributes(false);
  }
}





async function finishCreation() {
  if (!characterId) return;
  await activateCharacter(campaignId, characterId);
  onCreated();
}



  // ===============================
  // RENDER
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <div>Preparando personagem…</div>
        <pre className="text-xs text-zinc-600 mt-2">
          {JSON.stringify({ step, loading, characterId }, null, 2)}
        </pre>
      </div>
    );
  }

  const safeAttributes = character.attributes || {};
  const safeRemaining = character.remainingPoints ?? 27;

  return (
    <div className="min-h-screen bg-zinc-950 flex justify-center px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">

        {step === 1 && (
          <Step1Essence
            data={character}
            onUpdate={updateCharacterData}
            onValidityChange={setIsStepValid}
          />
        )}
        {step === 2 && (
  <Step2Gameplay
    data={character}                 // ✅ ADICIONADO
    attributes={safeAttributes}
    remainingPoints={safeRemaining}
    aiReasoning={character.aiReasoning}
    isSuggesting={isSuggestingAttributes}
     // ✅ se já existir no wizard
    onIncrease={handleIncreaseAttribute}
    onDecrease={handleDecreaseAttribute}
    onSuggest={handleSuggestAttributes}
    onUpdate={updateCharacterData}   // ✅ ADICIONADO
    onBack={() => goToStep(1)}
    onNext={() => goToStep(3)}
          />
        )}

        {step === 3 && (
          <Step3Review
            data={character}
            onUpdate={updateCharacterData}
            onEditStep={goToStep}
            onConfirm={finishCreation}
          />
        )}

            {step < 3 && step !== 2 && (
          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 text-zinc-300 disabled:opacity-40"
            >
              Voltar
            </button>
            <button
              onClick={nextStep}
              disabled={!isStepValid}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold rounded-lg disabled:opacity-40"
            >
              Seguinte
            </button>
          </div>
        )}

      </div>
          
        {showStyleModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">
        Escolha o estilo de jogo
      </h3>

      <p className="text-sm text-zinc-400">
        Isso ajuda a IA a sugerir uma distribuição mais alinhada com sua forma de jogar.
      </p>

      <div className="space-y-2">
        <button
          onClick={() => {
            pendingStyleResolve?.("ofensivo");
            setShowStyleModal(false);
          }}
          className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-left"
        >
          🗡️ Ofensivo
          <div className="text-xs text-zinc-500">
            Foco em causar dano e agir primeiro.
          </div>
        </button>

        <button
          onClick={() => {
            pendingStyleResolve?.("defensivo");
            setShowStyleModal(false);
          }}
          className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-left"
        >
          🛡️ Defensivo
          <div className="text-xs text-zinc-500">
            Foco em resistência e sobrevivência.
          </div>
        </button>

        <button
          onClick={() => {
            pendingStyleResolve?.("versatil");
            setShowStyleModal(false);
          }}
          className="w-full px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-left"
        >
                    🎭 Versátil / Narrativo
                    <div className="text-xs text-zinc-500">
                      Foco em flexibilidade e interpretação.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}


    </div>
  );
}
