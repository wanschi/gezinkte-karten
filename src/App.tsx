import { useState } from "react";
import illustration from "./assets/cards.png";
import "./App.css";
import { Button } from "./components";

function App() {
  const [_count, _setCount] = useState(0);

  return (
    <div className="flex flex-row items-center justify-center">
      <div>
        <img
          src={illustration}
          className="logo react"
          alt="React logo"
          width={"664.48px"}
          // width={664.48}
          // height={784.59}
        />
      </div>
      <div className="text-left ml-20 pr-60">
        <h1 className="text-5xl font-bold mb-4">
          Entdecke, was anderen verborgen bleibt
        </h1>
        <h2 className="text-2xl mb-4">
          Kannst du die gezinkten Karten finden?
        </h2>
        <Button size="large">Los geht's!</Button>
      </div>
    </div>
  );
}

export default App;
