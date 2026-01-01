import CharacterCreationWizard from "../features/characterCreation/CharacterCreationWizard";

interface Props {
  campaignId: string;
  onCreated: () => void;
}

export default function CharacterCreation({
  campaignId,
  onCreated
}: Props) {
  return (
    <CharacterCreationWizard
      campaignId={campaignId}
      onCreated={onCreated}
    />
  );
}
