import React from "react";

function ItemText(props) {
  return (
    <>
      <h6 className="text-capitalize ">{props.item.title}</h6>
      {props.item.values.map((item, index) => {
        const key = Object.keys(item)[0]; // Obtiene la clave (por ejemplo: 'topography', 'hidrology', 'demography')
        const value = item[key]; // Obtiene el valor correspondiente
        return (
          <div key={index}>
            <p>{value}</p>
          </div>
        );
      })}
    </>
  );
}

export default ItemText;
