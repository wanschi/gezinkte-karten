import { useState } from "react";
import type { Language } from "../i18n";
import type { SuitKey, ValueKey, MarkedCardDefinition } from "../gameData";
import { SUIT_OPTIONS, VALUE_OPTIONS } from "../gameData";
import { TEXT } from "../i18n";
import { Button } from "./Button";
import { ExplanationSlide } from "./ExplanationSlide";

interface GuessPickerProps {
  language: Language;
  selectedSuit: SuitKey | null;
  selectedValue: ValueKey | null;
  onSuitChange: (suit: SuitKey | null) => void;
  onValueChange: (value: ValueKey | null) => void;
  onSubmit?: () => void; // Optional, can be handled by parent
  showSubmitButton?: boolean; // Whether to show the submit button
  markedCard?: MarkedCardDefinition; // Marked card for explanation
}

export function GuessPicker({
  language,
  selectedSuit,
  selectedValue,
  onSuitChange,
  onValueChange,
  onSubmit,
  showSubmitButton = true,
  markedCard,
}: GuessPickerProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const canSubmit = selectedSuit !== null && selectedValue !== null;

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowExplanation(false);
      setIsClosing(false);
    }, 150); // Match animation duration
  };

  return (
    <>
      <div className="flex flex-col items-start gap-[2vh] relative">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-[#1D0D52] mb-0">
            {TEXT.prompts.guessInstruction[language]}
          </h2>
        </div>

        {/* Suit Selection */}
        <div className="flex flex-col gap-[1.5vh] mb-2">
          <label className="text-white text-2xl font-medium text-left">
            {TEXT.guess.chooseSuit[language]}
          </label>
          <div className="flex gap-[1.5vw] flex-wrap justify-start">
            {SUIT_OPTIONS.map((suit) => (
              <button
                key={suit.key}
                onClick={() =>
                  onSuitChange(selectedSuit === suit.key ? null : suit.key)
                }
                className={`px-4 py-2 rounded-lg font-medium text-xl transition-all ${
                  selectedSuit === suit.key
                    ? "bg-white text-[#1D0D52] scale-105"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <span className="mr-2">{suit.symbol}</span>
                {suit.labels[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Value Selection */}
        <div className="flex flex-col gap-[1.5vh]">
          <label className="text-white text-2xl font-medium text-left">
            {TEXT.guess.chooseValue[language]}
          </label>
          <div className="flex gap-[1vw] flex-wrap justify-start max-w-[50vw]">
            {VALUE_OPTIONS.map((value) => {
              // Show full labels for A, B, D, K (Ass/Bube/Dame/König in German, Ace/Jack/Queen/King in English)
              // For numbers, keep the short version (which is already the number)
              const displayText =
                value.key === "ace" ||
                value.key === "jack" ||
                value.key === "queen" ||
                value.key === "king"
                  ? value.labels[language]
                  : value.short[language];

              return (
                <button
                  key={value.key}
                  onClick={() =>
                    onValueChange(
                      selectedValue === value.key ? null : value.key,
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-medium text-xl transition-all ${
                    selectedValue === value.key
                      ? "bg-white text-[#1D0D52] scale-105"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {displayText}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button - only show if showSubmitButton is true */}
        {showSubmitButton && onSubmit && (
          <Button
            variant="primary"
            size="medium"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="mt-4"
          >
            {TEXT.buttons.guessConfirm[language]}
          </Button>
        )}

        {/* Explanation Button - bottom right (fixed to viewport) */}
        {markedCard && (
          <div className="fixed bottom-[2vh] right-[2vw] z-10">
            <button
              onClick={() => setShowExplanation(true)}
              className="px-4 py-[1vh] bg-white/20 text-white rounded-lg font-medium text-xl hover:bg-white/30 transition-colors"
            >
              {TEXT.buttons.explanation[language]}
            </button>
          </div>
        )}
      </div>

      {/* Explanation Modal */}
      {(showExplanation || isClosing) && markedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          style={{
            animation: isClosing
              ? "fadeOut 0.15s ease-out"
              : "fadeIn 0.15s ease-out",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="relative w-[80vw] bg-[#5CBFBE] rounded-2xl overflow-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{
              animation: isClosing
                ? "slideDown 0.15s ease-out"
                : "slideUp 0.15s ease-out",
            }}
          >
            {/* Close Button - top right corner */}
            <button
              onClick={handleCloseModal}
              className="absolute top-[2vh] right-[2vw] z-10 px-[1.5vw] py-[1vh] bg-white/20 text-white rounded-lg font-medium text-xl hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
            <ExplanationSlide
              language={language}
              markedCard={markedCard}
              onContinue={handleCloseModal}
              inModal={true}
            />
          </div>
        </div>
      )}
    </>
  );
}
