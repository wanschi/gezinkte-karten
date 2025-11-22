import type { Language } from "../i18n";
import type { MarkedCardDefinition } from "../gameData";
import { getExplanationImagePath } from "../gameData";
import { TEXT } from "../i18n";
import { Button } from "./Button";

interface ExplanationSlideProps {
  language: Language;
  markedCard: MarkedCardDefinition;
  onContinue: () => void;
  inModal?: boolean;
}

export function ExplanationSlide({
  language,
  markedCard,
  onContinue,
  inModal = false,
}: ExplanationSlideProps) {
  const explanationImagePath = getExplanationImagePath(markedCard.deck);

  return (
    <div
      className={`flex flex-col items-center justify-center max-w-10/12 mx-auto px-16 ${
        inModal ? "gap-0 py-14" : "gap-12 py-12 min-h-screen"
      }`}
    >
      <div className="text-center">
        <h2 className="text-5xl font-bold text-[#1D0D52] mb-8">
          {TEXT.prompts.explanationHeading[language]}
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex gap-16 items-center justify-center flex-wrap">
          <div className="flex-1">
            <div className="flex justify-end">
              {explanationImagePath && (
                <img
                  src={explanationImagePath}
                  alt={markedCard.name[language]}
                  className="h-[720px] w-auto object-contain rounded-lg"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex-1 ">
            <p
              className={`text-white leading-relaxed whitespace-pre-line ${
                inModal ? "text-xl" : "text-2xl"
              }`}
            >
              {markedCard.explanation[language]}
            </p>
          </div>
        </div>
      </div>

      {!inModal && (
        <Button variant="primary" size="large" onClick={onContinue}>
          {TEXT.buttons.explanationContinue[language]}
        </Button>
      )}
    </div>
  );
}
