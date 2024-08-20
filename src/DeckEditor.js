import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

export default function DeckEditor({
  deckList,
  setDeckList,
  currentCard,
  setCurrentCard,
  selectedDeck,
  setSelectedDeck,
  saveDeckListToLocalStorage,
}) {
  const [isInEdit, setIsInEdit] = useState(false);
  const getTags = (description) => {
    const tagRegex = [
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
    ];

    let tags = [];
    tagRegex.forEach((tag) => {
      if (description.toLowerCase().match(tag[0]) && !tags.includes(tag[1])) {
        tags.push(tag[1]);
      }
    });
    return tags;
  };
  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-1/3 h-full bg-slate-800 rounded-2xl p-4 flex flex-col gap-2 items-start ">
        <p className="text-2xl font-bold ">Decks</p>
        {deckList.map((deck, i) => (
          <button
            key={i + "deck"}
            className={
              "btn w-full " +
              (selectedDeck === deck.name ? "btn-primary" : "btn-outline")
            }
            onClick={() => setSelectedDeck(deck.name)}
          >
            {deck.name}
          </button>
        ))}
        <button
          className="fixed bottom-3 left-3 btn btn-outline btn-success"
          onClick={() => {
            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(deckList)], {
              type: "application/json",
            });
            a.href = URL.createObjectURL(file);
            a.download = "decks.json";
            a.click();
          }}
        >
          Save Decks to File
        </button>
      </div>
      {selectedDeck && (
        <>
          <div className="w-1/3 h-5/6 bg-slate-800 rounded-2xl p-4 flex flex-col gap-4">
            <p className="text-2xl font-bold ">Add Card</p>
            <input
              type="text"
              placeholder="Title"
              className="input input-primary w-full"
              value={currentCard.title}
              onChange={(e) => {
                setCurrentCard({ ...currentCard, title: e.target.value });
              }}
            />
            <textarea
              placeholder="Description"
              className="textarea textarea-primary w-full h-32"
              value={currentCard.description}
              onChange={(e) => {
                let oldCard = { ...currentCard, description: e.target.value };
                let tags = getTags(oldCard.description);
                oldCard.tags = tags;
                console.log(tags);
                setCurrentCard(oldCard);
              }}
            />
            {/* add select with type */}
            <select
              className="select select-bordered w-full"
              value={currentCard.type}
              onChange={(e) => {
                setCurrentCard({ ...currentCard, type: e.target.value });
              }}
            >
              <option value="">Select type</option>
              <option value="RED">Red</option>
              <option value="BLUE">Blue</option>
              <option value="GREEN">Green</option>
              <option value="MIX">Mix</option>
            </select>
            <div>
              <p className="mb-1">Quantity</p>
              <input
                type="number"
                placeholder="Quantity"
                className="input input-primary w-full"
                value={currentCard.quantity}
                onChange={(e) => {
                  setCurrentCard({ ...currentCard, quantity: e.target.value });
                }}
              />
            </div>
            <div className="w-full h-fit border border-blue-500 rounded-lg p-2 flex flex-col gap-2">
              <p>Tags</p>
              {currentCard.tags &&
                currentCard.tags.map((tag, i) => (
                  <div
                    key={i + "tag"}
                    className="w-fit border border-blue-300 rounded-lg px-2 flex flex-row items-center justify-start flex-wrap"
                  >
                    #{tag}
                  </div>
                ))}
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                if (isInEdit) {
                  if (
                    currentCard.title === "" ||
                    currentCard.description === "" ||
                    currentCard.type === "" ||
                    currentCard.quantity === 0
                  ) {
                    alert("Please fill all fields");
                    return;
                  }

                  let oldDeckList = [...deckList];
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.splice(
                      oldDeckList
                        .find((deck) => deck.name === selectedDeck)
                        .cards.findIndex(
                          (card) => card.title === currentCard.title
                        ),
                      1,
                      currentCard
                    );
                  setDeckList(oldDeckList);
                  saveDeckListToLocalStorage(oldDeckList);
                  setCurrentCard({
                    title: "",
                    description: "",
                    type: "",
                    quantity: 0,
                  });
                  setIsInEdit(false);
                  return;
                }

                let oldDeckList = [...deckList];
                if (
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.find((card) => card.title === currentCard.title)
                ) {
                  alert("Card already exists in deck");
                  return;
                }

                if (
                  currentCard.title === "" ||
                  currentCard.description === "" ||
                  currentCard.type === "" ||
                  currentCard.quantity === 0
                ) {
                  alert("Please fill all fields");
                  return;
                }

                oldDeckList
                  .find((deck) => deck.name === selectedDeck)
                  .cards.push(currentCard);
                setDeckList(oldDeckList);
                saveDeckListToLocalStorage(oldDeckList);
                setCurrentCard({
                  title: "",
                  description: "",
                  type: "",
                  quantity: 0,
                });
              }}
            >
              Add Card
            </button>
          </div>
          <div className="w-full h-[45rem] bg-slate-800 rounded-2xl p-4 flex flex-col gap-4">
            <p className="text-2xl font-bold ">Card List</p>
            <div className="w-full h-auto bg-slate-900 p-4 rounded-2xl grid grid-cols-6 gap-2">
              <p className="text-xl font-bold">title</p>
              <p className="text-xl font-bold col-span-2">description</p>
              <p className="text-xl font-bold">type</p>
              <p className="text-xl font-bold">quantity</p>
            </div>
            <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col divide-y divide-base-content overflow-y-scroll">
              {deckList
                .find((deck) => deck.name === selectedDeck)
                .cards.map((card, i) => (
                  <div
                    key={i + "card"}
                    className="w-full h-auto p-4 grid grid-cols-6 gap-3"
                  >
                    <p className="text-xl font-bold">{card.title}</p>
                    <p className=" col-span-2">{card.description}</p>
                    <p
                      className={
                        " w-fit h-fit p-2 font-bold rounded-xl " +
                        (card.type === "RED"
                          ? "bg-red-700"
                          : card.type === "BLUE"
                          ? "bg-blue-700"
                          : card.type === "GREEN"
                          ? "bg-green-700"
                          : card.type === "MIX"
                          ? "bg-yellow-700"
                          : "bg-neutral-700")
                      }
                    >
                      {card.type}
                    </p>
                    <p>{card.quantity}</p>
                    <div className="flex gap-4">
                      <button
                        className="btn  btn-error"
                        onClick={() => {
                          let oldDeckList = [...deckList];
                          oldDeckList
                            .find((deck) => deck.name === selectedDeck)
                            .cards.splice(i, 1);
                          setDeckList(oldDeckList);
                          saveDeckListToLocalStorage(oldDeckList);
                        }}
                      >
                        X
                      </button>
                      <button
                        className="btn  btn-warn"
                        onClick={() => {
                          setCurrentCard(card);
                          setIsInEdit(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
