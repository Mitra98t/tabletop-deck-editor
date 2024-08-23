import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { Doughnut } from "react-chartjs-2";
import { PieChart } from "@mui/x-charts/PieChart";

import { Chart, ArcElement } from "chart.js";
import { palette } from "./utils";
Chart.register(ArcElement);

export default function DeckEditor({
  deckList,
  setDeckList,
  currentCard,
  setCurrentCard,
  selectedDeck,
  setSelectedDeck,
  saveDeckListToLocalStorage,
  tagRegex,
}) {
  const populateChart = () => {
    let quantityByType = {
      RED: 0,
      BLUE: 0,
      GREEN: 0,
      MIX: 0,
    };
    deckList
      .find((deck) => deck.name === selectedDeck)
      .cards.forEach((card) => {
        quantityByType[card.type] += card.quantity - 0;
      });

    console.log(quantityByType);

    setCardTypesChartData({
      labels: ["Red", "Blue", "Green", "Mix"],
      datasets: [
        {
          label: "Card Types",
          data: [
            quantityByType.RED,
            quantityByType.BLUE,
            quantityByType.GREEN,
            quantityByType.MIX,
          ],
          backgroundColor: [
            palette.RED,
            palette.BLUE,
            palette.GREEN,
            palette.MIX,
          ],
          hoverOffset: 4,
        },
      ],
    });
  };

  const [cardTypesChartData, setCardTypesChartData] = useState(null);

  useEffect(() => {
    populateChart();
  }, [deckList, selectedDeck]);

  const [isInEdit, setIsInEdit] = useState("");
  const getTags = (description) => {
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
      <div className="w-1/3 h-full flex flex-col gap-4 items-start">
        <div className="w-full h-full bg-slate-800 rounded-2xl p-4 flex flex-col gap-2 items-start ">
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
        <div className="w-full aspect-square bg-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-4 ">
          {cardTypesChartData && (
            <>
              <div className="w-full h-fit flex items-center justify-evenly">
                <p
                  className={
                    "bg-[" + palette.RED + "] w-fit h-fit px-2 rounded-lg"
                  }
                >
                  Red
                </p>
                <p
                  className={
                    "bg-[" + palette.BLUE + "] w-fit h-fit px-2 rounded-lg"
                  }
                >
                  Blue
                </p>
                <p
                  className={
                    "bg-[" + palette.GREEN + "] w-fit h-fit px-2 rounded-lg"
                  }
                >
                  Green
                </p>
                <p
                  className={
                    "bg-[" + palette.MIX + "] w-fit h-fit px-2 rounded-lg"
                  }
                >
                  Mix
                </p>
              </div>
              <Doughnut
                options={{
                  tooltip: {
                    enabled: true,
                  },
                }}
                data={cardTypesChartData}
              />
            </>
          )}
        </div>
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
                if (isInEdit !== "") {
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
                  if (
                    currentCard.title !== isInEdit &&
                    oldDeckList
                      .find((deck) => deck.name === selectedDeck)
                      .cards.find((card) => card.title === currentCard.title)
                  ) {
                    alert("Card already exists in deck");
                    return;
                  }
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.splice(
                      oldDeckList
                        .find((deck) => deck.name === selectedDeck)
                        .cards.findIndex((card) => card.title === isInEdit),
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
                  setIsInEdit("");
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
              <button
                onClick={() => {
                  let oldDeckList = [...deckList];
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.sort((a, b) => a.title.localeCompare(b.title));
                  setDeckList(oldDeckList);
                  saveDeckListToLocalStorage(oldDeckList);
                }}
                className="w-fit h-fit flex flex-row gap-2 items-start btn-ghost"
              >
                <p className="text-xl font-bold">Title</p>
              </button>
              <p className="text-xl font-bold col-span-2 btn-ghost hover:bg-transparent">
                Description
              </p>
              <button
                onClick={() => {
                  let oldDeckList = [...deckList];
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.sort((a, b) => {
                      if (a.type === b.type) {
                        return 0;
                      }
                      if (a.type === "RED") {
                        return -1;
                      }
                      if (a.type === "BLUE" && b.type === "GREEN") {
                        return -1;
                      }
                      if (a.type === "GREEN" && b.type === "MIX") {
                        return -1;
                      }
                      return 1;
                    });
                  setDeckList(oldDeckList);
                  saveDeckListToLocalStorage(oldDeckList);
                }}
                className="w-fit h-fit flex flex-row gap-2 items-start btn-ghost"
              >
                <p className="text-xl font-bold">Type</p>
              </button>
              <button
                onClick={() => {
                  console.log("sorting");
                  let oldDeckList = [...deckList];
                  oldDeckList
                    .find((deck) => deck.name === selectedDeck)
                    .cards.sort((a, b) => b.quantity - a.quantity);
                  setDeckList(oldDeckList);
                  saveDeckListToLocalStorage(oldDeckList);
                }}
                className="w-fit h-fit flex flex-row gap-2 items-start btn-ghost"
              >
                <p className="text-xl font-bold">Quantity</p>
              </button>
            </div>
            <div className="w-full h-full bg-slate-900 rounded-2xl flex flex-col divide-y divide-base-content overflow-y-scroll">
              {deckList
                .find((deck) => deck.name === selectedDeck)
                .cards.map((card, i) => (
                  <div
                    key={i + "card"}
                    className="w-full h-auto p-4 grid grid-cols-6 gap-3"
                  >
                    <p className="pl-2 flex items-center justify-start text-xl font-bold">
                      {card.title}
                    </p>
                    <p className="pl-2 flex items-center justify-start col-span-2">
                      {card.description}
                    </p>
                    <div className="pl-2 flex items-center justify-start w-full h-full">
                      <p
                        className={
                          "w-fit h-fit p-2 font-bold rounded-xl " +
                          (card.type === "RED"
                            ? "bg-[" + palette.RED + "]"
                            : card.type === "BLUE"
                            ? "bg-[" + palette.BLUE + "]"
                            : card.type === "GREEN"
                            ? "bg-[" + palette.GREEN + "]"
                            : card.type === "MIX"
                            ? "bg-[" + palette.MIX + "]"
                            : "bg-neutral-700")
                        }
                      >
                        {card.type}
                      </p>
                    </div>
                    <p className="pl-2 flex items-center justify-start">
                      {card.quantity}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <button
                        className="btn  btn-error h-fit"
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
                        className="btn  btn-warn h-fit"
                        onClick={() => {
                          setCurrentCard(card);
                          setIsInEdit(card.title);
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
