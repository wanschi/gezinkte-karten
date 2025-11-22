import type { Language } from "../i18n";
import { TEXT, formatScoreSummary } from "../i18n";
import { Button } from "./Button";

interface CompletedScreenProps {
  language: Language;
  results: Array<{ round: number; subRound: number; correct: boolean }>;
  onRestart: () => void;
}

export function CompletedScreen({
  language,
  results,
  onRestart,
}: CompletedScreenProps) {
  const correctCount = results.filter((r) => r.correct).length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-16">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold text-white mb-10">
          {TEXT.prompts.summaryHeading[language]}
        </h1>
        <p className="text-4xl text-white mb-12">
          {formatScoreSummary(language, correctCount, totalCount)}
        </p>
      </div>

      <Button size="large" onClick={onRestart}>
        {TEXT.buttons.restart[language]}
      </Button>
    </div>
  );
}
