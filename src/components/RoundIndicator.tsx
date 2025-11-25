import type { Language } from "../i18n";
import { formatRoundIndicator } from "../i18n";
import { TOTAL_ROUNDS } from "../gameData";

interface RoundIndicatorProps {
  round: number;
  language: Language;
}

export function RoundIndicator({ round, language }: RoundIndicatorProps) {
  return (
    <div className="absolute top-[2vh] left-[2vw] text-white text-2xl font-bold z-10">
      {formatRoundIndicator(language, round, TOTAL_ROUNDS)}
    </div>
  );
}
