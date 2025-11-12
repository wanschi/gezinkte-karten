import type { Language } from "../i18n";
import { TEXT } from "../i18n";
import { Button } from "./Button";

interface StartScreenProps {
  language: Language;
  onStart: () => void;
}

export function StartScreen({ language, onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold text-white mb-6">
          {TEXT.start.title[language]}
        </h1>
        <h2 className="text-3xl text-white mb-8">
          {TEXT.start.subtitle[language]}
        </h2>
      </div>
      
      <Button size="large" onClick={onStart}>
        {TEXT.start.cta[language]}
      </Button>
    </div>
  );
}

