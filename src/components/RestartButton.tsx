import type { Language } from "../i18n";
import { TEXT } from "../i18n";

interface RestartButtonProps {
  language: Language;
  onRestart: () => void;
}

export function RestartButton({ language, onRestart }: RestartButtonProps) {
  return (
    <div className="absolute top-[1.5vh] right-[1.5vw] z-10">
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-l hover:bg-white/30 transition-colors"
      >
        {TEXT.buttons.restart[language]}
      </button>
    </div>
  );
}
