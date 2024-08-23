import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import Card from "./Card";

export default function DeckPrint({ deckListIn }) {
  const [isBack, setIsBack] = useState(false);
  const [deckList, setDeckList] = useState(deckListIn);
  const [decksToPrint, setDecksToPrint] = useState(
    deckList.map((deck) => deck.name)
  );
  const [pagingSystem, setPagingSystem] = useState([]);
  useEffect(() => {
    let allCards = [];
    deckList.forEach((deck) => {
      if (decksToPrint.indexOf(deck.name) !== -1)
        deck.cards.forEach((card) => {
          for (let i = 0; i < card.quantity; i++) {
            let cardCopy = { ...card };
            cardCopy.deckName = deck.name;
            if (!cardCopy.hidden) allCards.push(cardCopy);
          }
        });
    });

    const cardWidth = 60;
    const cardHeight = 80;
    const pageWidth = 210;
    const pageHeight = 297;

    const cardsPerPage =
      Math.floor(pageWidth / cardWidth) * Math.floor(pageHeight / cardHeight);

    const pages = Math.ceil(allCards.length / cardsPerPage);
    let pagingSystem = [];
    for (let i = 0; i < pages; i++) {
      pagingSystem.push(
        allCards.slice(i * cardsPerPage, (i + 1) * cardsPerPage)
      );
    }
    setPagingSystem(pagingSystem);
  }, [decksToPrint, deckList]);

  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };
  const handleDownloadPdf = async () => {
    const elements = document.getElementsByClassName("page");
    const canvases = [];
    var doc = new jsPDF("p", "mm");
    let imgWidth = 210;

    for (let i = 0; i < elements.length; i++) {
      const page = elements[i];
      let canv = await html2canvas(page);
      canvases.push(canv);
    }

    var imgData = canvases[0].toDataURL("image/png");
    doc.addImage(
      imgData,
      "PNG",
      0,
      0,
      imgWidth,
      Math.ceil((canvases[0].height * imgWidth) / canvases[0].width)
    );

    for (let idx = 1; idx < canvases.length; idx++) {
      doc.addPage();
      const canvas = canvases[idx];
      imgData = canvas.toDataURL("image/png");
      var imgHeight = Math.ceil((canvas.height * imgWidth) / canvas.width);
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    doc.save("cards.pdf");
  };
  return (
    <div className="w-full flex flex-row gap-4 justify-between">
      <button
        className="fixed bottom-4 left-4 btn btn-outline btn-success"
        onClick={() => handleDownloadPdf()}
      >
        Download Deck PDF
      </button>
      <div className="w-1/4 h-5/6 bg-slate-800 rounded-2xl flex flex-col gap-2 p-4">
        <p className="text-2xl font-bold ">Decks to print</p>
        <button
          onClick={() => setIsBack(!isBack)}
          className={"my-4 w-full " + (isBack ? "btn-primary" : "btn-outline")}
        >
          Card Backs
        </button>
        {deckList.map((deck, i) => (
          <button
            key={i + "deck"}
            className={
              "btn w-full " +
              (decksToPrint.indexOf(deck.name) !== -1
                ? "btn-primary"
                : "btn-outline")
            }
            onClick={() => {
              if (decksToPrint.indexOf(deck.name) !== -1) {
                setDecksToPrint(decksToPrint.filter((d) => d !== deck.name));
              } else {
                setDecksToPrint([...decksToPrint, deck.name]);
              }
            }}
          >
            {deck.name}
          </button>
        ))}
      </div>
      <div id="divToPrint" className="w-fit h-fit flex flex-col gap-4 ">
        {pagingSystem.length === 0 && (
          <div className="page w-[210mm] h-[297mm] bg-white p-6">
            <p className="text-4xl font-bold text-center text-black">
              No cards to print
            </p>
          </div>
        )}
        {pagingSystem.map((page, i) => (
          <div
            key={i + "page"}
            className="page w-[210mm] min-h-[297mm] h-fit bg-white p-[10mm]"
          >
            <div
              className={
                "w-full h-full flex flex-wrap items-start justify-start" +
                (isBack ? " flex-row-reverse " : " flex-row")
              }
            >
              {page.map((card, j) => (
                <Card idx={j} isBack={isBack} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/4 max-h-[48rem] overflow-y-scroll bg-slate-800 rounded-2xl flex flex-col gap-2 p-4">
        <div className="w-full h-fit flex flex-row items-center justify-between">
          <p className="font-bold text-2xl">Card Selection</p>
          <div className="w-fit h-fit flex flex-row items-center justify-between gap-2">
            <button
              onClick={() => {
                let newDeckList = [...deckList];
                newDeckList.forEach((deck) => {
                  deck.cards.forEach((card) => {
                    card.hidden = false;
                  });
                });
                setDeckList(newDeckList);
              }}
              className="text-xl px-2 rounded-lg outline outline-2 outline-blue-500 hover:outline-[3px]"
            >
              Select all
            </button>
            <button
              onClick={() => {
                let newDeckList = [...deckList];
                newDeckList.forEach((deck) => {
                  deck.cards.forEach((card) => {
                    card.hidden = true;
                  });
                });
                setDeckList(newDeckList);
              }}
              className="text-xl px-2 rounded-lg outline outline-2 outline-blue-500 hover:outline-[3px]"
            >
              Deselect all
            </button>
          </div>
        </div>
        {deckList.map((deck, i) =>
          decksToPrint.indexOf(deck.name) !== -1 ? (
            <div className="flex flex-col gap-1" key={deck.name}>
              <p className="text-xl font-bold">{deck.name}</p>
              {deck.cards.map((card, j) => (
                <div
                  className="w-full h-fit flex flex-row items-center justify-start gap-2"
                  key={j + "card"}
                >
                  <button
                    onClick={() => {
                      let newDeckList = [...deckList];
                      newDeckList[i].cards[j].hidden =
                        !newDeckList[i].cards[j].hidden;
                      setDeckList(newDeckList);
                    }}
                    className={
                      "w-6 aspect-square rounded-full " +
                      (card.hidden ? " bg-red-400" : "bg-green-400")
                    }
                  />
                  <p className="text-lg ">{card.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
}
