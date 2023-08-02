import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Notes = ({Router, dispatch, incrementTab, moment}) => {
const [notes, setNotes] = useState([])

    useEffect(() => {
    const req = async() =>{
    const res = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_SEAJOB_NOTES).then((x) => {
    if(x.data.status === 'success') {
    setNotes(x.data.result)
    }})}
    req()},
    [])
    
    return (
    <div className="notificationSide">
    <h5>Notes</h5>
    {notes.map((x, i) => {
    return (
    <div key={i} 
    onClick={() => {
    dispatch(incrementTab({"label": "SE JOB","key": "4-3","id":x.recordId}))
    Router.push(`/seJob/${x.recordId}`)}}
    className={`px-2 pt-1  my-1  notifications ${ x.opened == 0 ? "bg-secondary text-light" : "bg-white" }`}>
    <p className="fw-6 fs-15"> {x.title} </p>   
    <p className="fw-6 fs-13" style={{marginTop:"-15px"}}> {x.note} </p>
    <p className=" fs-13 " style={{marginTop:"-15px"}}>Cerated  by {x.createdBy} </p>
    <p className=" fs-13 " style={{marginTop:"-15px"}}> Created : {(moment(x.createdAt).fromNow())}</p>
    </div>
    )})}
    </div>
  )
}

export default Notes