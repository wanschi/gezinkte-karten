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
      className={`flex flex-col items-center justify-center max-w-10/12 mx-auto px-[4vw] ${
        inModal ? "gap-0 py-[3vh]" : "gap-[3vh] py-[3vh] min-h-screen"
      }`}
    >
      <div className="text-center">
        <h2 className="text-5xl font-bold text-[#1D0D52] mb-[2vh]">
          {TEXT.prompts.explanationHeading[language]}
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center mb-3">
        <div className="flex gap-[4vw] items-center justify-center ">
          <div className="flex-2">
            <div>
              {explanationImagePath && (
                <img
                  src={explanationImagePath}
                  alt={markedCard.name[language]}
                  className="h-[60vh] w-auto object-contain rounded-lg"
                  style={{
                    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))",
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex-3">
            <p
              className={`text-white leading-relaxed whitespace-pre-line ${
                inModal ? "text-[12px]" : "text-[12px]"
              }`}
            >
              {markedCard.explanation[language]}
            </p>
          </div>
        </div>
      </div>

      {!inModal && (
        <Button variant="primary" size="medium" onClick={onContinue}>
          {TEXT.buttons.explanationContinue[language]}
        </Button>
      )}
    </div>
  );
}
