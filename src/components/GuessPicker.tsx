import type { Language } from "../i18n";
import type { SuitKey, ValueKey } from "../gameData";
import { SUIT_OPTIONS, VALUE_OPTIONS } from "../gameData";
import { TEXT } from "../i18n";
import { Button } from "./Button";

interface GuessPickerProps {
  language: Language;
  selectedSuit: SuitKey | null;
  selectedValue: ValueKey | null;
  onSuitChange: (suit: SuitKey | null) => void;
  onValueChange: (value: ValueKey | null) => void;
  onSubmit: () => void;
}

export function GuessPicker({
  language,
  selectedSuit,
  selectedValue,
  onSuitChange,
  onValueChange,
  onSubmit,
}: GuessPickerProps) {
  const canSubmit = selectedSuit !== null && selectedValue !== null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1D0D52] mb-4">
          {TEXT.prompts.guessInstruction[language]}
        </h2>
      </div>

      {/* Suit Selection */}
      <div className="flex flex-col gap-4">
        <label className="text-white text-xl font-medium text-center">
          {TEXT.guess.chooseSuit[language]}
        </label>
        <div className="flex gap-4 flex-wrap justify-center">
          {SUIT_OPTIONS.map((suit) => (
            <button
              key={suit.key}
              onClick={() =>
                onSuitChange(selectedSuit === suit.key ? null : suit.key)
              }
              className={`px-6 py-4 rounded-lg font-medium text-lg transition-all ${
                selectedSuit === suit.key
                  ? "bg-white text-[#1D0D52] shadow-lg scale-105"
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
      <div className="flex flex-col gap-4">
        <label className="text-white text-xl font-medium text-center">
          {TEXT.guess.chooseValue[language]}
        </label>
        <div className="flex gap-3 flex-wrap justify-center max-w-2xl">
          {VALUE_OPTIONS.map((value) => (
            <button
              key={value.key}
              onClick={() =>
                onValueChange(selectedValue === value.key ? null : value.key)
              }
              className={`px-5 py-3 rounded-lg font-medium text-lg transition-all ${
                selectedValue === value.key
                  ? "bg-white text-[#1D0D52] shadow-lg scale-105"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {value.labels[language]}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        variant="primary"
        size="large"
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        {TEXT.buttons.guessConfirm[language]}
      </Button>
    </div>
  );
}
