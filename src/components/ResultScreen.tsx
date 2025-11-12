import type { Language } from "../i18n";
import type { MarkedCardDefinition } from "../gameData";
import { TEXT } from "../i18n";

interface ResultScreenProps {
  language: Language;
  isCorrect: boolean;
  markedCard: MarkedCardDefinition;
  selectedCardId?: string | null;
  selectedCardImage?: string | null;
  guess?: {
    suit: string;
    value: string;
  } | null;
}

export function ResultScreen({
  language,
  isCorrect,
  markedCard,
  selectedCardId,
  selectedCardImage,
  guess,
}: ResultScreenProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#1D0D52] mb-4">
          {isCorrect
            ? TEXT.feedback.correct[language]
            : TEXT.feedback.incorrect[language]}
        </h2>
      </div>

      <div className="flex gap-8 items-center flex-wrap justify-center">
        {selectedCardImage && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white text-xl font-medium">
              {TEXT.feedback.yourChoice[language]}
            </p>
            <img
              src={selectedCardImage}
              alt="Selected card"
              className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
            />
            {guess && (
              <p className="text-white text-lg">
                {guess.value} {guess.suit}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <p className="text-white text-xl font-medium">
            {TEXT.feedback.actualMarkedCard[language]}
          </p>
          <img
            src={markedCard.frontImage}
            alt={markedCard.name[language]}
            className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
          />
          <p className="text-white text-lg font-medium">
            {markedCard.name[language]}
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-white text-xl">
          {isCorrect
            ? TEXT.feedback.guessMatches[language]
            : TEXT.feedback.guessFails[language]}
        </p>
      </div>
    </div>
  );
}
