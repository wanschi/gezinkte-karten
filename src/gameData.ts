import type { Language, LocalizedString } from "./i18n";

export type DeckId = "deck_2" | "deck_3" | "deck_4" | "deck_5";

export type SuitKey = "clubs" | "spades" | "hearts" | "diamonds";

export type ValueKey =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "jack"
  | "queen"
  | "king";

export interface CardNameMeta {
  full: LocalizedString;
  short: LocalizedString;
}

export interface SuitMeta {
  key: SuitKey;
  labels: LocalizedString;
  short: LocalizedString;
  symbol: string;
  accentColor: string;
}

export interface ValueMeta {
  key: ValueKey;
  numeric: number;
  code: string;
  labels: LocalizedString;
  short: LocalizedString;
}

export interface MarkedCardDefinition {
  id: string;
  deck: DeckId;
  suit: SuitKey;
  value: ValueKey;
  backImage: string;
  frontImage: string;
  backFileName: string;
  frontFileName: string;
  name: LocalizedString;
  explanation: LocalizedString;
}

export interface NeutralCardDefinition {
  id: string;
  deck: DeckId;
  backImage: string;
  backFileName: string;
  label: LocalizedString;
}

export interface RoundDefinition {
  id: string;
  deck: DeckId;
  marked: MarkedCardDefinition;
  neutrals: NeutralCardDefinition[];
}

export const SUIT_META: Record<SuitKey, SuitMeta> = {
  clubs: {
    key: "clubs",
    labels: { de: "Kreuz", en: "Clubs" },
    short: { de: "Kr", en: "Cl" },
    symbol: "♣",
    accentColor: "#1B5E20",
  },
  spades: {
    key: "spades",
    labels: { de: "Pik", en: "Spades" },
    short: { de: "Pi", en: "Sp" },
    symbol: "♠",
    accentColor: "#0D47A1",
  },
  hearts: {
    key: "hearts",
    labels: { de: "Herz", en: "Hearts" },
    short: { de: "He", en: "He" },
    symbol: "♥",
    accentColor: "#C62828",
  },
  diamonds: {
    key: "diamonds",
    labels: { de: "Karo", en: "Diamonds" },
    short: { de: "Ka", en: "Di" },
    symbol: "♦",
    accentColor: "#AD1457",
  },
};

const SUIT_FROM_CODE: Record<string, SuitMeta> = {
  "1": SUIT_META.clubs,
  "2": SUIT_META.spades,
  "3": SUIT_META.hearts,
  "4": SUIT_META.diamonds,
};

export const VALUE_META: Record<ValueKey, ValueMeta> = {
  ace: {
    key: "ace",
    numeric: 1,
    code: "01",
    labels: { de: "Ass", en: "Ace" },
    short: { de: "A", en: "A" },
  },
  two: {
    key: "two",
    numeric: 2,
    code: "02",
    labels: { de: "2", en: "Two" },
    short: { de: "2", en: "2" },
  },
  three: {
    key: "three",
    numeric: 3,
    code: "03",
    labels: { de: "3", en: "Three" },
    short: { de: "3", en: "3" },
  },
  four: {
    key: "four",
    numeric: 4,
    code: "04",
    labels: { de: "4", en: "Four" },
    short: { de: "4", en: "4" },
  },
  five: {
    key: "five",
    numeric: 5,
    code: "05",
    labels: { de: "5", en: "Five" },
    short: { de: "5", en: "5" },
  },
  six: {
    key: "six",
    numeric: 6,
    code: "06",
    labels: { de: "6", en: "Six" },
    short: { de: "6", en: "6" },
  },
  seven: {
    key: "seven",
    numeric: 7,
    code: "07",
    labels: { de: "7", en: "Seven" },
    short: { de: "7", en: "7" },
  },
  eight: {
    key: "eight",
    numeric: 8,
    code: "08",
    labels: { de: "8", en: "Eight" },
    short: { de: "8", en: "8" },
  },
  nine: {
    key: "nine",
    numeric: 9,
    code: "09",
    labels: { de: "9", en: "Nine" },
    short: { de: "9", en: "9" },
  },
  ten: {
    key: "ten",
    numeric: 10,
    code: "10",
    labels: { de: "10", en: "Ten" },
    short: { de: "10", en: "10" },
  },
  jack: {
    key: "jack",
    numeric: 11,
    code: "11",
    labels: { de: "Bube", en: "Jack" },
    short: { de: "B", en: "J" },
  },
  queen: {
    key: "queen",
    numeric: 12,
    code: "12",
    labels: { de: "Dame", en: "Queen" },
    short: { de: "D", en: "Q" },
  },
  king: {
    key: "king",
    numeric: 13,
    code: "13",
    labels: { de: "König", en: "King" },
    short: { de: "K", en: "K" },
  },
};

const VALUE_FROM_CODE_ENTRIES = Object.values(VALUE_META).map(
  (meta): [string, ValueMeta] => [meta.code, meta],
);
const VALUE_FROM_CODE: Record<string, ValueMeta> = Object.fromEntries(
  VALUE_FROM_CODE_ENTRIES,
);

export const SUIT_OPTIONS: SuitMeta[] = Object.values(SUIT_META);
export const VALUE_OPTIONS: ValueMeta[] = Object.values(VALUE_META).sort(
  (a, b) => a.numeric - b.numeric,
);

/**
 * Builds a URL path for card images.
 * Filenames now use hyphens instead of # characters, so no encoding is needed.
 * 
 * @param deck - The deck folder name (e.g., "deck_2")
 * @param fileName - The filename (e.g., "-rs-I09053Sp-1-1-02.png")
 * @returns A URL path (e.g., "/deck_2/-rs-I09053Sp-1-1-02.png")
 */
function buildAssetPath(deck: DeckId, fileName: string): string {
  // Validate inputs
  if (!deck || !fileName) {
    throw new Error(`Invalid deck or filename: deck=${deck}, fileName=${fileName}`);
  }

  // Construct the path - no encoding needed since filenames use hyphens
  // Vite serves files from public/ folder at the root, so /deck_name/filename works
  return `/${deck}/${fileName}`;
}

function formatCardLabel(
  suit: SuitKey,
  value: ValueKey,
  language: Language,
): string {
  const suitLabel = SUIT_META[suit].labels[language];
  const valueLabel = VALUE_META[value].labels[language];
  if (language === "de") {
    return `${valueLabel} von ${suitLabel}`;
  }
  return `${valueLabel} of ${suitLabel}`;
}

function extractDeckIdFromFileName(fileName: string): string | null {
  // Extract the ID pattern like I09053, I05028, etc. from filenames
  // Pattern: -rs-I09053Sp-... or -vs-I09053Sp-...
  const match = fileName.match(/I(\d{5})Sp/);
  return match ? `I${match[1]}` : null;
}

function getExplanationForDeckId(deckId: string | null): LocalizedString {
  const explanations: Record<string, LocalizedString> = {
    "I09052": {
      de: "Am linken Rand, unterhalb der Figur steht die Zahl oder der Buchstabe für den Kartenwert. In gerader Linie weiter unten, ist das Symbol für die Kartenfarbe.",
      en: "On the left edge below the figure is the number or letter for the card value. In a straight line further down is the symbol for the suit.",
    },
    "I09053": {
      de: "In der linken oberen Ecke formt sich in der Rosenblüte die Zahl oder der Buchstabe für Kartenwert. Rechts am selben Blütenblatt zeigt ein kleines Symbol die Kartenfarbe.",
      en: "In the upper left rose, the lines form the number or letter for the card value. A small symbol on the right petal indicates the suit.",
    },
    "I05028": {
      de: "Die Markierung beginnt am oberen V der Blüte und läuft im Uhrzeigersinn. Das Blütenblatt mit der fehlenden Linie in der Mitte zeigt den Kartenwert. Die Kartenfarbe wird durch das dünnere V angezeigt und folgt dem Schema auf der Zeichnung.",
      en: "The marking starts at the upper V of the flower and continues clockwise. The petal with the missing center line shows the card value. The thinner V indicates the suit, following the diagram.",
    },
    "I05051": {
      de: "Beginnend beim König im ersten Kreis wird der Kartenwert im Raster abgezählt. Jeweils 4 Punkte nach rechts, bis zum ersten Kreis in der vierten Reihe (Ass). Die Linie im Kreis zeigt die Farbe: senkrecht = Karo, waagrecht = Herz, diagonal links oben = Pik, diagonal rechts oben = Kreuz.",
      en: "Starting from the King in the first circle, count four dots to the right for each step until the first circle in the fourth row (Ace). The line inside the circle shows the suit: vertical = diamonds, horizontal = hearts, diagonal upper left = spades, diagonal upper right = clubs.",
    },
    "I09051": {
      de: "An der linken oberen Ecke markieren zwei der drei Blattspitzen die Kartenfarbe: zweite Spitze = Pik, dritte Spitze = Herz, beide = Karo, nur oberste sichtbar = Kreuz. Darunter zeigen vier abgerundeten Blätter im Binärsystem (1,2, 4, 8) den Kartenwert. Gezählt werden die nicht schraffierten Blätter.",
      en: "At the top left corner, two of the three leaf tips indicate the suit: second tip = spades, third = hearts, both = diamonds, only top visible = clubs. Below, four rounded leaves show the value in binary (1, 2, 4, 8). Add the unshaded leaves.",
    },
  };

  if (deckId && explanations[deckId]) {
    return explanations[deckId];
  }

  // Fallback to placeholder if deck ID not found
  return {
    de: `Platzhaltertext: Beschreibe, woran man die Karte erkennt.`,
    en: `Placeholder: Describe how to spot the card.`,
  };
}

function parseCardMetadata(fileName: string): {
  suit: SuitKey;
  value: ValueKey;
} {
  // Match pattern: Sp-{suit}-{optional}-{value} or Sp-{suit}-{value}
  // Examples: -rs-I09053Sp-1-1-02.png, -rs-I05051Sp-1-2-11.png
  // The suit code is after Sp- and value is the last 2 digits before .png
  const match = fileName.match(/Sp-(\d)(?:-\d)?-(\d{2})/);
  if (!match) {
    throw new Error(`Cannot extract card metadata from file name: ${fileName}`);
  }

  const [, suitCode, valueCode] = match;
  const suitMeta = SUIT_FROM_CODE[suitCode];
  const valueMeta = VALUE_FROM_CODE[valueCode];

  if (!suitMeta || !valueMeta) {
    throw new Error(`Missing metadata mapping for ${fileName}`);
  }

  return { suit: suitMeta.key, value: valueMeta.key };
}

function createMarkedCard(params: {
  deck: DeckId;
  backFileName: string;
  frontFileName: string;
  id: string;
}): MarkedCardDefinition {
  const { deck, backFileName, frontFileName, id } = params;
  const { suit, value } = parseCardMetadata(backFileName);
  const name: LocalizedString = {
    de: formatCardLabel(suit, value, "de"),
    en: formatCardLabel(suit, value, "en"),
  };

  // Extract deck ID from filename and get the corresponding explanation
  const deckId = extractDeckIdFromFileName(backFileName);
  const explanation = getExplanationForDeckId(deckId);

  return {
    id,
    deck,
    suit,
    value,
    backImage: buildAssetPath(deck, backFileName),
    frontImage: buildAssetPath(deck, frontFileName),
    backFileName,
    frontFileName,
    name,
    explanation,
  };
}

function createNeutralCard(params: {
  deck: DeckId;
  backFileName: string;
  id: string;
}): NeutralCardDefinition {
  const { deck, backFileName, id } = params;
  const lower = backFileName.toLowerCase();
  const label: LocalizedString = lower.includes("joker")
    ? { de: "Joker", en: "Joker" }
    : { de: "Neutral", en: "Neutral" };

  return {
    id,
    deck,
    backImage: buildAssetPath(deck, backFileName),
    backFileName,
    label,
  };
}

function createRound(params: {
  id: string;
  deck: DeckId;
  marked: { back: string; front: string };
  neutrals: string[];
}): RoundDefinition {
  const { id, deck, marked, neutrals } = params;
  return {
    id,
    deck,
    marked: createMarkedCard({
      deck,
      id: `${id}-marked`,
      backFileName: marked.back,
      frontFileName: marked.front,
    }),
    neutrals: neutrals.map((fileName, index) =>
      createNeutralCard({
        deck,
        backFileName: fileName,
        id: `${id}-neutral-${index + 1}`,
      }),
    ),
  };
}

// Total number of sub-rounds (8 rounds displayed to user)
export const TOTAL_ROUNDS = 8;

// Number of main rounds (4 main rounds, each with 2 sub-rounds)
export const TOTAL_MAIN_ROUNDS = 4;

// Round definitions - one per main round
// Each main round uses the same definition for both sub-rounds
export const ROUND_DEFINITIONS: RoundDefinition[] = [
  // Main Round 1: Uses deck_2 (rounds 1-2)
  createRound({
    id: "main-round-1",
    deck: "deck_2",
    marked: {
      back: "-rs-I09053Sp-1-1-02.png",
      front: "-vs-I09053Sp-1-1-02.png",
    },
    neutrals: [
      "-rs-I09053Sp-2-2-neutral.png",
      "-rs-I09053Sp-2-2-neutral.png",
    ],
  }),
  // Main Round 2: Uses deck_3 (rounds 3-4)
  createRound({
    id: "main-round-2",
    deck: "deck_3",
    marked: {
      back: "-rs-I05028Sp-1-2-06.png",
      front: "-vs-I05028Sp-1-1-06.png",
    },
    neutrals: [
      "-rs-I05028Sp-2-2-joker.png",
      "-rs-I05028Sp-2-2-joker.png",
    ],
  }),
  // Main Round 3: Uses deck_4 (rounds 5-6)
  createRound({
    id: "main-round-3",
    deck: "deck_4",
    marked: {
      back: "-rs-I05051Sp-1-2-11.png",
      front: "-vs-I05051Sp-1-1-11.png",
    },
    neutrals: [
      "-rs-I05051Sp-3-2-joker.png",
      "-rs-I05051Sp-3-2-joker.png",
    ],
  }),
  // Main Round 4: Uses deck_5 (rounds 7-8)
  createRound({
    id: "main-round-4",
    deck: "deck_5",
    marked: {
      back: "-rs-I09051Sp-4-2-03.png",
      front: "-vs-I09051Sp-4-1-03.png",
    },
    neutrals: [
      "-rs-I09051Sp-2-2-joker.png",
      "-rs-I09051Sp-2-2-joker.png",
    ],
  }),
];

export function getCardName(
  language: Language,
  suit: SuitKey,
  value: ValueKey,
): string {
  return formatCardLabel(suit, value, language);
}
