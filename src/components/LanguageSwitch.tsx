import type { Language } from "../i18n";

interface LanguageSwitchProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitch({
  language,
  onLanguageChange,
}: LanguageSwitchProps) {
  return (
    <div className="absolute top-8 right-8 z-10 flex gap-2">
      <button
        onClick={() => onLanguageChange("de")}
        className={`px-8 py-4 rounded-lg font-medium text-2xl transition-colors ${
          language === "de"
            ? "bg-white text-[#5CBFBE]"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        DE
      </button>
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-8 py-4 rounded-lg font-medium text-2xl transition-colors ${
          language === "en"
            ? "bg-white text-[#5CBFBE]"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        EN
      </button>
    </div>
  );
}
