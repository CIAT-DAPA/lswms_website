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
        0: "Scarcity",
        1: "Drought",
        2: "Flood",
      },
    },
    type_content: {
      name: "Challenges",
    },
  };

  var wpContentWomen = {
    id: 1,
    content: {
      title: "Activities of women",
      type: String,
      language: "En",
      values: {
        0: "The area is characterised by an economy predominantly based on livestock and subsistence farming. Livestock rearing is a central activity in community life, and both men and women are involved in herding animals. However, women pastoralists often face additional challenges due to social norms and entrenched gender barriers in society.",
      },
    },
    type_content: {
      name: "Gender",
    },
  };
  return (
    <>
      <h5 className="mt-4 mb-3">Waterpoint</h5>
      <div className="d-flex justify-content-between flex-column flex-lg-row">
        <WaterpointItem item={wpContent} align="x" type="icon" />
        <WaterpointItem item={wpContent} align="x" type="icon" />
      </div>
      <WaterpointItem item={wpContentWomen} type="text" />
    </>
  );
}

export default WaterpointContent;
