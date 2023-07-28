import React from "react";
import scarcityImg from "../../assets/img/scarcityImg.png";
import "./WaterpointItem.css";
import seasonImg from "../../assets/img/seasonsImg.png";
import sourcesImg from "../../assets/svg/sources.svg";

function WaterpointItem(props) {
  const itemIcon = () => {
    return (
      <div className="col col-12 col-lg-5 mt-3">
        <h6>{props.item.content.title}</h6>
        {props.align === "x" ? (
          <div className="d-flex justify-content-between">
            {Object.values(props.item.content.values).map((value, index) => (
              <div className="text-center" key={index}>
                <img
                  src={scarcityImg}
                  alt=""
                  className="border border-3 border-danger rounded-circle "
                />
                <p>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-between flex-column gap-3">
            {Object.entries(props.item.content.values).map(([key, value]) => (
              <div className="text-center d-flex align-items-center" key={key}>
                <img
                  src={scarcityImg}
                  alt=""
                  className="border border-3 border-danger rounded-circle me-3"
                />
                <p className="mb-0 me-2">{`${key}:`}</p>{" "}
                <p className="mb-0">{`${value}`}</p>
              </div>
            ))}
          </div>
        )}
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
            {Object.entries(props.item).map(([key, value]) => (
              <tr key={key} className="tr-table">
                <td className="text-capitalize ">{`${key}:`}</td>
                <td className="text-end text-capitalize">{`${value}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const itemList = () => {
    return (
      <>
        <div className="d-flex align-items-center mt-4 mb-2">
          {props.item.content.title === "Seasons" ? (
            <img src={seasonImg} alt="" className="me-2" />
          ) : props.item.content.title === "Water Sources" ? (
            <img src={sourcesImg} alt="" className="me-2" />
          ) : (
            <></>
          )}
          <h6 className="mb-0">{props.item.content.title}</h6>
        </div>
        <ul className="list-unstyled">
          {Object.entries(props.item.content.values).map(([key, value]) => (
            <li key={key} className=" d-flex">
              {props.item.content.title === "Water Sources" ? (
                <></>
              ) : (
                <p className="text-capitalize fw-medium me-3 mb-1">{`${key}:`}</p>
              )}
              <p className="fw-normal mb-1">{`${value}`}</p>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <>
      {props.type === "icon" ? (
        itemIcon()
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
