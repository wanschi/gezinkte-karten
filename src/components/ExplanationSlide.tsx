import type { Language } from "../i18n";
import type { MarkedCardDefinition } from "../gameData";
import { TEXT } from "../i18n";

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
    <div className="flex flex-col items-center gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
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

      <button
        onClick={onContinue}
        className="px-8 py-4 bg-white text-[#5CBFBE] rounded-lg font-bold text-xl hover:bg-gray-100 transition-colors shadow-lg"
      >
        {TEXT.buttons.explanationContinue[language]}
      </button>
    </div>
  );
}
