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
      de: "Weiter zum nächsten Deck",
      en: "Continue to next deck",
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
  completion: {
    score0: {
      de: "0 von 10 – nur ein Narr lässt sich mit gezinkten Karten hinters Licht führen.",
      en: "0 out of ten – only a fool lets himself be fooled by marked cards.",
    },
    score1: {
      de: "1 von 10 – mit etwas Übung wirst auch Du zum Ass.",
      en: "1 out of ten – with some practice, you'll become an Ace too.",
    },
    score2: {
      de: "2 von 10 – Dein Blick erkennt erste Zeichen.",
      en: "2 out of ten – your eye is catching the first signs.",
    },
    score3: {
      de: "3 von 10 – Du bist im Spiel, noch nicht im Vorteil.",
      en: "3 out of ten – you're in the game, but not yet ahead.",
    },
    score4: {
      de: "4 von 10 – einiges merkst Du, manches übersiehst Du noch.",
      en: "4 out of ten – you notice some, but you still miss others.",
    },
    score5: {
      de: "5 von 10 – Du lässt Dich nur zur Hälfte reinlegen.",
      en: "5 out of ten – you're only half taken in.",
    },
    score6: {
      de: "6 von 10 – verborgene Zeichen werden für Dich sichtbar.",
      en: "6 out of ten – hidden marks are becoming visible to you.",
    },
    score7: {
      de: "7 von 10 – den meisten Schummel durchschaust Du.",
      en: "7 out of ten – you see through most of the cheating.",
    },
    score8: {
      de: "8 von 10 – die meisten Zeichen hast Du durchschaut.",
      en: "8 out of ten – you've spotted most of the marks.",
    },
    score9: {
      de: "9 von 10 – Dir entgeht fast nichts.",
      en: "9 out of ten – almost nothing slips past you.",
    },
    score10: {
      de: "10 von 10 – niemand macht Dir etwas vor.",
      en: "10 out of ten – no one can fool you.",
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

export function getCompletionMessage(
  language: Language,
  correctCount: number,
): string {
  // Clamp the score to 0-10 range
  const score = Math.max(0, Math.min(10, correctCount));
  const scoreKey = `score${score}` as keyof typeof TEXT.completion;
  return TEXT.completion[scoreKey][language];
}
