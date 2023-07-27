import React from "react";
import scarcityImg from "../../assets/img/scarcityImg.png"

function WaterpointItem(props) {
  return (
    <>
      <h6>{props.item.content.title}</h6>
      <div className="d-flex">
        <div className="text-center">
          <img src={scarcityImg} className="border border-3 border-danger rounded-circle " />
          <p>test</p>
        </div>
        <div className="text-center">
          <img src={scarcityImg} />
          <p>test</p>
        </div>
        {Object.values(props.item.content.values).map((value, index)=>(
            <p>danger</p>
        ))}
      </div>
    </>
  );
}

export default WaterpointItem;
