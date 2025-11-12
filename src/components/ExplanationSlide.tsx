import type { Language } from "../i18n";
import type { MarkedCardDefinition } from "../gameData";
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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 max-w-4xl mx-auto px-8 py-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#1D0D52] mb-4">
          {TEXT.prompts.explanationHeading[language]}
        </h2>
      </div>

      <div className="flex gap-8 items-center justify-center flex-wrap">
        <img
          src={markedCard.frontImage}
          alt={markedCard.name[language]}
          className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
        />
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
