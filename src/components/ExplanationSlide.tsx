import type { Language } from "../i18n";
import type { MarkedCardDefinition } from "../gameData";
import { getExplanationImagePath } from "../gameData";
import { TEXT } from "../i18n";
import { Button } from "./Button";

interface ExplanationSlideProps {
  language: Language;
  markedCard: MarkedCardDefinition;
  onContinue: () => void;
}

export function ExplanationSlide({
  language,
  markedCard,
  onContinue,
}: ExplanationSlideProps) {
  const explanationImagePath = getExplanationImagePath(markedCard.deck);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 max-w-4xl mx-auto px-8 py-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#1D0D52] mb-4">
          {TEXT.prompts.explanationHeading[language]}
        </h2>
      </div>

      <div className="flex gap-8 items-center justify-center flex-wrap">
        {explanationImagePath ? (
          <img
            src={explanationImagePath}
            alt={markedCard.name[language]}
            className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-48 h-64 flex items-center justify-center bg-gray-800 rounded-lg shadow-lg">
            <p className="text-white text-sm text-center px-4">
              {language === "de" 
                ? "Erklärung nicht verfügbar" 
                : "Explanation not available"}
            </p>
          </div>
        )}
        <div className="flex-1 min-w-64">
          <p className="text-white text-xl leading-relaxed">
            {markedCard.explanation[language]}
          </p>
        </div>
      </div>

      <Button variant="primary" size="large" onClick={onContinue}>
        {TEXT.buttons.explanationContinue[language]}
      </Button>
    </div>
  );
}
