import React, { useEffect } from "react";
import { palette } from "./utils";
import { useState } from "react";
import { use } from "react";

export default function Card({ idx, isBack, card }) {
  const [titleDimension, setTitleDimension] = useState(0);

  useEffect(() => {
    const titleElement = document.getElementById(idx + "title");
    if (titleElement) {
      setTitleDimension(titleElement.scrollWidth);
    }
  }, [idx]);

  return (
    <div
      key={idx + "card"}
      className={
        "w-[70mm] h-[70mm] text-[#ffdea4] border-[1.5mm] border-[#986526] rounded-[5mm] bg-[#120e03] flex flex-col overflow-hidden" +
        (isBack ? " items-center justify-center " : "")
      }
    >
      {isBack ? (
        <p className="text-4xl font-bold">{card.deckName.toUpperCase()}</p>
      ) : (
        <>
          <div
            id={idx + "title_box"}
            className="w-full h-[10mm] flex flex-row items-center justify-center text-4xl font-bold whitespace-nowrap"
          >
            <p
              id={idx + "title"}
              style={{
                transform: `scaleX(${
                  titleDimension > -0 && 230 < titleDimension
                    ? (250 - 20) / titleDimension
                    : 1
                })`,
              }}
              className="mb-[1mm]"
            >
              {card.title.toUpperCase()}
            </p>
          </div>
          <div id="image" className="w-full h-[35mm] p-[2mm] relative">
            <div className="absolute -bottom-[3mm] left-[8.5mm] w-[50mm] h-[7mm] rounded-[2mm] outline outline-[1mm] outline-[#120e03] "></div>
            <div className="w-full h-full absolute inset-0 border-[1mm] border-[#986526] rounded-[3mm]"></div>
            <div
              className="w-full h-full rounded-[1.5mm] "
              style={{
                backgroundImage: `linear-gradient(to bottom, ${
                  palette[card.type]
                } 0%, #120e03 100%)`,
              }}
            >
              <img
                src={card.image}
                alt="graphic"
                className="w-full h-full object-cover rounded-[1.5mm]"
              />
            </div>
            <div className="absolute -bottom-[3mm] left-[8.5mm] w-[50mm] h-[7mm] rounded-[2mm] border-[1mm] border-[#986526] bg-[#120e03] flex items-center justify-center font-bold text-sm ">
              <div className="scale-x-90">
                {card.definition
                  ? card.definition.toUpperCase()
                  : card.deckName.toUpperCase()}
              </div>
            </div>
          </div>
          <div id="description" className="h-[25mm] p-[1mm]">
            <div className="w-full h-full bg-[#ffdea4] rounded-[2.5mm] px-[2mm] pt-[1mm] flex items-center justify-start">
              {/* <div className="w-full h-[20mm] rounded-[2.5mm] px-[2mm] py-[0.5mm] flex justfy-start items-center"> */}
              <p className="text-[#120e03] leading-none font-semibold text-sm">
                {card.description.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              {/* </div> */}
            </div>
          </div>
          {/*
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
        */}
        </>
      )}
    </div>
  );
}
