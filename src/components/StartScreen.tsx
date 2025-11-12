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
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitch
          language={language}
          onLanguageChange={onLanguageChange}
        />
      </div>

      <div className="flex-1 flex items-center pr-8 py-16">
        <div className="flex flex-col md:flex-row items-center w-full">
          <div className="shrink-0 w-full md:w-auto flex items-center">
            <img
              src={cardsImage}
              alt="Cards illustration"
              className="w-full max-w-[38.4rem] h-auto object-contain scale-[0.9] -translate-x-8"
            />
          </div>
          <div className="flex-1 w-full md:w-1/2 flex items-center justify-center md:ml-">
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
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
