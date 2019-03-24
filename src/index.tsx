import * as React from "react";
import { render } from "react-dom";
import classNames from "classnames";
import Fireworks from "fireworks-canvas";

import "./styles.scss";

const maxStrikes = 10;

interface HangmanProps {
  strike: number;
  className?: string;
}

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "å",
  "ä",
  "ö"
];

const Hangman = ({ className, strike }: HangmanProps) => (
  <div className={classNames("hangman", `strike-${strike}`, className)}>
    <div className="c1" />
    <div className="c2" />
    <div className="c3" />
    <div className="c4" />
    <div className="c5" />
    <div className="c6" />
    <div className="c7" />
    <div className="c8" />
    <div className="c9" />
    <div className="c10" />
    <div className="c11" />
  </div>
);

interface LetterSlotProps {
  word: string;
  guesses: string[];
  className?: string;
}

const LetterSlot = ({ className, word, guesses }: LetterSlotProps) => (
  <div className={classNames("letter-slots", className)}>
    {word
      .toLowerCase()
      .split("")
      .map((letter, index) =>
        letter !== " " ? (
          <span key={index} className="letter-slot">
            {guesses.indexOf(letter) !== -1 && letter}
          </span>
        ) : (
          <span key={index} className="letter-slot space">
            {letter}
          </span>
        )
      )}
  </div>
);

interface KeyboardProps {
  guesses: string[];
  onClick: (letter: string) => void;
  className?: string;
}
const Keyboard = ({ className, guesses, onClick }: KeyboardProps) => (
  <div className={classNames("keyboard", className)}>
    {alphabet.map(letter => (
      <button
        key={letter}
        className={classNames({ guessed: guesses.indexOf(letter) !== -1 })}
        onClick={() => onClick(letter)}
      >
        {letter}
      </button>
    ))}
  </div>
);

interface State {
  ready: boolean;
  strikes: number;
  guesses: string[];
}

interface ActionGuess {
  type: "guess";
  letter: string;
}

type Action = ActionGuess;

interface AppProps {
  word: string;
}

const App = ({ word }: AppProps) => {
  const [{ strikes, guesses, ready }, dispatch] = React.useReducer<
    React.Reducer<State, Action>
  >(
    (state, action) => {
      switch (action.type) {
        case "guess":
          return {
            strikes:
              word
                .toLowerCase()
                .split("")
                .indexOf(action.letter) === -1
                ? state.strikes + 1
                : state.strikes,
            guesses: [...state.guesses, action.letter],
            ready: word
              .toLowerCase()
              .split("")
              .reduce(
                (result: boolean, letter) =>
                  result &&
                  (letter === " " ||
                    letter === action.letter ||
                    state.guesses.indexOf(letter) !== -1),
                true
              )
          };

        default:
          const _: never = action.type;

          return state;
      }
    },
    {
      strikes: 0,
      guesses: [],
      ready: false
    }
  );

  React.useEffect(() => {
    if (ready) {
      const container = document.getElementById("fireworks");

      document.body.classList.add("ready");

      const options = {
        maxRockets: 3, // max # of rockets to spawn
        rocketSpawnInterval: 150, // millisends to check if new rockets should spawn
        numParticles: 100, // number of particles to spawn when rocket explodes (+0-10)
        explosionMinHeight: 0.2, // percentage. min height at which rockets can explode
        explosionMaxHeight: 0.9, // percentage. max height before a particle is exploded
        explosionChance: 0.08 // chance in each tick the rocket will explode
      };

      // instantiate the class and call start
      // this returns a disposable - calling it will stop fireworks.
      const fireworks = new Fireworks(container!, options);
      fireworks.start();
    }
  }, [ready]);

  return (
    <div className="App">
      <div id="fireworks" className="overlay" />
      <Hangman strike={strikes} className={classNames({ hidden: ready })} />
      <LetterSlot word={word} guesses={guesses} />
      <Keyboard
        guesses={guesses}
        onClick={letter => dispatch({ type: "guess", letter })}
        className={classNames({ hidden: ready })}
      />
      {strikes > maxStrikes && <div className="gameover">Oikeesti?</div>}
    </div>
  );
};

const rootElement = document.getElementById("root");

render(<App word="joku esimerkki" />, rootElement);
