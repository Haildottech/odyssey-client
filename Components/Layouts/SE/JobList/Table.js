import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const Modal = ({ result, groupBy}) => {
let title = []
const [group, setGroup] = useState('')

useEffect(() =>{
if(groupBy) {
    console.log(groupBy, result)
    if (groupBy == 'ClientId') {
      setGroup('Client')
        result.map((x) =>  x.map((y) => title.push(y.Client.name)))
    }
    else if (groupBy == 'shippingLineId') {
      setGroup('shipping_line')

      result.map((x) =>  x.map((y) => title.push(y.shipping_line?.name)))
      console.log({title})
    
    }
    else if (groupBy == 'vesselId') {
      setGroup('vessel')
      result.map((x) =>  x.map((y) => title.push(y.vessel?.name)))
        
    }
    else if (groupBy == 'commodityId') {
      setGroup('commodity')
      result.map((x) =>  x.map((y) => title.push(y.commodity?.name)))
    }

}
}, [groupBy])

  return (
    <div>
      <div className="d-flex justify-content-between">
        {/* <h5>{mainAcc !== undefined && mainAcc}</h5> */}
        {/* <b>Opening Balance : {getOpeningBalance}</b> */}
      </div>
      <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "hidden" }}>
        <div className="table-sm-1">
          <Table className="tableFixHead" bordered style={{ fontSize: 14 }}>
            <thead>
              <tr className="custom-width">
                <th className="text-center class-1">S.No #</th>
                <th className="text-center class-2">Job No</th>
                <th className="text-center class-1">HBL/ HAWB</th>
                <th className="text-center class-1">MBL / MAWB</th>
                <th className="text-center class-1">Sales.Rep </th>
                <th className="text-center class-1">Sailling / Arrival</th>
                <th className="text-center class-1">Shipper / Consignee</th>
                <th className="text-center class-1">Air / Shipping Line</th>
                <th className="text-center class-1">Local Agent</th>
                <th className="text-center class-1">Final Dest</th>
                <th className="text-center class-1">Commodity</th>
                <th className="text-center class-1">Cnts</th>
                <th className="text-center class-1">WT</th>
                <th className="text-center class-1">Net</th>
                <th className="text-center class-1">Tare</th>
                <th className="text-center class-1">Total</th>
                <th className="text-center class-1">Carrier Booking No</th>
                <th className="text-center class-1">Vol</th>
              </tr>
            </thead>
            {groupBy ? result.length > 0 &&
            result.map((x, i) => {
            return (
              <>
              <tbody>
                <tr><td colSpan={6}><b>{ x.length > 0 && x[i][group]?.name}</b></td></tr>
                { x.map((y, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{y.jobNo}</td>
                      <td className="text-center">{y.Bl.hbl}</td>
                      <td className="text-center">{y.Bl.mbl}</td>
                      <td className="text-center">
                        {y.sales_representator.name }
                      </td>
                      <td className="text-center"></td>
                      <td className="text-center">
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center">{y?.shipping_line?.name}</td>
                      <td className="text-center">{y.local_vendor.name}</td>
                      <td className="text-center">{y.fd}</td>
                      <td className="text-center">{y.commodity.name}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center">{y.carrier} </td>
                      <td className="text-center">{y.vol}</td>
                    </tr>
                  );
                })}
              </tbody>
              </>


            )}) : 
              <tbody>
                {/* <tr><td colSpan={6}><b>{"test"}</b></td></tr> */}
              {result.length > 0 &&
            result.map((y, i) => {
            return (
              <>
                 
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{y.jobNo}</td>
                      <td className="text-center">{y.Bl.hbl}</td>
                      <td className="text-center">{y.Bl.mbl}</td>
                      <td className="text-center">
                        {y.sales_representator.name }
                      </td>
                      <td className="text-center"></td>
                      <td className="text-center">
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center">{y?.shipping_line?.name}</td>
                      <td className="text-center">{y.local_vendor.name}</td>
                      <td className="text-center">{y.fd}</td>
                      <td className="text-center">{y.commodity.name}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center">{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center">{y.carrier} </td>
                      <td className="text-center">{y.vol}</td>
                    </tr>
              </>
            )})}
            </tbody>
            }
          </Table>
        </div>
      </div>
      <div className="d-flex justify-content-end">

      </div>
    </div>
  );
};

export default Modal;
