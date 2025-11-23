import type { Language, LocalizedString } from "./i18n";

export type DeckId = "deck_1" | "deck_2" | "deck_3";

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
 * @param deck - The deck folder name (e.g., "deck_1")
 * @param fileName - The filename (e.g., "-rs-I09053Sp-1-1-02.png")
 * @returns A URL path (e.g., "/deck_1/-rs-I09053Sp-1-1-02.png")
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

/**
 * Gets the explanation image path for a deck, if available.
 * Returns null if no explanation image exists for the deck.
 * 
 * @param deck - The deck ID
 * @returns The path to the explanation image, or null if not available
 */
export function getExplanationImagePath(deck: DeckId): string | null {
  const explanationImages: Partial<Record<DeckId, string>> = {
    deck_1: "I09053Sp_erklaerung.png",
    deck_2: "I05028Sp_erklaerung.png",
    deck_3: "I09051Sp_erklaerung.png",
  };

  const fileName = explanationImages[deck];
  if (!fileName) {
    return null;
  }

  return buildAssetPath(deck, fileName);
}

function formatCardLabel(
  suit: SuitKey,
  value: ValueKey,
  language: Language,
): string {
  const suitLabel = SUIT_META[suit].labels[language];
  const valueLabel = VALUE_META[value].labels[language];
  if (language === "de") {
    return `${suitLabel} ${valueLabel}`;
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
    "I09053": {
      de: "In der linken oberen Ecke formt sich in der Rosenblüte die Zahl oder der Buchstabe zum Kartenwert. Rechts am selben Blütenblatt zeigt ein kleines Symbol die Kartenfarbe.\n\n Auf der Beispielkarte ist Karo Dame zu sehen.",
      en: "In the upper left rose, the lines form the number or letter for the card value. A small symbol on the right petal indicates the suit.\n\nOn the example card, diamonds Queen is shown.",
    },
    "I05028": {
      de: "Die Markierung befindet sich an der oberen linken Blüte. Die Kartenfarbe wird durch das dünnere V angezeigt und folgt dem Schema auf der Zeichnung.\n\nDas Blütenblatt mit der fehlenden Linie zeigt den Kartenwert wie auf der Zeichnung. Der König wird durch einen weißen Punkt in der Mitte der Blüte bestimmt.\n\nAuf der Beispielkarte ist Kreuz 6 zu sehen.",
      en: "The mark is located on the upper left flower. The card color is indicated by the thinner V and follows the pattern shown in the drawing.\n\nThe petal with the missing line shows the card value as shown in the drawing. The king is indicated by a white dot in the center of the flower.\n\nThe example card shows the 6 of clubs."
    },
    "I09051": {
      de: "An der linken oberen Ecke markieren die zwei unteren der drei Blätter am linken Rand die Kartenfarbe. Das oberste Blatt ist immer zu sehen.\n\nKein Blatt zu sehen: Kreuz\nOberes Blatt zu sehen: Pik\nUnteres Blatt zu sehen: Herz\nZwei Blätter zu sehen: Karo (wie auf der Beispielkarte)\n\nDarunter zeigen vier abgerundeten Blätter den Kartenwert. Es werden die unschraffierten Blätter gezählt. Das oberste Blatt hat den Wert 1, das zweite 2, das dritte 4 und das untere 8. Wenn mehrere unschraffiert sind, werden die Werte wie auf der Beispielkarte addiert (6).\n\nDer Wert wird übersetzt in den Kartenwert (z.B. 1 = Ass, 13 = König).\n\nAuf der Beispielkarte ist die Karo 6 zu sehen.",
      en: "In the upper left corner, the two lower of the three leaves on the left edge indicate the suit of the card. The top leaf is always visible.\n\nNo leaf visible: clubs\nTop leaf visible: spades\nBottom leaf visible: hearts\nTwo leaves visible: diamonds (as on the example card)\n\nBelow this, four rounded leaves indicate the card value. The unshaded leaves are counted. The top leaf has a value of 1, the second 2, the third 4, and the bottom 8. If several are unshaded, the values are added together as shown on the example card (6).\n\nThe value is converted into the card value (e.g., 1 = ace, 13 = king).\n\nThe example card shows the diamond 6."
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

export function createMarkedCard(params: {
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

/**
 * Converts a back filename (rs) to the corresponding front filename (vs).
 * Pattern: -rs-I{deckId}Sp-{suit}-{variant}-{value}.png → -vs-I{deckId}Sp-{suit}-1-{value}.png
 */
export function convertBackToFrontFileName(backFileName: string): string {
  // Replace -rs- with -vs- and ensure the middle number is 1
  // Pattern: -rs-I09052Sp-1-2-01.png → -vs-I09052Sp-1-1-01.png
  // Pattern: -rs-I09053Sp-1-1-02.png → -vs-I09053Sp-1-1-02.png
  let frontFileName = backFileName.replace(/-rs-/, "-vs-");

  // Replace the middle number (after suit) with 1 if it's not already 1
  // Match pattern: Sp-{suit}-{variant}-{value}
  frontFileName = frontFileName.replace(/Sp-(\d)-(\d)-(\d{2})/, (_match, suit, _variant, value) => {
    return `Sp-${suit}-1-${value}`;
  });

  return frontFileName;
}

/**
 * Gets all valid marked card backside files for a deck.
 * Valid files must:
 * - Contain "rs" in the filename
 * - NOT contain "joker", "neutral", or "anleitung" in the filename
 */
function getValidMarkedCardBacks(deck: DeckId): string[] {
  const allFiles: Partial<Record<DeckId, string[]>> = {
    deck_1: [
      "-rs-I09053Sp-1-1-01.png",
      "-rs-I09053Sp-1-1-02.png",
      "-rs-I09053Sp-1-1-03.png",
      "-rs-I09053Sp-1-1-11.png",
      "-rs-I09053Sp-2-2-04.png",
      // "-rs-I09053Sp-2-2-10.png", // Image broken
      "-rs-I09053Sp-3-2-04.png",
      "-rs-I09053Sp-3-2-08.png",
      "-rs-I09053Sp-4-2-09.png",
      "-rs-I09053Sp-4-2-12.png",
    ],
    deck_2: [
      "-rs-I05028Sp-1-2-06.png",
      "-rs-I05028Sp-1-2-12.png",
      "-rs-I05028Sp-2-2-01.png",
      // "-rs-I05028Sp-2-2-04.png", // Seems like the front image is missing?
      "-rs-I05028Sp-2-2-12.png",
      "-rs-I05028Sp-3-2-04.png",
      "-rs-I05028Sp-3-2-13.png",
      "-rs-I05028Sp-4-2-01.png",
      "-rs-I05028Sp-4-2-02.png",
    ],
    deck_3: [
      "-rs-I09051Sp-1-2-09.png",
      "-rs-I09051Sp-1-2-13.png",
      "-rs-I09051Sp-2-2-02.png",
      "-rs-I09051Sp-2-2-05.png",
      "-rs-I09051Sp-3-2-01.png",
      "-rs-I09051Sp-3-2-04.png",
      "-rs-I09051Sp-3-2-12.png",
      "-rs-I09051Sp-4-2-03.png",
      "-rs-I09051Sp-4-2-06.png",
    ],
  };

  return allFiles[deck] || [];
}

/**
 * Randomly selects a valid marked card backside for a deck.
 */
export function getRandomMarkedCardBack(deck: DeckId): string {
  const validFiles = getValidMarkedCardBacks(deck);
  if (validFiles.length === 0) {
    throw new Error(`No valid marked card files found for ${deck}`);
  }
  const randomIndex = Math.floor(Math.random() * validFiles.length);
  return validFiles[randomIndex];
}

function createRound(params: {
  id: string;
  deck: DeckId;
  marked: { back: string; front: string } | null;
  neutrals: string[];
}): RoundDefinition {
  const { id, deck, marked, neutrals } = params;

  // If marked card is not provided, randomly select one
  let markedCard: { back: string; front: string };
  if (marked) {
    markedCard = marked;
  } else {
    const backFileName = getRandomMarkedCardBack(deck);
    const frontFileName = convertBackToFrontFileName(backFileName);
    markedCard = { back: backFileName, front: frontFileName };
  }

  return {
    id,
    deck,
    marked: createMarkedCard({
      deck,
      id: `${id}-marked`,
      backFileName: markedCard.back,
      frontFileName: markedCard.front,
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

// Total number of sub-rounds (6 rounds displayed to user)
export const TOTAL_ROUNDS = 6;

// Round definitions cache - generated on demand
let cachedRoundDefinitions: RoundDefinition[] | null = null;

/**
 * Generates round definitions with random marked cards for each round.
 * Each game session will have different random selections.
 */
function generateRoundDefinitions(): RoundDefinition[] {
  return [
    // Main Round 1: Uses deck_1 (rounds 1-2)
    createRound({
      id: "main-round-1",
      deck: "deck_1",
      marked: null, // Randomly select
      neutrals: [
        "-rs-I09053Sp-2-2-neutral.png",
        "-rs-I09053Sp-2-2-neutral.png",
      ],
    }),
    // Main Round 2: Uses deck_2 (rounds 3-4)
    createRound({
      id: "main-round-2",
      deck: "deck_2",
      marked: null, // Randomly select
      neutrals: [
        "-rs-I05028Sp-2-2-joker.png",
        "-rs-I05028Sp-2-2-joker.png",
      ],
    }),
    // Main Round 3: Uses deck_3 (rounds 5-6)
    createRound({
      id: "main-round-3",
      deck: "deck_3",
      marked: null, // Randomly select
      neutrals: [
        "-rs-I09051Sp-2-2-joker.png",
        "-rs-I09051Sp-2-2-joker.png",
      ],
    }),
  ];
}

/**
 * Gets the round definitions, generating them if not already cached.
 * The cache is cleared when a new game starts to ensure fresh random selections.
 */
export function getRoundDefinitions(): RoundDefinition[] {
  if (cachedRoundDefinitions === null) {
    cachedRoundDefinitions = generateRoundDefinitions();
  }
  return cachedRoundDefinitions;
}

/**
 * Clears the cached round definitions. Call this when starting a new game
 * to ensure fresh random card selections.
 */
export function clearRoundDefinitionsCache(): void {
  cachedRoundDefinitions = null;
}

