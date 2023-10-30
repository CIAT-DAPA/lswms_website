import React from "react";
import scarcityImg from "../../assets/img/scarcityImg.png";
import droughtImg from "../../assets/img/droughtImg.png";
import floodImg from "../../assets/img/floodImg.png";
import degradationImg from "../../assets/img/degradationImg.png";
import bushImg from "../../assets/img/bushImg.png";
import unknowImg from "../../assets/img/unknowImg.png";

function ItemIconX(props) {
  return (
    <div className="col col-12 mt-3">
      <h6 className="text-capitalize mb-3">{props.item.title}</h6>

      <div className="d-flex justify-content-around">
        {props.item.values &&
          props.item.values.map((item, index) => {
            const value = Object.values(item)[0];
            return (
              <div
                className="d-flex flex-column align-items-center "
                key={index}
              >
                <div
                  className="border border-3 border-danger rounded-circle d-flex justify-content-center align-items-center "
                  style={{ width: "60px", height: "60px" }}
                >
                  <img
                    src={
                      value.toLowerCase() === "rangelands degradation"
                        ? degradationImg
                        : value.toLowerCase() === "scarcity of water"
                        ? scarcityImg
                        : value.toLowerCase() === "bush encroachment"
                        ? bushImg
                        : value.toLowerCase() === "drought"
                        ? droughtImg
                        : value.toLowerCase() === "flood"
                        ? floodImg
                        : unknowImg
                    }
                    alt=""
                    className=" "
                  />
                </div>

                <p className="text-capitalize ">{value}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ItemIconX;
