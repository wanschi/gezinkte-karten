import type { Language } from "../i18n";
import { TEXT } from "../i18n";

interface RestartButtonProps {
  language: Language;
  onRestart: () => void;
}

export function RestartButton({ language, onRestart }: RestartButtonProps) {
  return (
    <div className="absolute top-8 right-8 z-10">
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-white/20 text-white rounded-lg font-medium text-2xl hover:bg-white/30 transition-colors"
      >
        {TEXT.buttons.restart[language]}
      </button>
    </div>
  );
}

