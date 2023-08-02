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
import cowImg from "../../assets/svg/cow.svg";
import donkeyImg from "../../assets/svg/donkey.svg";
import sheepImg from "../../assets/svg/sheep.svg";
import Circle from "../circle/Circle";

function WaterpointItem(props) {
  const itemIconX = () => {
    return (
      <div className="col col-12 col-lg-5 mt-3">
        <h6 className="text-capitalize mb-3">{props.item.title}</h6>

        <div className="d-flex justify-content-between">
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
    return (
      <div className="col col-12 col-lg-5 mt-3">
        <h6 className="text-capitalize mb-3">{props.item.title}</h6>
        <div className="d-flex justify-content-between flex-column gap-3">
          {props.item.values.map((item, index) => {
            const [key, value] = Object.entries(item)[0];
            return (
              <div
                className="text-center d-flex align-items-center"
                key={index}
              >
                <Circle
                  img={
                    key.toLowerCase() === "cow"
                      ? cowImg
                      : key.toLowerCase() === "donkey"
                      ? donkeyImg
                      : key.toLowerCase() === "sheep"
                      ? sheepImg
                      : unknowImg
                  }
                  percentage={50}
                />
                <p className="mb-0 me-2 ms-2 text-capitalize">{`${key}:`}</p>{" "}
                <p className="mb-0">{`${value}`}</p>
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
        <h5>{props.item.type_content.name}</h5>
        <h6>{props.item.content.title}</h6>
        {Object.values(props.item.content.values).map((value, index) => (
          <p key={index}>{value}</p>
        ))}
      </>
    );
  };

  const itemTable = () => {
    return (
      <>
        <h5>{props.title}</h5>
        <table className="fs-6 w-100">
          <tbody>
            {props.title === "Watershed description"
              ? Object.entries(props.item).map(([key, value]) => (
                  <tr key={key} className="tr-table">
                    <td className="text-capitalize ">{`${key}:`}</td>
                    <td className="text-end text-capitalize">{`${value}`}</td>
                  </tr>
                ))
              : props.item.map((item, index) => {
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
          <h6 className="mb-0">{props.item.title}</h6>
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
