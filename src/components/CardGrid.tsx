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
    <div className="flex gap-12 justify-center items-center flex-nowrap">
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
            className={`bg-transparent border-0 p-2 outline-none cursor-pointer transition-all transform rounded-2xl flex-shrink ${
              isSelected
                ? "ring-6 ring-yellow-400 scale-105"
                : "hover:scale-105 ring-0"
            }`}
          >
            <img
              src={imageSrc}
              alt={card.id}
              className="h-[720px] w-auto max-w-[480px] object-contain rounded-xl"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))" }}
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
