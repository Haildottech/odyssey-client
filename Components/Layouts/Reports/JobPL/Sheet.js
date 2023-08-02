import React, { useEffect } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import moment from 'moment';

const Sheet = ({state}) => {

    const setCommas = (val) => {
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
                <th>Job No</th>
                <th>Date</th>
                <th>Client</th>
                <th>F. Dest</th>
                <th>Weight</th>
                <th>Containers</th>
                <th>Weight</th>
                <th>Volume</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Expected P/L</th>
                <th>Actual P/L</th>
                <th>Gain/Loss</th>
                <th>After Gain/Loss</th>
            </tr>
        </thead>
        <tbody>
        {state.records.map((x,index)=>{
        return (
        <tr key={index} className='f fs-12 text-center'>
            <td>{index + 1}</td>
            <td>{x.jobNo}</td>
            <td>{moment(x.createdAt).format("MM/DD/YY")}</td>
            <td>{x.Client.name}</td>
            <td>{x.fd}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{setCommas(x.revenue)}</td>
            <td>{setCommas(x.cost)}</td>
            <td>{setCommas(x.pnl)}</td>
            <td>{setCommas(x.actual)}</td>
            <td style={{color:x.gainLoss<0?'crimson':'green'}}>
                {setCommas(x.gainLoss<0?x.gainLoss*-1:x.gainLoss)}
            </td>
            {/* <td>{setCommas(x.actual + x.gainLoss)}</td> */}
            <td>{setCommas(x.after)}</td>
        </tr>
        )})}
        <tr className='f fs-12 text-center'>
            <td colSpan={8}></td>
            <td>Total: </td>
            <td>{setCommas(state.totalRevenue)}</td>
            <td>{setCommas(state.totalCost)}</td>
            <td>{setCommas(state.totalPnl)}</td>
            <td>{setCommas(state.totalActual)}</td>
            <td>{setCommas(state.totalgainLoss)}</td>
            <td>{setCommas(state.totalAfter)}</td>
        </tr>
        </tbody>
        </Table>
        </div>
    </div>
  )
}

export default Sheet