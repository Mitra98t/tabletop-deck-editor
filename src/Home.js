import React from "react";
import Graph from "react-graph-vis";
import { useEffect } from "react";
import { useState } from "react";
import useWindowDimensions from "./useWindowDimensions";
import Card from "./Card";
export default function Home({ setPath, deckList, tagRegex }) {
  const [cardToShow, setCardToShow] = useState(null);
  const [cardListForTag, setCardListForTag] = useState([]);

  const { height, width } = useWindowDimensions();

  const deckColor = {
    Enemy: "#993333",
    Spell: "#339922",
    Event: "#3333FF",
    Loot: "#992299",
    "Dungeon Monsters": "#FF33FF",
    "Dungeon Loot": "#33FFFF",
  };
  const cardTypeColor = {
    RED: "#FF0000",
    GREEN: "#00FF00",
    BLUE: "#0000FF",
    MIX: "#FFFF00",
  };

  const eventObj = {
    doubleClick: ({ nodes, edges, e, pointer }) => {
      if (nodes.length === 0) {
        setCardListForTag([]);
        setCardToShow(null);
        return;
      }
      if (nodes[0].includes("tag")) {
        let cardListNew = [
          tagRegex.find(
            (tag) => tag[1].replace(/\s/g, "") === nodes[0].replace("tag", "")
          )[1],
        ];
        deckList.forEach((deck) => {
          deck.cards.forEach((card) => {
            if (
              card.tags
                .map((t) => t.replace(/\s/g, ""))
                .includes(nodes[0].replace("tag", ""))
            ) {
              cardListNew.push({ ...card, deckName: deck.name });
            }
          });
        });
        setCardToShow(null);
        setCardListForTag(cardListNew);
        return;
      }

      let cardTarget = {};
      let found = false;
      deckList.forEach((deck) => {
        deck.cards.forEach((card) => {
          if (("card" + card.title).replace(/\s/g, "") === nodes[0]) {
            cardTarget = { ...card, deckName: deck.name };
            found = true;
          }
        });
      });
      if (!found) {
        setCardToShow(null);
        return;
      }
      setCardListForTag([]);
      setCardToShow(cardTarget);
    },
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#FFFFFF",
      smooth: {
        enabled: true,
        type: "dynamic",
        roundness: 0.5,
      },
    },
    width: width * 0.6 + "px",
    height: height * 0.75 + "px",
  };

  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    setGraphData({
      nodes: [],
      edges: [],
    });
    // preprocess cards for graph visualization
    let newGraphData = {
      nodes: [],
      edges: [],
    };

    tagRegex.forEach((tag, i) => {
      let tagNode = {
        id: ("tag" + tag[1]).replace(/\s/g, ""),
        label: tag[1],
        color: "#333333",
        font: {
          color: "#FFFFFF",
        },
        shape: "circle",
      };
      if (!newGraphData.nodes.find((node) => node.id === tagNode.id))
        newGraphData.nodes.push(tagNode);
    });

    deckList.forEach((deck, di) => {
      deck.cards.forEach((card, i) => {
        let cardNode = {
          id: ("card" + card.title).replace(/\s/g, ""),
          label: card.title,
          shape: "box",
          title: deck.name,
          font: {
            size: 20,
            color: "#FFFFFF",
          },
          color: {
            background: deckColor[deck.name],
            border: cardTypeColor[card.type],
          },
          borderWidth: 3,
        };
        if (!newGraphData.nodes.find((node) => node.id === cardNode.id)) {
          newGraphData.nodes.push(cardNode);
        }

        card.tags.forEach((tag) => {
          let edge = {
            from: ("card" + card.title).replace(/\s/g, ""),
            to: ("tag" + tag).replace(/\s/g, ""),
            length: 300,
          };
          if (
            !newGraphData.edges.find(
              (edgeCheck) =>
                edgeCheck.from === edge.from && edgeCheck.to === edge.to
            )
          )
            newGraphData.edges.push(edge);
        });
      });
    });

    setGraphData(newGraphData);
  }, [deckList]);

  return (
    <div className="w-full h-fit flex flex-row items-center justify-center gap-2 ">
      {cardToShow && (
        <div className="fixed top-32 left-4 z-50">
          {" "}
          <Card idx={0} card={cardToShow} isBack={false} />{" "}
        </div>
      )}
      {cardListForTag.length !== 0 && (
        <div className="fixed p-4 top-32 left-4 flex flex-col gap-1 bg-slate-800 rounded-2xl h-fit max-h-96 overflow-y-auto z-50 ">
          <p className="font-bold text-xl">Cards with {cardListForTag[0]}</p>
          {cardListForTag.map((card, i) =>
            i === 0 ? null : <p key={i + "cardName"}>{card.title}</p>
          )}
        </div>
      )}
      {graphData.nodes.length !== 0 && (
        <div className="w-fit h-fit bg-slate-800 rounded-2xl overflow-hidden">
          <Graph graph={graphData} options={options} events={eventObj} />
        </div>
      )}
    </div>
  );
}
