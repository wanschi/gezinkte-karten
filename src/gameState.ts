import type { Language } from "./i18n";
import type {
  RoundDefinition,
  MarkedCardDefinition,
  NeutralCardDefinition,
  SuitKey,
  ValueKey,
} from "./gameData";
import {
  TOTAL_ROUNDS,
  getRoundDefinitions,
  clearRoundDefinitionsCache,
} from "./gameData";

export type GameView =
  | "start"
  | "round-select-back"
  | "round-reveal-back"
  | "round-explanation"
  | "round-select-back-guess"
  | "round-guess-card"
  | "round-reveal-guess"
  | "completed";

export interface GameState {
  language: Language;
  view: GameView;
  currentRound: number;
  selectedCardId: string | null;
  selectedCardForGuess: string | null;
  guess: {
    suit: SuitKey | null;
    value: ValueKey | null;
  } | null;
  results: {
    round: number;
    subRound: number;
    correct: boolean;
  }[];
  lastActivityTime: number;
  shuffledCardIds: string[]; // Store shuffled card IDs to maintain order
}

export type GameAction =
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "START_GAME" }
  | { type: "SELECT_CARD"; cardId: string }
  | { type: "CONFIRM_SELECTION" }
  | { type: "CONTINUE_AFTER_REVEAL" }
  | { type: "CONTINUE_AFTER_EXPLANATION" }
  | { type: "SET_GUESS"; suit: SuitKey | null; value: ValueKey | null }
  | { type: "CONFIRM_GUESS" }
  | { type: "CONTINUE_AFTER_GUESS_REVEAL" }
  | { type: "RESTART_GAME" }
  | { type: "UPDATE_ACTIVITY" };

const initialState: GameState = {
  language: "de",
  view: "start",
  currentRound: 0,
  selectedCardId: null,
  selectedCardForGuess: null,
  guess: null,
  results: [],
  lastActivityTime: Date.now(),
  shuffledCardIds: [],
};

function isMarkedCard(
  cardId: string,
  roundDef: RoundDefinition,
): boolean {
  return cardId === roundDef.marked.id;
}

export function isSubRoundA(round: number): boolean {
  // Odd rounds (1, 3, 5, 7) are sub-round A (select + explanation)
  // Even rounds (2, 4, 6, 8) are sub-round B (select + guess)
  // Each round definition is used for 2 sequential rounds
  // Round 1-2 use ROUND_DEFINITIONS[0], Round 3-4 use ROUND_DEFINITIONS[1], etc.
  return round % 2 === 1;
}

function getMainRoundIndex(round: number): number {
  // Round 1-2 → index 0, Round 3-4 → index 1, etc.
  return Math.floor((round - 1) / 2);
}

export function getRoundDefForRound(round: number): RoundDefinition {
  const mainRoundIndex = getMainRoundIndex(round);
  const roundDefinitions = getRoundDefinitions();
  if (mainRoundIndex < 0 || mainRoundIndex >= roundDefinitions.length) {
    throw new Error(`Invalid round: ${round} (main round index: ${mainRoundIndex})`);
  }
  return roundDefinitions[mainRoundIndex];
}

function evaluateGuess(
  guess: { suit: SuitKey; value: ValueKey },
  markedCard: MarkedCardDefinition,
): boolean {
  return guess.suit === markedCard.suit && guess.value === markedCard.value;
}

function shuffleCardIds(cards: Array<MarkedCardDefinition | NeutralCardDefinition>): string[] {
  // Create a copy and shuffle it
  const shuffled = [...cards];
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((card) => card.id);
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const now = Date.now();

  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.language, lastActivityTime: now };

    case "START_GAME": {
      // Clear round definitions cache to get fresh random cards for this game
      clearRoundDefinitionsCache();
      // Shuffle cards for round 1
      const roundDef = getRoundDefForRound(1);
      const allCards = [roundDef.marked, ...roundDef.neutrals];
      const shuffledIds = shuffleCardIds(allCards);

      return {
        ...initialState,
        language: state.language,
        view: "round-select-back",
        currentRound: 1,
        shuffledCardIds: shuffledIds,
        lastActivityTime: now,
      };
    }

    case "SELECT_CARD":
      return {
        ...state,
        selectedCardId: action.cardId,
        lastActivityTime: now,
      };

    case "CONFIRM_SELECTION": {
      if (!state.selectedCardId) return state;

      const roundDef = getRoundDefForRound(state.currentRound);
      const isSubRoundAValue = isSubRoundA(state.currentRound);

      if (isSubRoundAValue) {
        // Sub-round A: Show reveal of back selection
        const isCorrect = isMarkedCard(state.selectedCardId, roundDef);
        return {
          ...state,
          view: "round-reveal-back",
          results: [
            ...state.results,
            {
              round: state.currentRound,
              subRound: 1,
              correct: isCorrect,
            },
          ],
          lastActivityTime: now,
        };
      } else {
        // Sub-round B: Show selected card front for guessing
        return {
          ...state,
          view: "round-guess-card",
          selectedCardForGuess: state.selectedCardId,
          selectedCardId: null,
          lastActivityTime: now,
        };
      }
    }

    case "CONTINUE_AFTER_REVEAL": {
      // This is only called after revealing back selection in sub-round A
      // Sub-round B goes directly to guess-card view from CONFIRM_SELECTION
      return {
        ...state,
        view: "round-explanation",
        selectedCardId: null,
        lastActivityTime: now,
      };
    }

    case "CONTINUE_AFTER_EXPLANATION": {
      // After explanation in sub-round A, move to sub-round B of the same main round
      // Round 1 = Main Round 1 Sub-round 1, Round 2 = Main Round 1 Sub-round 2
      // So after explanation in Round 1, we should go to Round 2 (same main round, sub-round 2)
      // Use the same shuffled cards since it's the same main round
      const nextRound = state.currentRound + 1;

      if (nextRound > TOTAL_ROUNDS) {
        return {
          ...state,
          view: "completed",
          lastActivityTime: now,
        };
      }

      return {
        ...state,
        view: "round-select-back",
        currentRound: nextRound,
        // Keep the same shuffled cards since it's the same main round (just sub-round B)
        shuffledCardIds: state.shuffledCardIds,
        selectedCardId: null,
        lastActivityTime: now,
      };
    }

    case "SET_GUESS":
      return {
        ...state,
        guess: {
          suit: action.suit,
          value: action.value,
        },
        lastActivityTime: now,
      };

    case "CONFIRM_GUESS": {
      if (!state.selectedCardForGuess || !state.guess) return state;
      if (!state.guess.suit || !state.guess.value) return state;

      const roundDef = getRoundDefForRound(state.currentRound);
      // In sub-round B, guess is correct if:
      // 1. User selected the correct marked card back
      // 2. User guessed the correct card (suit + value)
      const selectedCorrectBack = state.selectedCardForGuess === roundDef.marked.id;
      const guessedCorrectCard = evaluateGuess(
        { suit: state.guess.suit, value: state.guess.value },
        roundDef.marked,
      );
      const isCorrect = selectedCorrectBack && guessedCorrectCard;

      return {
        ...state,
        view: "round-reveal-guess",
        results: [
          ...state.results,
          {
            round: state.currentRound,
            subRound: 2,
            correct: isCorrect,
          },
        ],
        lastActivityTime: now,
      };
    }

    case "CONTINUE_AFTER_GUESS_REVEAL": {
      const nextRound = state.currentRound + 1;

      if (nextRound > TOTAL_ROUNDS) {
        return {
          ...state,
          view: "completed",
          selectedCardForGuess: null,
          guess: null,
          lastActivityTime: now,
        };
      }

      // Shuffle cards for the next round
      const roundDef = getRoundDefForRound(nextRound);
      const allCards = [roundDef.marked, ...roundDef.neutrals];
      const shuffledIds = shuffleCardIds(allCards);

      return {
        ...state,
        view: "round-select-back",
        currentRound: nextRound,
        selectedCardForGuess: null,
        guess: null,
        shuffledCardIds: shuffledIds,
        selectedCardId: null,
        lastActivityTime: now,
      };
    }

    case "RESTART_GAME":
      // Clear round definitions cache to get fresh random cards for the new game
      clearRoundDefinitionsCache();
      return {
        ...initialState,
        language: state.language,
        lastActivityTime: now,
      };

    case "UPDATE_ACTIVITY":
      return {
        ...state,
        lastActivityTime: now,
      };

    default:
      return state;
  }
}

export function getCardsForRound(
  round: number,
  shuffledCardIds?: string[],
): {
  marked: MarkedCardDefinition;
  neutrals: NeutralCardDefinition[];
  all: Array<MarkedCardDefinition | NeutralCardDefinition>;
} {
  const roundDef = getRoundDefForRound(round);
  const allCards = [roundDef.marked, ...roundDef.neutrals];

  // If shuffled IDs are provided, return cards in that order
  // Otherwise, return cards in their original order (shouldn't happen in normal flow)
  if (shuffledCardIds && shuffledCardIds.length > 0) {
    // Create a map of card ID to card for quick lookup
    const cardMap = new Map(allCards.map((card) => [card.id, card]));
    // Return cards in the shuffled order
    const shuffledCards = shuffledCardIds
      .map((id) => cardMap.get(id))
      .filter((card): card is MarkedCardDefinition | NeutralCardDefinition => card !== undefined);

    return {
      marked: roundDef.marked,
      neutrals: roundDef.neutrals,
      all: shuffledCards,
    };
  }

  // Fallback: return cards in original order if no shuffled IDs provided
  return {
    marked: roundDef.marked,
    neutrals: roundDef.neutrals,
    all: allCards,
  };
}

export { initialState };

