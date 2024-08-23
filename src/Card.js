import React from "react";
import { palette } from "./utils";

export default function Card({ idx, isBack, card }) {
  return (
    <div
      key={idx + "card"}
      className={
        "w-[60mm] h-[80mm] border-4 text-black border-black bg-white flex flex-col gap-4 p-2 relative" +
        (isBack ? " items-center justify-center " : "")
      }
    >
      {isBack ? (
        <p className="text-4xl font-bold">{card.deckName}</p>
      ) : (
        <>
          <p className="text-2xl font-bold leading-5">{card.title}</p>
          <p className="text-xl whitespace-pre-wrap leading-5">
            {card.description}
          </p>
          <p className="absolute bottom-2 right-4 font-bold">{card.deckName}</p>
          <div
            className={
              "rounded-full w-7 aspect-square absolute bottom-2 left-2 " +
              (card.type === "RED"
                ? "bg-[" + palette.RED + "]"
                : card.type === "BLUE"
                ? "bg-[" + palette.BLUE + "]"
                : card.type === "GREEN"
                ? "bg-[" + palette.GREEN + "]"
                : card.type === "MIX"
                ? "bg-[" + palette.MIX + "]"
                : "bg-gray-500")
            }
          ></div>
        </>
      )}
    </div>
  );
}
