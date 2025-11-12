export type Language = "de" | "en";

export interface LocalizedString {
  de: string;
  en: string;
}

export const LANGUAGE_NAMES: Record<Language, LocalizedString> = {
  de: { de: "Deutsch", en: "German" },
  en: { de: "Englisch", en: "English" },
};

export const TEXT = {
  start: {
    title: {
      de: "Entdecke, was anderen verborgen bleibt",
      en: "Spot what others miss",
    },
    subtitle: {
      de: "Kannst du die gezinkten Karten finden?",
      en: "Can you find the marked cards?",
    },
    cta: {
      de: "Los geht's!",
      en: "Let's start!",
    },
  },
  prompts: {
    findMarkedCard: {
      de: "Welche Karte ist gezinkt?",
      en: "Which card is marked?",
    },
    explanationHeading: {
      de: "Darum ist diese Karte gezinkt",
      en: "Why this card is marked",
    },
    doubleQuestion: {
      de: "Welche Rückseite ist gezinkt und welche Karte ist es?",
      en: "Which back is marked and which card is it?",
    },
    guessInstruction: {
      de: "Wie lautet die Karte?",
      en: "What is the card?",
    },
    revealHeading: {
      de: "Auflösung",
      en: "Reveal",
    },
    summaryHeading: {
      de: "Gesamtergebnis",
      en: "Overall result",
    },
  },
  buttons: {
    start: {
      de: "Start",
      en: "Start",
    },
    next: {
      de: "Weiter",
      en: "Next",
    },
    continue: {
      de: "Weiter",
      en: "Continue",
    },
    restart: {
      de: "Neu starten",
      en: "Restart",
    },
    guessConfirm: {
      de: "Eingabe bestätigen",
      en: "Confirm guess",
    },
    explanationContinue: {
      de: "Weiter zur nächsten Aufgabe",
      en: "Continue to next task",
    },
  },
  feedback: {
    correct: {
      de: "Richtig!",
      en: "Correct!",
    },
    incorrect: {
      de: "Leider falsch",
      en: "Not quite",
    },
    yourChoice: {
      de: "Deine Auswahl",
      en: "Your choice",
    },
    actualMarkedCard: {
      de: "Gezinkte Karte",
      en: "Marked card",
    },
    guessMatches: {
      de: "Deine Vermutung war richtig.",
      en: "Your guess was right.",
    },
    guessFails: {
      de: "Deine Vermutung war nicht richtig.",
      en: "Your guess was not correct.",
    },
    totalScore: {
      de: "Du hast {correct} von {total} richtig erkannt.",
      en: "You identified {correct} out of {total} correctly.",
    },
  },
  guess: {
    chooseSuit: {
      de: "Wähle die Kartenfarbe",
      en: "Select the suit",
    },
    chooseValue: {
      de: "Wähle den Kartenwert",
      en: "Select the value",
    },
  },
  misc: {
    idleReset: {
      de: "Keine Eingabe – Spiel wird neu gestartet",
      en: "No interaction – restarting the game",
    },
    languageToggle: {
      de: "Sprache",
      en: "Language",
    },
  },
} as const;

export function formatRoundIndicator(
  language: Language,
  round: number,
  total: number,
): string {
  if (language === "de") {
    return `Runde ${round} von ${total}`;
  }
  return `Round ${round} of ${total}`;
}

export function formatScoreSummary(
  language: Language,
  correct: number,
  total: number,
): string {
  const template = TEXT.feedback.totalScore[language];
  return template
    .replace("{correct}", String(correct))
    .replace("{total}", String(total));
}
