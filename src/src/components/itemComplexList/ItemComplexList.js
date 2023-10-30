import React from "react";
import seasonImg from "../../assets/img/seasonsImg.png";

function ItemComplexList(props) {
  return (
    <>
      <div className="d-flex align-items-center mt-4 mb-2">
        {props.item.title.toLowerCase() === "seasons" ? (
          <img src={seasonImg} alt="" className="me-2" />
        ) : (
          <></>
        )}
        <h6 className="mb-0 text-capitalize">{props.item.typecontent_name}</h6>
      </div>
      <ul className="list-unstyled">
        {props.item.values.map((item, i) => {
          const [key, value] = Object.entries(item)[0];
          return (
            <li key={i} className=" d-flex">
              {
                <p className="text-capitalize fw-medium me-3 mb-1">{`${key}:`}</p>
              }
              <p className="fw-normal mb-1">{`${value}`}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ItemComplexList;
