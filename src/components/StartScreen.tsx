import type { Language } from "../i18n";
import { TEXT } from "../i18n";
import { Button } from "./Button";
import { LanguageSwitch } from "./LanguageSwitch";
import cardsImage from "../assets/cards.png";

interface StartScreenProps {
  language: Language;
  onStart: () => void;
  onLanguageChange: (language: Language) => void;
}

export function StartScreen({
  language,
  onStart,
  onLanguageChange,
}: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <LanguageSwitch language={language} onLanguageChange={onLanguageChange} />

      <div className="flex-1 flex items-center pr-16 py-20">
        <div className="flex flex-row items-center w-full gap-16">
          <div className="shrink-0 flex items-center">
            <img
              src={cardsImage}
              alt="Cards illustration"
              className="h-[864px] w-auto object-contain"
            />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-start gap-8 text-left">
              <h1 className="text-[#1D0D52] font-bold">
                {TEXT.start.title[language]}
              </h1>
              <h2>{TEXT.start.subtitle[language]}</h2>
              <Button variant="primary" size="large" onClick={onStart}>
                {TEXT.start.cta[language]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
