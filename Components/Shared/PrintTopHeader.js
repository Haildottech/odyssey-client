import React from 'react';
import moment from 'moment';

const PrintTopHeader = ({company}) => {
  return (
    <>
    <div className="d-flex justify-content-between" >
        <div style={{width:"20%"}} className="text-center">
            <img src={company=='1'?"/seanet-logo-complete.png":company=='3'?"/aircargo-logo.png":"/cargolinkers-logo.png"} className="invert" width={130}/>
        </div>
        <div style={{width:"60%"}} className="text-center">
            <h5>
                <b>
                    {company=='1'?"SEA NET SHIPPING & LOGISTICS":company=='2'?"CARGO LINKERS":"AIR CARGO SERVICES"}
                </b>
            </h5>
            <div className="fs-13">
                House# D-213, DMCHS, Siraj Ud Daula Road, Karachi
            </div>
        </div>
        <div style={{width:"20%", paddingTop:20}}>
        </div>
    </div>
    </>
  )
}

export default PrintTopHeader
