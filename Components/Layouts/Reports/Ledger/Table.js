import React from "react";
import { Table } from "react-bootstrap";

const Modal = ({ getDebitCredit, state, getOpeningBalance, computedBalance }) => {

  const { childAccount, mainAcc, closing } = state;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h5>{mainAcc !== undefined && mainAcc}</h5>
        <b>Opening Balance : {getOpeningBalance}</b>
      </div>
      <div style={{ maxHeight: 760, overflowY: "auto", overflowX: "hidden" }}>
        <div className="table-sm-1">
          <Table className="tableFixHead" bordered style={{ fontSize: 14 }}>
            <thead>
              <tr className="custom-width">
                <th className="text-center class-1">Voucher #</th>
                <th className="text-center class-2">Particular</th>
                <th className="text-center class-1">Debit</th>
                <th className="text-center class-1">Credit</th>
                <th className="text-center class-1">Balance</th>
                <th className="text-center class-1">Date</th>
              </tr>
            </thead>
            {childAccount.length > 0 &&
            childAccount.map((x, i) => {
            return (
              <>
              <tbody>
                <tr><td colSpan={6}><b>{x.title}</b></td></tr>
                {x.Voucher_Heads.map((y, i) => {
                  return (
                    <tr key={i}>
                      <td>{y.Voucher?.voucher_Id}</td>
                      <td className="text-center"></td>
                      <td className="text-center">
                        {getDebitCredit(y, "debit")}
                      </td>
                      <td className="text-center">
                        {getDebitCredit(y, "credit")}
                      </td>
                      <td className="text-end">
                        {computedBalance(y, y.Voucher?.vType)}
                      </td>
                      <td className="text-center">
                        {y?.createdAt?.slice(0, 10)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </>
            )})}
          </Table>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <b>Closing Balance : 
          {closing > 0 ? 
              closing.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ") + " Dr" :
              Math.abs(closing).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
            + " Cr" 
          }
          </b>
      </div>
    </div>
  );
};

export default Modal;
