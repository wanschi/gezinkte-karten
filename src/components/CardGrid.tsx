import type { MarkedCardDefinition, NeutralCardDefinition } from "../gameData";

interface CardGridProps {
  cards: Array<MarkedCardDefinition | NeutralCardDefinition>;
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  showBacks?: boolean;
}

export function CardGrid({
  cards,
  selectedCardId,
  onCardSelect,
  showBacks = true,
}: CardGridProps) {
  return (
    <div className="flex gap-6 justify-center items-center flex-wrap">
      {cards.map((card) => {
        const isSelected = selectedCardId === card.id;
        const imageSrc = showBacks
          ? card.backImage
          : "frontImage" in card
            ? card.frontImage
            : card.backImage;

        return (
          <button
            key={card.id}
            onClick={() => onCardSelect(card.id)}
            className={`bg-transparent border-0 p-1 outline-none cursor-pointer transition-all transform rounded-2xl ${
              isSelected
                ? "ring-4 ring-yellow-400 scale-105 shadow-2xl"
                : "hover:scale-105 hover:shadow-lg ring-0"
            }`}
          >
            <img
              src={imageSrc}
              alt={card.id}
              className="w-48 h-auto max-h-96 object-contain rounded-xl"
              onError={(e) => {
                console.error(`Failed to load image: ${imageSrc}`, e);
                // Fallback: try to reload or show error
              }}
              loading="lazy"
            />
          </button>
        );
      })}
    </div>
  );
}
