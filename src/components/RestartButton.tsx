import type { Language } from "../i18n";
import { TEXT } from "../i18n";

interface RestartButtonProps {
  language: Language;
  onRestart: () => void;
}

export function RestartButton({ language, onRestart }: RestartButtonProps) {
  return (
    <button
      onClick={onRestart}
      className="absolute top-4 right-4 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors z-10"
    >
      {TEXT.buttons.restart[language]}
    </button>
  );
}

