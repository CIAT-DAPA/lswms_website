import React from "react";
import unknowImg from "../../assets/img/unknowImg.png";
import cowImg from "../../assets/img/cow.png";
import donkeyImg from "../../assets/img/donkey.png";
import sheepImg from "../../assets/img/sheep.png";
import goatImg from "../../assets/img/goat.png";
import wheatImg from "../../assets/img/wheat.png";
import maizeImg from "../../assets/img/maize.png";
import livestockImg from "../../assets/img/livestock.png";
import agricultureImg from "../../assets/img/agriculture.png";
import camelImg from "../../assets/img/camel.png";
import maleImg from "../../assets/img/male.png";
import femaleImg from "../../assets/img/female.png";
import Circle from "../circle/Circle";

function ItemIconY(props) {
  const totalSum = props.item.values.reduce((acc, item) => {
    const value = Object.values(item)[0];
    return acc + value;
  }, 0);
  return (
    <div className="col mt-3">
      <h6 className="text-capitalize mb-3">{props.item.title}</h6>
      <div className="d-flex justify-content-between flex-row flex-wrap flex-md-column flex-md-nowrap  gap-2">
        {props.item.values.map((item, index) => {
          const [key, value] = Object.entries(item)[0];
          return (
            <div className="text-center d-flex align-items-center" key={index}>
              <Circle
                img={
                  key.toLowerCase() === "cattle"
                    ? cowImg
                    : key.toLowerCase() === "donkey"
                    ? donkeyImg
                    : key.toLowerCase() === "sheep"
                    ? sheepImg
                    : key.toLowerCase() === "camel"
                    ? camelImg
                    : key.toLowerCase() === "goat"
                    ? goatImg
                    : key.toLowerCase() === "male"
                    ? maleImg
                    : key.toLowerCase() === "female"
                    ? femaleImg
                    : value.toLowerCase() === "wheat"
                    ? wheatImg
                    : value.toLowerCase() === "maize"
                    ? maizeImg
                    : value.toLowerCase() === "livestock"
                    ? livestockImg
                    : value.toLowerCase() === "agriculture"
                    ? agricultureImg
                    : unknowImg
                }
                percentage={(value * 100) / totalSum}
                color={props.item.title}
                gender={key}
              />
              {props.item.title.toLowerCase() ===
                "agriculture context livestock" ||
              props.item.title.toLowerCase() === "gender" ? (
                <p className="mb-0 me-2 text-capitalize">{`${key}: `}</p>
              ) : (
                <></>
              )}

              <p className="mb-0 text-capitalize">{`${value}`}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemIconY;
