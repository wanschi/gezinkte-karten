import type { MarkedCardDefinition, NeutralCardDefinition } from "../gameData";

interface CardGridProps {
  cards: Array<MarkedCardDefinition | NeutralCardDefinition>;
  selectedCardId: string | null;
  onCardSelect: (cardId: string) => void;
  showBacks?: boolean;
}

// Simple hash function to generate consistent random values from card ID
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function CardGrid({
  cards,
  selectedCardId,
  onCardSelect,
  showBacks = true,
}: CardGridProps) {
  return (
    <div className="flex gap-12 justify-center items-center flex-nowrap">
      {cards.map((card, index) => {
        const isSelected = selectedCardId === card.id;
        const imageSrc = showBacks
          ? card.backImage
          : "frontImage" in card
            ? card.frontImage
            : card.backImage;

        // Generate consistent random values based on card ID
        const hash = hashString(card.id);
        const randomRotation = (hash % 20) - 10; // -10 to 10 degrees
        const randomXOffset = ((hash * 7) % 40) - 20; // -20 to 20px
        const randomDelay = (hash % 50) / 1000; // 0 to 0.05s additional delay
        const baseDelay = index * 0.08; // Faster base delay
        const totalDelay = baseDelay + randomDelay;

        return (
          <button
            key={card.id}
            onClick={() => onCardSelect(card.id)}
            className={`bg-transparent border-0 p-2 outline-none cursor-pointer transition-all transform rounded-2xl shrink ${
              isSelected
                ? "ring-6 ring-yellow-400 scale-105"
                : "hover:scale-105 ring-0"
            }`}
            style={
              {
                animation: `dealCard 0.3s ease-out ${totalDelay}s both`,
                "--random-rotation": `${randomRotation}deg`,
                "--random-x": `${randomXOffset}px`,
              } as React.CSSProperties
            }
          >
            <img
              src={imageSrc}
              alt={card.id}
              className="h-[60vh] w-auto max-w-[35vw] object-contain rounded-xl"
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
