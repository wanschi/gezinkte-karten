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
  getRandomMarkedCardBack,
  convertBackToFrontFileName,
  createMarkedCard,
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
  roundMarkedCards: Record<number, MarkedCardDefinition>; // Store marked card for each round
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
  roundMarkedCards: {},
};

export function isSubRoundA(round: number): boolean {
  // Odd rounds (1, 3, 5, 7) are sub-round A (select + explanation)
  // Even rounds (2, 4, 6, 8) are sub-round B (select + guess)
  // Each round definition is used for 2 sequential rounds
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

/**
 * Gets the marked card for a specific round.
 * If a custom marked card is stored for this round, use it.
 * Otherwise, use the one from the round definition.
 */
export function getMarkedCardForRound(
  round: number,
  roundMarkedCards: Record<number, MarkedCardDefinition>,
): MarkedCardDefinition {
  if (roundMarkedCards[round]) {
    return roundMarkedCards[round];
  }
  const roundDef = getRoundDefForRound(round);
  return roundDef.marked;
}

/**
 * Generates a new random marked card for a round based on its deck.
 */
function generateNewMarkedCardForRound(round: number): MarkedCardDefinition {
  const roundDef = getRoundDefForRound(round);
  const backFileName = getRandomMarkedCardBack(roundDef.deck);
  const frontFileName = convertBackToFrontFileName(backFileName);

  return createMarkedCard({
    deck: roundDef.deck,
    id: `${roundDef.id}-marked-round-${round}`,
    backFileName,
    frontFileName,
  });
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

      const markedCard = getMarkedCardForRound(state.currentRound, state.roundMarkedCards);
      const isSubRoundAValue = isSubRoundA(state.currentRound);

      if (isSubRoundAValue) {
        // Sub-round A: Show reveal of back selection
        const isCorrect = state.selectedCardId === markedCard.id;
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
      // For even rounds (2, 4, 6), skip back selection and go directly to guess view
      const nextRound = state.currentRound + 1;

      if (nextRound > TOTAL_ROUNDS) {
        return {
          ...state,
          view: "completed",
          lastActivityTime: now,
        };
      }

      // Generate a new random marked card for the even round
      const newMarkedCard = generateNewMarkedCardForRound(nextRound);

      // Check if this is an even round (2, 4, 6) - skip back selection
      const isEvenRound = nextRound % 2 === 0;

      if (isEvenRound) {
        // For even rounds, skip back selection and go directly to guess view
        // Set selectedCardForGuess to the marked card ID so we can show its front image
        return {
          ...state,
          view: "round-guess-card",
          currentRound: nextRound,
          roundMarkedCards: {
            ...state.roundMarkedCards,
            [nextRound]: newMarkedCard,
          },
          selectedCardForGuess: newMarkedCard.id,
          selectedCardId: null,
          guess: null,
          lastActivityTime: now,
        };
      }

      // For odd rounds, continue with normal flow (back selection)
      const roundDef = getRoundDefForRound(nextRound);
      const allCards = [newMarkedCard, ...roundDef.neutrals];
      const shuffledIds = shuffleCardIds(allCards);

      return {
        ...state,
        view: "round-select-back",
        currentRound: nextRound,
        shuffledCardIds: shuffledIds,
        roundMarkedCards: {
          ...state.roundMarkedCards,
          [nextRound]: newMarkedCard,
        },
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
      if (!state.guess) return state;
      if (!state.guess.suit || !state.guess.value) return state;

      const markedCard = getMarkedCardForRound(state.currentRound, state.roundMarkedCards);
      const isEvenRound = state.currentRound % 2 === 0;

      // For even rounds (2, 4, 6), we skip back selection, so we only check the guess
      // For odd rounds, we check both back selection and guess
      let isCorrect: boolean;
      if (isEvenRound) {
        // Even rounds: only check if the guess matches the marked card
        isCorrect = evaluateGuess(
          { suit: state.guess.suit, value: state.guess.value },
          markedCard,
        );
      } else {
        // Odd rounds: check both back selection and guess
        const selectedCorrectBack = state.selectedCardForGuess === markedCard.id;
        const guessedCorrectCard = evaluateGuess(
          { suit: state.guess.suit, value: state.guess.value },
          markedCard,
        );
        isCorrect = selectedCorrectBack && guessedCorrectCard;
      }

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
  roundMarkedCards?: Record<number, MarkedCardDefinition>,
): {
  marked: MarkedCardDefinition;
  neutrals: NeutralCardDefinition[];
  all: Array<MarkedCardDefinition | NeutralCardDefinition>;
} {
  const roundDef = getRoundDefForRound(round);
  // Use stored marked card for this round if available, otherwise use the one from round definition
  const markedCard = roundMarkedCards && roundMarkedCards[round]
    ? roundMarkedCards[round]
    : roundDef.marked;
  const allCards = [markedCard, ...roundDef.neutrals];

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
      marked: markedCard,
      neutrals: roundDef.neutrals,
      all: shuffledCards,
    };
  }

  // Fallback: return cards in original order if no shuffled IDs provided
  return {
    marked: markedCard,
    neutrals: roundDef.neutrals,
    all: allCards,
  };
}

export { initialState };

