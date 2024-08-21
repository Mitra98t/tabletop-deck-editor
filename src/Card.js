import React from "react";

export default function Card({ idx, isBack, card }) {
  return (
    <div
      key={idx + "card"}
      className={
        "w-[60mm] h-[80mm] border-4 text-black border-black bg-white flex flex-col gap-2 p-2 relative" +
        (isBack ? " items-center justify-center " : "")
      }
    >
      {isBack ? (
        <p className="text-4xl font-bold">{card.deckName}</p>
      ) : (
        <>
          <p className="text-2xl font-bold">{card.title}</p>
          <p className="text-xl whitespace-pre-wrap leading-5">
            {card.description}
          </p>
          <p className="absolute bottom-2 right-4 font-bold">{card.deckName}</p>
          <div
            className={
              "rounded-full w-7 aspect-square absolute bottom-2 left-2 " +
              (card.type === "RED"
                ? "bg-red-500"
                : card.type === "BLUE"
                ? "bg-blue-500"
                : card.type === "GREEN"
                ? "bg-green-500"
                : card.type === "MIX"
                ? "bg-yellow-500"
                : "bg-gray-500")
            }
          ></div>
        </>
      )}
    </div>
  );
}
