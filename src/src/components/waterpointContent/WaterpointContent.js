import React from "react";
import WaterpointItem from "../waterpointItem/WaterpointItem";

function WaterpointContent() {
  var wpContent = {
    id: 1,
    content: {
      title: "Livestock production challenges",
      type: String,
      language: "En",
      values: {
        0:"Scarcity",
        1:"Drought",
        2:"Flood",
      },
    },
    type_content: {
      name: "Challenges",
    }
  };
  return (
    <>
      <h5 className="mt-4 mb-3">Waterpoint</h5>
      <WaterpointItem
        item = {wpContent}
      />
    </>
  );
}

export default WaterpointContent;
