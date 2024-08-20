import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Home from "./Home";
import DeckEditor from "./DeckEditor";
import DeckPrint from "./DeckPrint";

function App() {
  const saveDeckListToLocalStorage = (deckList) => {
    localStorage.setItem("deckList", JSON.stringify(deckList));
  };

  const loadDeckListFromLocalStorage = () => {
    const deckList = localStorage.getItem("deckList");
    if (deckList) {
      return JSON.parse(deckList);
    }
  };

  const isDeckListInLocalStorage = () => {
    return localStorage.getItem("deckList") !== null;
  };
  const [path, setPath] = useState("home");
  const [deckList, setDeckList] = useState(
    isDeckListInLocalStorage()
      ? loadDeckListFromLocalStorage()
      : [
          {
            name: "Spell",
            cards: [],
          },
          {
            name: "Enemy",
            cards: [],
          },
          {
            name: "Event",
            cards: [],
          },
          {
            name: "Loot",
            cards: [],
          },
          {
            name: "Dungeon Monsters",
            cards: [],
          },
          {
            name: "Dungeon Loot",
            cards: [],
          },
        ]
  );

  const [currentCard, setCurrentCard] = useState({
    title: "",
    description: "",
    type: "",
    quantity: 0,
    tags: [],
  });
  const [selectedDeck, setSelectedDeck] = useState("Spell");
  return (
    <div className="w-full min-h-screen px-8 py-24 bg-slate-900 text-slate-300 animationWrapper">
      <div className="z-50 fixed inset-0 px-8 py-6 bg-slate-900  w-full h-fit flex items-center justify-start gap-4">
        <button
          className="font-bold text-3xl text-base-content btn btn-ghost"
          onClick={() => setPath("home")}
        >
          Tabletop Deck Editor
        </button>
        <button
          className="font-bold text-2xl text-base-content btn btn-ghost"
          onClick={() => setPath("deck-editor")}
        >
          Deck Editor
        </button>
        <button
          className="font-bold text-2xl text-base-content btn btn-ghost"
          onClick={() => setPath("deck-print")}
        >
          Print Deck
        </button>
      </div>
      <div className="w-full h-full p-4">
        {path === "home" && <Home setPath={setPath} />}
        {path === "deck-print" && <DeckPrint deckList={deckList} />}
        {path === "deck-editor" && (
          <DeckEditor
            deckList={deckList}
            setDeckList={setDeckList}
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
            selectedDeck={selectedDeck}
            setSelectedDeck={setSelectedDeck}
            saveDeckListToLocalStorage={saveDeckListToLocalStorage}
          />
        )}
      </div>
    </div>
  );
}

export default App;
