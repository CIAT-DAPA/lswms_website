import React from 'react'
import './WatershedItem.css'

function WatershedItem(props) {
  return (
    <>
     <h6>{props.title}</h6>
     <p className='text-justify'>{props.description}</p>
    </>
  )
}

export default WatershedItem