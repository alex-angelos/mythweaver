import CharacterCreationWizard from "../features/characterCreation/CharacterCreationWizard";

interface Props {
  campaignId: string;
  onCreated: () => void;
  onCancel: () => void; // ✅ ADICIONAR
}


export default function CharacterCreation({
  campaignId,
  onCreated,
  onCancel
}: Props) {
  return (
    <CharacterCreationWizard
  campaignId={campaignId}
  onCreated={onCreated}
  onCancel={onCancel} // ✅ PASSA ADIANTE
/>  

  );
}
