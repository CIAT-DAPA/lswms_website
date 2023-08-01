import React from 'react'

function Legend() {
  return (
    <div className="legend">
      <h3>Leyenda</h3>
      <div>
        <span className="legend-item" style={{ backgroundColor: 'blue' }}></span>
        <span>Algo relacionado con el color azul</span>
      </div>
      <div>
        <span className="legend-item" style={{ backgroundColor: 'red' }}></span>
        <span>Algo relacionado con el color rojo</span>
      </div>
      {/* Agrega más elementos de la leyenda según tus necesidades */}
    </div>
  )
}

export default Legend