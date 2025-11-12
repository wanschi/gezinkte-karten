import type { Language } from "../i18n";
import { TEXT, formatScoreSummary } from "../i18n";
import { TOTAL_ROUNDS } from "../gameData";
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-white mb-6">
          {TEXT.prompts.summaryHeading[language]}
        </h1>
        <p className="text-3xl text-white mb-8">
          {formatScoreSummary(language, correctCount, totalCount)}
        </p>
      </div>

      <Button size="large" onClick={onRestart}>
        {TEXT.buttons.restart[language]}
      </Button>
    </div>
  );
}

