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
    <div className="absolute top-[1.5vh] right-[1.5vw] z-10 flex gap-[0.5vw]">
      <button
        onClick={() => onLanguageChange("de")}
        className={`px-[1.5vw] py-[0.8vh] rounded-lg font-medium text-xl transition-colors ${
          language === "de"
            ? "bg-white text-[#5CBFBE]"
            : "bg-white/20 text-white hover:bg-white/30"
        }`}
      >
        DE
      </button>
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-[1.5vw] py-[0.8vh] rounded-lg font-medium text-xl transition-colors ${
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
