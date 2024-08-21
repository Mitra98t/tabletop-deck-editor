import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Home from "./Home";
import DeckEditor from "./DeckEditor";
import DeckPrint from "./DeckPrint";

function App() {
  const [tagRegex, _] = useState([
    [/esauri[\S+\s+]+tok/gm, "Esaurire Tok"],
    [/tok[\S+\s+]+esauri/gm, "Esaurire Tok"],
    [/ottien[\S+\s+]+tok/gm, "Ottenere Tok"],
    [/ottener[\S+\s+]+tok/gm, "Ottenere Tok"],
    [/sacrific[\S+\s+]+tok/gm, "Sacrificare Tok"],
    [/tok[\S+\s+]+sacrific/gm, "Sacrificare Tok"],
    [/sacrific[\S+|\s+]+loot/gm, "Sacrificare Loot"],
    [/sacrific[\S+|\s+]+oggetto/gm, "Sacrificare Loot"],
    [/pesc[\S+|\s+]+loot/gm, "Pescare Loot"],
    [/ripristin[\S+|\s+]+tok/gm, "Ripristinare Tok"],
    [/pesc[\S+|\s+]+magi/gm, "Pescare Magie"],
    [/\d+\s+dann[\S+|\s+]+\+\s+\d+d\d+/gm, "Danno Rng"],
    [/\d+\s+difes[\S+|\s+]+\+\s+\d+d\d+/gm, "Difesa Rng"],
  ]);
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
  const [files, setFiles] = useState("");

  const handleChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      setFiles(e.target.result);
      setDeckList(JSON.parse(e.target.result));
      setSelectedDeck(JSON.parse(e.target.result)[0].name);
      saveDeckListToLocalStorage(JSON.parse(e.target.result));

      window.location.reload();
    };
  };

  const [selectedDeck, setSelectedDeck] = useState("Spell");
  return (
    <div className="w-full min-h-screen px-8 py-24 bg-slate-900 text-slate-300 animationWrapper">
      <div className="z-50 fixed inset-0 px-8 py-6 bg-slate-900  w-full h-fit flex items-center justify-start gap-4">
        <div className="w-full h-fit flex items-center justify-start gap-4">
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
        <input type="file" onChange={handleChange} />
      </div>
      <div className="w-full h-full p-4">
        {path === "home" && (
          <Home setPath={setPath} deckList={deckList} tagRegex={tagRegex} />
        )}
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
            tagRegex={tagRegex}
          />
        )}
      </div>
    </div>
  );
}

export default App;
