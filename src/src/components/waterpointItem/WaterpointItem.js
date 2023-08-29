import React from "react";
import scarcityImg from "../../assets/img/scarcityImg.png";
import droughtImg from "../../assets/img/droughtImg.png";
import floodImg from "../../assets/img/floodImg.png";
import degradationImg from "../../assets/img/degradationImg.png";
import bushImg from "../../assets/img/bushImg.png";
import unknowImg from "../../assets/img/unknowImg.png";
import "./WaterpointItem.css";
import seasonImg from "../../assets/img/seasonsImg.png";
import sourcesImg from "../../assets/svg/sources.svg";
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

function WaterpointItem(props) {
  const itemIconX = () => {
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
  };

  const itemIconY = () => {
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
              <div
                className="text-center d-flex align-items-center"
                key={index}
              >
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
  };

  const itemText = () => {
    return (
      <>
      <h5 className="text-capitalize ">{props.item.title}</h5>
        {props.item.values.map((item, index) => {
          const key = Object.keys(item)[0]; // Obtiene la clave (por ejemplo: 'topography', 'hidrology', 'demography')
          const value = item[key]; // Obtiene el valor correspondiente
          return (
            <div key={index}>
              
              <h6 className="text-capitalize ">{key}</h6>
              <p>{value}</p>
            </div>
          );
        })}
      </>
    );
  };

  const itemTable = () => {
    return (
      <>
        <table className="fs-6 w-100">
          <tbody>
            {props.title === "Watershed description"
              ? Object.entries(props.item).map(([key, value]) => (
                  <tr key={key} className="tr-table">
                    <td className="text-capitalize ">{`${key}:`}</td>
                    <td className="text-end text-capitalize">{`${value}`}</td>
                  </tr>
                ))
              : props.item.values.map((item, index) => {
                  const [key, value] = Object.entries(item)[0];
                  return (
                    <tr key={index} className="tr-table">
                      <td className="text-capitalize ">{`${key}:`}</td>
                      <td className="text-end text-capitalize">{`${value}`}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </>
    );
  };

  const itemList = () => {
    return (
      <>
        <div className="d-flex align-items-center mt-4 mb-2">
          {props.item.title.toLowerCase() === "seasons" ? (
            <img src={seasonImg} alt="" className="me-2" />
          ) : props.item.title.toLowerCase() === "water sources" ? (
            <img src={sourcesImg} alt="" className="me-2" />
          ) : (
            <></>
          )}
          <h6 className="mb-0 text-capitalize">{props.item.title}</h6>
        </div>
        <ul className="list-unstyled">
          {props.item.values.map((item, i) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <li key={i} className=" d-flex">
                {props.item.title.toLowerCase() === "water sources" ? (
                  <></>
                ) : (
                  <p className="text-capitalize fw-medium me-3 mb-1">{`${key}:`}</p>
                )}
                <p className="fw-normal mb-1">{`${value}`}</p>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <>
      {props.type === "icon-x" ? (
        itemIconX()
      ) : props.type === "icon-y" ? (
        itemIconY()
      ) : props.type === "text" ? (
        itemText()
      ) : props.type === "table" ? (
        itemTable()
      ) : props.type === "list" ? (
        itemList()
      ) : (
        <></>
      )}
    </>
  );
}

export default WaterpointItem;
