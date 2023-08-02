import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { updateNotification } from '/functions/notifications';

const Notifications = ({dispatch, incrementTab, Router,  moment}) => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTimeout(async() => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFICATION)
      .then((x) => setNotifications(x.data.result))
    }, 3000)
  }, []);

  const update = async(x) =>{
    const data = {opened: 1, subType:x.subType}
    updateNotification(data)    
  }

  return (
  <div className="notificationSide">
    <h5>Notifications</h5>
    {notifications?.map((x, i) => {
      return (
        <div key={i} className={`px-2 pt-1 my-1 notifications ${x.opened==0? "bg-secondary text-light":"bg-white"}`}
          onClick={()=>{
          update(x);
          dispatch(incrementTab({"label": "SE JOB","key": "4-3","id":x.recordId}));
          Router.push(`/seJob/${x.recordId}`)}}
        >
          <p className="fw-6 fs-15"> {x.notification} by {x.createdBy?.name} </p>
          <p className=" fs-13 " style={{marginTop:"-15px"}}> Created : {(moment(x.createdAt).fromNow())}</p>
        </div>
      )})
    }
  </div>
)}

export default Notifications