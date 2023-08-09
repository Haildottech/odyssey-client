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

      <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "scroll" }}>
        <div className="table-sm-1">
          <Table className="tableFixHead" bordered style={{ fontSize: 14 }}>
            <thead>
              <tr className="custom-width fs-11">
                <th className="text-center p-0">S.No #</th>
                <th className="text-center p-0">Job No</th>
                <th className="text-center p-0">HBL/HAWB</th>
                <th className="text-center p-0">MBL / MAWB</th>
                <th className="text-center p-0">Sales.Rep </th>
                <th className="text-center p-0">Sailling Arrival</th>
                <th className="text-center p-0">Shipper/ Consignee</th>
                <th className="text-center p-0">Air/ Shipping Line</th>
                <th className="text-center p-0">Local Agent</th>
                <th className="text-center p-0">Final Dest</th>
                <th className="text-center p-0">Commodity</th>
                <th className="text-center p-0">Cnts</th>
                <th className="text-center p-0">WT</th>
                <th className="text-center p-0">Net</th>
                <th className="text-center p-0">Tare</th>
                <th className="text-center p-0">Total</th>
                <th className="text-center p-0" style={{whiteSpace: "nowrap"}}>Carrier Book No</th>
                <th className="text-center p-0">Vol</th>
              </tr>
            </thead>
            {groupBy ? result.length > 0 &&
            result.map((x, i) => {
            return (
              <>
              <tbody className="fs-11">
                <tr><td colSpan={6}><b>{ x.length > 0 && x[i][group]?.name}</b></td></tr>
                { x.map((y, i) => {
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{y.jobNo}</td>
                      <td className="text-center p-0">{y.Bl.hbl}</td>
                      <td className="text-center p-0">{y.Bl.mbl}</td>
                      <td className="text-center p-0">
                        {y.sales_representator.name }
                      </td>
                      <td className="text-center p-0"></td>
                      <td className="text-center p-0 ">
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center p-0">{y?.shipping_line?.name}</td>
                      <td className="text-center p-0">{y.local_vendor.name}</td>
                      <td className="text-center p-0">{y.fd}</td>
                      <td className="text-center p-0">{y.commodity.name}</td>
                      <td className="text-center p-0">{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center p-0">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center p-0">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center p-0">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center p-0">{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center p-0">{y.carrier} </td>
                      <td className="text-center p-0">{y.vol}</td>
                    </tr>
                  );
                })}
              </tbody>
              </>


            )}) : 
              <tbody className="fs-11">
              {result.length > 0 &&
            result.map((y, i) => {
            return (
              <>
                 
                    <tr key={i}>
                      <td className="text-center py-1 px-1">{i + 1}</td>
                      <td className="text-center py-1 px-1">{y.jobNo}</td>
                      <td className="text-center py-1 px-1">{y.Bl.hbl}</td>
                      <td className="text-center py-1 px-1">{y.Bl.mbl}</td>
                      <td className="text-center py-1 px-1">
                        {y.sales_representator.name }
                      </td>
                      <td className="text-center py-1 px-1"></td>
                      <td className="text-center py-1 px-0">
                      {y.shipper.name }
                      {y.consignee.name }
                      </td>
                      <td className="text-center py-1 px-1">{y?.shipping_line?.name}</td>
                      <td className="text-center py-1 px-1">{y.local_vendor.name}</td>
                      <td className="text-center py-1 px-1">{y.fd}</td>
                      <td className="text-center py-1 px-1">{y.commodity.name}</td>
                      <td className="text-center py-1 px-1">{y.Bl.Container_Infos?.map((x) => x.no)} </td>
                      <td className="text-center py-1 px-1">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.gross), 0 )}</td>
                      <td className="text-center py-1 px-1">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.net), 0 )}</td>
                      <td className="text-center py-1 px-1">{y.Bl.Container_Infos?.reduce((x, cur) => x + Number(cur.tare), 0 )}</td>
                      <td className="text-center py-1 px-1">{y.Bl.Container_Infos?.reduce((x, cur) => x + (Number(cur.net) + Number(cur.tare) + Number(cur.gross)), 0 )}</td>
                      {/* <td className="text-center">{y.weight}</td> */}
                      <td className="text-center py-1 px-1">{y.carrier} </td>
                      <td className="text-center py-1 px-1">{y.vol}</td>
                    </tr>
              </>
            )})}
            </tbody>
            }
          </Table>
        </div>
      </div>
    
    </div>
  );
};

export default Modal;
