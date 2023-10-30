import React from "react";
import sourcesImg from "../../assets/svg/sources.svg";

function ItemSimpleList(props) {
  return (
    <>
      <div className="d-flex align-items-center mt-4 mb-2">
        {props.item.title.toLowerCase() === "water sources" ? (
          <img src={sourcesImg} alt="" className="me-2" />
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
              <p className="fw-normal mb-1">{`${value}`}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ItemSimpleList;
