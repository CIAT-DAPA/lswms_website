import React from "react";
import "./ItemTable.css";
import Configuration from "../../conf/Configuration";

function ItemTable(props) {
  return (
    <>
      <table className="fs-6 w-100">
        <tbody>
          {props.title === "Watershed description"
            ? Object.entries(props.item).map(([key, value]) => (
                <tr key={key} className="tr-table">
                  <td className="text-capitalize ">{`${Configuration.set_format_administrative_level(
                    key
                  )}:`}</td>
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
}

export default ItemTable;
