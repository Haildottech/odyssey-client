import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import moment from "moment";

const Sheet = ({data, payType}) => {

    const [records, setRecords] = useState([]);
    const [total, setTotal] = useState({
        recieved:0.00,
        paid:0.00,
        total:0.00,
        balance:0.00
    })
    useEffect(() => {
        let tempData = [];
        data.forEach((x)=>{
            tempData.push({
                ...x,
                roundOff:parseFloat(x.roundOff),
                recieved:parseFloat(x.recieved),
                total:parseFloat(x.total),
                paid:parseFloat(x.paid),
                balance:payType=="Recievable"? 
                (parseFloat(x.total) - parseFloat(x.recieved) + parseFloat(x.roundOff)):
                (parseFloat(x.total) - parseFloat(x.paid) + parseFloat(x.roundOff))
            })
        });
        setRecords(tempData)
        let sum = tempData.reduce((accumulator, x) => {
            return accumulator + x.total + x.roundOff;
        }, 0);
        let recieved = tempData.reduce((accumulator, x) => {
            return accumulator + x.recieved;
        }, 0);
        let paid = tempData.reduce((accumulator, x) => {
            return accumulator + x.paid;
        }, 0);
        let balance = tempData.reduce((accumulator, x) => {
            return accumulator + x.balance;
        }, 0);
        setTotal({total:sum, recieved:recieved, paid:paid, balance:balance})
    }, [data])

    const getAge = (date) => {
        let date1 = new Date(date);
        let date2 = new Date();
        let difference = date2.getTime() - date1.getTime();
        return parseInt(difference/86400000)
    }

    const setCommas = (val) => {
        let result = 0.00;
        console.log(val)
        if(val){
            return val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        }else{
            return 0
        }
    }

  return (
    <div>
        <div className='' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead vertical'>
        <thead>
            <tr className='fs-12 text-center'>
                <th>#</th>
                <th>Inv No</th>
                <th>Job No</th>
                <th>Date</th>
                <th>F. Dest</th>
                <th>Job Type</th>
                <th>Freight Type</th>
                <th>Container</th>
                <th>Weight</th>
                <th>Vol</th>
                {payType=="Recievable" &&<th>Recievable</th>}
                {payType!="Recievable" &&<th>Payble</th>}
                {payType=="Recievable" &&<th>Received</th>}
                {payType!="Recievable" &&<th>paid</th>}
                <th>Balance</th>
                <th>Age</th>
            </tr>
        </thead>
        <tbody>
        {records.map((x,index)=>{
        return (
            <tr key={index} className='f fs-12 text-center'>
                <td>{index + 1}</td>
                <td>{x.invoice_No}</td>
                <td>{x.SE_Job.jobNo}</td>
                <td>{moment(x.createdAt).format("MM/DD/YY")}</td>
                <td>{x.SE_Job.fd}</td>
                <td>{x.SE_Job.subType}</td>
                <td>{x.SE_Job.freightType=="Collect"?"CC":"PP"}</td>
                <td>
                    {x.SE_Job.SE_Equipments.map((y, j)=>{
                        return(
                            <div key={j}>
                                {y.qty}
                                    <span style={{position:'relative', bottom:1, fontSize:9}}> x </span>
                                {y.size}
                            </div>
                        )
                    })}
                </td>
                <td>{x.SE_Job.weight}</td>
                <td>{x.SE_Job.vol}</td>
                <td>{setCommas(x.total + x.roundOff)}</td>
                {payType=="Recievable" &&<td>{setCommas(x.recieved)}</td>}
                {payType!="Recievable" &&<td>{x.payType=="Payble"?setCommas(x.paid):""}</td>}
                <td>{x.balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}</td>
                <td>{getAge(x.createdAt)}</td>
            </tr>
        )})}
            <tr className='f fs-12 text-center'>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Total</td>
                <td>{setCommas(total.total)}</td>
                {payType=="Recievable" &&<td>{setCommas(total.recieved)}</td>}
                {payType!="Recievable" &&<td>{setCommas(total.paid)}</td>}
                <td>{setCommas(total.balance)}</td>
                <td></td>
            </tr>
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet