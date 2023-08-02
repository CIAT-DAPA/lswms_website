import React from 'react'
import './WatershedItem.css'

function WatershedItem(props) {
  return (
    <>
     <h6 className='text-capitalize '>{props.title}</h6>
     <p className=''>{props.description}</p>
    </>
  )
}

export default WatershedItem