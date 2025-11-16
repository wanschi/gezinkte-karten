import { useReducer, useEffect } from "react";
import "./App.css";
import {
  StartScreen,
  RoundIndicator,
  RestartButton,
  CardGrid,
  GuessPicker,
  ExplanationSlide,
  CompletedScreen,
  Button,
} from "./components";
import {
  gameReducer,
  initialState,
  getCardsForRound,
  getMarkedCardForRound,
} from "./gameState";
import { SUIT_META, VALUE_META } from "./gameData";
import type { SuitKey, ValueKey } from "./gameData";
import { TEXT } from "./i18n";
import { isSubRoundA } from "./gameState";

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Inactivity timer - reset after 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - state.lastActivityTime;
      const INACTIVITY_TIMEOUT = 60 * 1000; // 60 seconds

      if (timeSinceActivity > INACTIVITY_TIMEOUT && state.view !== "start") {
        dispatch({ type: "RESTART_GAME" });
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [state.lastActivityTime, state.view]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      dispatch({ type: "UPDATE_ACTIVITY" });
    };

    window.addEventListener("pointerdown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  const handleLanguageChange = (language: "de" | "en") => {
    dispatch({ type: "SET_LANGUAGE", language });
  };

  const handleStart = () => {
    dispatch({ type: "START_GAME" });
  };

  const handleRestart = () => {
    dispatch({ type: "RESTART_GAME" });
  };

  const handleCardSelect = (cardId: string) => {
    dispatch({ type: "SELECT_CARD", cardId });
  };

  const handleConfirmSelection = () => {
    dispatch({ type: "CONFIRM_SELECTION" });
  };

  const handleContinueAfterReveal = () => {
    dispatch({ type: "CONTINUE_AFTER_REVEAL" });
  };

  const handleContinueAfterExplanation = () => {
    dispatch({ type: "CONTINUE_AFTER_EXPLANATION" });
  };

  const handleSetGuess = (suit: SuitKey | null, value: ValueKey | null) => {
    dispatch({ type: "SET_GUESS", suit, value });
  };

  const handleConfirmGuess = () => {
    dispatch({ type: "CONFIRM_GUESS" });
  };

  const handleContinueAfterGuessReveal = () => {
    dispatch({ type: "CONTINUE_AFTER_GUESS_REVEAL" });
  };

  // Render based on current view
  const renderView = () => {
    switch (state.view) {
      case "start":
        return (
          <StartScreen
            language={state.language}
            onStart={handleStart}
            onLanguageChange={handleLanguageChange}
          />
        );

      case "round-select-back": {
        const cards = getCardsForRound(
          state.currentRound,
          state.shuffledCardIds,
          state.roundMarkedCards,
        );
        const isSubRoundAValue = isSubRoundA(state.currentRound);
        // On even rounds (sub-round B), show all cards but only backsides
        // On odd rounds (sub-round A), show all cards with backsides
        // Both show the same cards, all with backsides
        return (
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#1D0D52] mb-4">
                {isSubRoundAValue
                  ? TEXT.prompts.findMarkedCard[state.language]
                  : TEXT.prompts.doubleQuestion[state.language]}
              </h2>
            </div>
            <CardGrid
              cards={cards.all}
              selectedCardId={state.selectedCardId}
              onCardSelect={handleCardSelect}
              showBacks={true}
            />
            {/* Reserve space for button to prevent layout jump */}
            <div className="h-20 flex items-center justify-center min-h-[80px]">
              {state.selectedCardId && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleConfirmSelection}
                >
                  {TEXT.buttons.next[state.language]}
                </Button>
              )}
            </div>
          </div>
        );
      }

      case "round-reveal-back": {
        const markedCard = getMarkedCardForRound(
          state.currentRound,
          state.roundMarkedCards,
        );
        const cards = getCardsForRound(
          state.currentRound,
          state.shuffledCardIds,
          state.roundMarkedCards,
        );
        const isCorrect = state.selectedCardId === markedCard.id;
        const selectedCard = state.selectedCardId
          ? cards.all.find((c) => c.id === state.selectedCardId)
          : null;

        return (
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 py-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#1D0D52] mb-4">
                {isCorrect
                  ? TEXT.feedback.correct[state.language]
                  : TEXT.feedback.incorrect[state.language]}
              </h2>
            </div>
            <div className="flex gap-8 items-center flex-wrap justify-center">
              {selectedCard && (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-white text-xl font-medium">
                    {TEXT.feedback.yourChoice[state.language]}
                  </p>
                  <img
                    src={selectedCard.backImage}
                    alt="Selected card"
                    className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex flex-col items-center gap-4">
                <p className="text-white text-xl font-medium">
                  {TEXT.feedback.actualMarkedCard[state.language]}
                </p>
                <img
                  src={markedCard.backImage}
                  alt={markedCard.name[state.language]}
                  className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={handleContinueAfterReveal}
            >
              {TEXT.buttons.next[state.language]}
            </Button>
          </div>
        );
      }

      case "round-explanation": {
        const markedCard = getMarkedCardForRound(
          state.currentRound,
          state.roundMarkedCards,
        );
        return (
          <ExplanationSlide
            language={state.language}
            markedCard={markedCard}
            onContinue={handleContinueAfterExplanation}
          />
        );
      }

      case "round-guess-card": {
        const cards = getCardsForRound(
          state.currentRound,
          state.shuffledCardIds,
          state.roundMarkedCards,
        );
        const isSubRoundAValue = isSubRoundA(state.currentRound);
        const selectedCard = state.selectedCardForGuess
          ? cards.all.find((c) => c.id === state.selectedCardForGuess)
          : null;

        // On even rounds (sub-round B), always show the backside
        // On odd rounds (sub-round A), show front if available, otherwise back
        const selectedCardImage = selectedCard
          ? isSubRoundAValue && "frontImage" in selectedCard
            ? selectedCard.frontImage
            : selectedCard.backImage
          : null;

        return (
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 py-8">
            {selectedCardImage && (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={selectedCardImage}
                  alt="Selected card"
                  className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
            <GuessPicker
              language={state.language}
              selectedSuit={state.guess?.suit || null}
              selectedValue={state.guess?.value || null}
              onSuitChange={(suit) =>
                handleSetGuess(suit, state.guess?.value || null)
              }
              onValueChange={(value) =>
                handleSetGuess(state.guess?.suit || null, value)
              }
              onSubmit={handleConfirmGuess}
            />
          </div>
        );
      }

      case "round-reveal-guess": {
        const markedCard = getMarkedCardForRound(
          state.currentRound,
          state.roundMarkedCards,
        );
        const isCorrect =
          state.selectedCardForGuess === markedCard.id &&
          state.guess?.suit === markedCard.suit &&
          state.guess?.value === markedCard.value;

        const guessLabel =
          state.guess && state.guess.suit && state.guess.value
            ? {
                suit: SUIT_META[state.guess.suit].labels[state.language],
                value: VALUE_META[state.guess.value].labels[state.language],
              }
            : null;

        return (
          <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-8 py-8">
            <div className="flex flex-col items-center gap-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#1D0D52] mb-4">
                  {isCorrect
                    ? TEXT.feedback.correct[state.language]
                    : TEXT.feedback.incorrect[state.language]}
                </h2>
              </div>

              {/* Show marked card backside on left and front side on right */}
              <div className="flex gap-8 items-center flex-wrap justify-center">
                <div className="flex flex-col items-center gap-4">
                  <p className="text-white text-xl font-medium">
                    {TEXT.feedback.actualMarkedCard[state.language]}
                  </p>
                  <img
                    src={markedCard.backImage}
                    alt={markedCard.name[state.language]}
                    className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-white text-xl font-medium">
                    {markedCard.name[state.language]}
                  </p>
                  <img
                    src={markedCard.frontImage}
                    alt={markedCard.name[state.language]}
                    className="w-48 h-auto max-h-96 object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Show user's guess if available */}
              {guessLabel && (
                <div className="text-center">
                  <p className="text-white text-xl">
                    {state.language === "de" ? "Deine Vermutung" : "Your guess"}
                    : {guessLabel.value} {guessLabel.suit}
                  </p>
                </div>
              )}

              <div className="text-center mt-4">
                <p className="text-white text-xl">
                  {isCorrect
                    ? TEXT.feedback.guessMatches[state.language]
                    : TEXT.feedback.guessFails[state.language]}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={handleContinueAfterGuessReveal}
            >
              {TEXT.buttons.next[state.language]}
            </Button>
          </div>
        );
      }

      case "completed":
        return (
          <CompletedScreen
            language={state.language}
            results={state.results}
            onRestart={handleRestart}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#5CBFBE] relative">
      {state.view !== "start" && state.view !== "completed" && (
        <>
          <RoundIndicator
            round={state.currentRound}
            language={state.language}
          />
          <RestartButton language={state.language} onRestart={handleRestart} />
        </>
      )}
      {renderView()}
    </div>
  );
}

export default App;
