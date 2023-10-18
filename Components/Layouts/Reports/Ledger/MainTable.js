import React from "react";
import { Table } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router";

const Modal = ({ ledger, closing, opening }) => {

  const dispatch = useDispatch();
  const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")};

  return (
    <div>
      <div className="d-flex justify-content-between mt-4">
        <h5></h5>
        <b>Opening Balance : 
            {opening > 0 ? 
            opening.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr" :
            Math.abs(opening).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")+" Cr" 
          }
        </b>
      </div>
      <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "hidden" }}>
        <div className="table-sm-1 mt-2">
        <Table className="tableFixHead" bordered style={{ fontSize: 13 }}>
          <thead>
            <tr className="custom-width">
              <th className="text-center class-1">Voucher #</th>
              <th className="text-center class-1">Date</th>
              <th className="text-center class-2" style={{minWidth:300}}>Particular</th>
              <th className="text-center class-1" style={{width:100}}>Debit</th>
              <th className="text-center class-1" style={{width:100}}>Credit</th>
              <th className="text-center class-1" style={{width:120}}>Balance</th>
            </tr>
          </thead>
          <tbody>
          {ledger.map((x, i) => {
            return (
            <tr key={i}>
              <td className="row-hov blue-txt text-center"
                onClick={async()=>{
                  if(x.voucherType=='Job Reciept'||x.voucherType=='Job Payment'){
                    Router.push({pathname:`/accounts/paymentReceipt/${x.voucherId}`});
                    dispatch(incrementTab({
                      "label": "Payment / Receipt",
                      "key": "3-4",
                      "id":`${x.voucherId}`
                    }));
                  } else {
                    dispatch(incrementTab({"label":"Voucher","key":"3-5","id":`${x.voucherId}`}));
                    Router.push(`/accounts/vouchers/${x.voucherId}`);
                  }
                }}
              ><b>{x.voucher}</b></td>
              <td className="text-center">
                {x.date.slice(0, 10)}
              </td>
              <td className="fs-12" style={{maxWidth:100}}>{x.narration}</td>
              <td className="text-end">
                {x.type=="debit" && commas(x.amount)}
              </td>
              <td className="text-end">
                {x.type=="credit" && commas(x.amount)}
              </td>
              <td className="text-end">
                {x.balance>0?`${commas(x.balance)} dr`:`${commas(x.balance*-1)} cr`}
              </td>
            </tr>
          )})}
          </tbody>
        </Table>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <b>Closing Balance : 
          {closing > 0 ? 
            closing.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr" :
            Math.abs(closing).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")+" Cr" 
          }
        </b>
      </div>
    </div>
  );
};

export default Modal;
