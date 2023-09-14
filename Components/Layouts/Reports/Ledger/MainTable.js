import React from "react";
import { Table } from "react-bootstrap";

const Modal = ({ ledger, closing, opening }) => {
    const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h5></h5>
        <b>Opening Balance : 
            {opening > 0 ? 
            opening.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr" :
            Math.abs(opening).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")+" Cr" 
          }
        </b>
      </div>
      <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "hidden" }}>
        <div className="table-sm-1">
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
                        <td>{x.voucher}</td>
                        <td className="text-center">
                            {x.date.slice(0, 10)}
                        </td>
                        <td className=""></td>
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
                    );
                })}
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
