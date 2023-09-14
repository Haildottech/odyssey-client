// import React, { useEffect, useReducer } from "react";
// import axios from "axios";
// import Ledger from "./Ledger";
// import moment from "moment";

// const initialState = {
//   childAccount: [],
//   mainAcc: "",
//   openingBalance: 0,
//   closing: 0,
//   records: [],
//   visible: false,
//   load: false,
//   account: "",
//   from: "",
//   to: moment().format("YYYY-MM-DD"),
//   company: 1,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "SET_DATA":
//       return {
//         ...state,
//         ...action.payload,
//       };

//     default:
//       return state;
//   }
// };

// const LedgerComp = () => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const { company, from, to, childAccount, visible, account, records, openingBalance, closing } = state;

//   let closingBalance = 0;
//   let balance = 0;
//   const req = async () => {
//     const res = await axios.get(
//       process.env.NEXT_PUBLIC_CLIMAX_GET_PARENT_ACCOUNTS,
//       {
//         headers: { id: company },
//       }
//     );
//     let temprecords = [];
//     res.data.result.map((x) => {
//       return temprecords.push({
//         value: x.id,
//         label: x.title,
//       });
//     });
//     dispatch({ type: "SET_DATA", payload: { records: temprecords } });
//   };

//   useEffect(() => {
//     req();
//   }, [company]);

//   const handleSubmit = () => {
//     dispatch({ type: "SET_DATA", payload: true });
//     const req = async () => {
//       await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER_BY_DATE, {
//         headers: { id: account, to: to },
//       }).then((x) => {
//         if (Array.isArray(x?.data?.result)) {
//           let arr = x?.data?.result.filter((y)=>y?.Voucher_Heads.length>0);
//           dispatch({type: "SET_DATA", payload: { childAccount: arr }});
//         }
//         dispatch({ type: "SET_DATA", payload: { visible: true } });
//       });
//       records.filter((x)=>
//         account === x.value && dispatch({ type:"SET_DATA", payload:{ mainAcc:x.label }})
//       );
//     };
//     req();
//     dispatch({ type: "SET_DATA", payload: { load: false } });
//   };

//   useEffect(() => {
//     if (childAccount.length > 0 && openingBalance == 0) {
//       childAccount.forEach((x) => {
//         x?.Voucher_Heads?.forEach((y) => {
//           if (
//             y.Voucher?.vType === "CPV" ||
//             y.Voucher?.vType === "BPV" ||
//             y.Voucher?.vType === "SI"
//           ) {
//             closingBalance += parseFloat(y?.amount);
//           } else {
//             closingBalance -= parseFloat(y?.amount);
//           }
//         });
//       });
//     }
//     else if (childAccount.length > 0 && openingBalance > 0 || openingBalance < 0) {
//       childAccount.forEach((x) => {
//         x?.Voucher_Heads?.forEach((y) => {
//           if (
//             y.Voucher?.vType === "CPV" ||
//             y.Voucher?.vType === "BPV" ||
//             y.Voucher?.vType === "SI"
//           ) {
//             closingBalance  = openingBalance + parseFloat(y.amount);
//           } else {
//             closingBalance  = openingBalance - parseFloat(y.amount);
//           }
//         });
//       });
//     }
 
//     childAccount.length > 0
//     ? dispatch({
//         type: "SET_DATA",
//         payload: { closing: closingBalance },
//       })
//     : dispatch({ type: "SET_DATA", payload: { closing: 0 } });
//   }, [childAccount]);

//   useEffect(() => {
//     if (!childAccount || !from) {
//       return;
//     }

//     const filteredData = childAccount.flatMap((x) => {
//       let result = {};
//       const voucherDate = x?.Voucher_Heads?.filter((y) => {
//         return moment(y.createdAt.slice(0, 10), "YYYY-MM-DD").isBetween(
//           moment(from, "YYYY-MM-DD"),
//           moment(to, "YYYY-MM-DD"),
//           null,
//           "[]"
//         );
//       });
//       result = { title: x.title, Voucher_Heads: voucherDate };
//       return result;
//     });

//     const data = filteredData?.filter((x) => x.Voucher_Heads.length > 0);
//     dispatch({ type: "SET_DATA", payload: { childAccount: data } });

//     const findOpening = childAccount.map((x) => {
//       const voucherDate = x?.Voucher_Heads?.filter((y) => {
//         return moment(y.createdAt.slice(0, 10), "YYYY-MM-DD").isBefore(
//           moment(from, "YYYY-MM-DD")
//         );
//       });

//       return voucherDate;
//     });
//     let balance = 0;
//     findOpening.forEach((x) => {
//       x.forEach((y) => {
//         y.Voucher.vType === "CPV" ||
//         y.Voucher.vType === "BPV" ||
//         y.Voucher.vType === "SI"
//         ? (balance += parseFloat(y.amount))
//         : (balance -= parseFloat(y.amount));
//       });
//     });
//     dispatch({ type: "SET_DATA", payload: { openingBalance: balance } });
//   }, [visible]);

//   const getDebitCredit = (y, type) => {
//     let result = "";
//     result =
//       y.Voucher?.vType == (type == "debit" ? "CPV" : "CRV")
//         ? Number(y?.amount)
//             .toFixed(2)
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
//         : y.Voucher?.vType == (type == "debit" ? "BPV" : "BRV")
//         ? Number(y?.amount)
//             .toFixed(2)
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
//         : y.Voucher?.vType == (type == "debit" ? "SI" : "PI")
//         ? Number(y?.amount)
//             .toFixed(2)
//             .toString()
//             .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
//         : "";
//     return result;
//   };

//   const getOpeningBalance = openingBalance >= 0? 
//   `${Math.abs(openingBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")} Dr`:
//   `${Math.abs(openingBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ")} Cr`;

//   const computedBalance = (y, type) => {
//     type === "CPV" ||
//     type === "BPV" ||
//     type === "SI" ? 
//       balance += parseFloat(y?.amount)
//     : balance -= parseFloat(y?.amount) 
  
//     return balance <0? 
//       Math.abs(balance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")+" Cr" :
//       balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")+" Dr"
//   }
//   return (
//     <>
//       <Ledger
//         state={state}
//         dispatch={dispatch}
//         handleSubmit={handleSubmit}
//         getDebitCredit={getDebitCredit}
//         balance={balance}
//         getOpeningBalance={getOpeningBalance}
//         computedBalance = {computedBalance}
//       />
//     </>
//   );
// };
// export default LedgerComp;







import React, { useState, useEffect } from 'react';
import {Row, Col, Spinner, Form} from "react-bootstrap";
import moment from "moment";
import { Radio, Modal, Select } from "antd";
import axios from 'axios';
import MainTable from './MainTable';

const Ledger = () => {

  const [ to, setTo ] = useState(moment().format("YYYY-MM-DD"));
  const [ from, setFrom ] = useState(moment().format("YYYY-MM-DD"));
  const [ company, setCompany ] = useState("");
  const [ label, setLabel ] = useState("");
  const [ account, setAccount ] = useState("");
  const [ records, setRecords ] = useState([]);
  const [ ledger, setLedger ] = useState([]);
  const [ visible, setVisible ] = useState(false);
  const [ opening, setOpening ] = useState(0.00);
  const [ closing, setClosing ] = useState(0.00);

  const getAccounts = async () => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS,{headers: { companyid: company }})
    .then((x)=>{
      let temprecords = [];
      x.data.result.map((x) => {
        return temprecords.push({value: x.id,label: x.title,});
      });
      setRecords(temprecords)
    })
  };

  useEffect(() => { if(company!="") getAccounts(); }, [company]);

  const handleSubmit = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER_BY_DATE, {
      headers: { id: account, to: to },
    }).then((x) => {
      
      if(x.data.status=="success"){
        let openingBalance = 0.00;
        let closingBalance = 0.00;
        let tempArray = [];
        x.data.result.forEach((y)=>{
          closingBalance = y.type=="debit"?closingBalance + parseFloat(y.amount):closingBalance - parseFloat(y.amount);
          if(moment(y.createdAt)<moment(from)){
            openingBalance = y.type=="debit"?openingBalance + parseFloat(y.amount):openingBalance - parseFloat(y.amount);
          } else {
            tempArray.push({
              amount:y.amount,
              balance:closingBalance,
              voucher:y['Voucher.voucher_Id'],
              date:y.createdAt,
              type:y.type
            })
          }
        })

        setOpening(openingBalance);
        setClosing(closingBalance);
        setLedger(tempArray);
        setVisible(true);
      }
    });
  };

  return (
  <div className='base-page-layout'>
    <Row>
      <Col md={12}><h4 className="fw-7"> Ledger</h4></Col>
      <Col md={12}><hr /></Col>
      <Col md={3} className="mt-3">
        <div>From</div>
        <Form.Control type={"date"} size="sm" value={from} onChange={(e) =>setFrom(e.target.value)} />
      </Col>
      <Col md={3} className="mt-3">
        <div>To</div>
        <Form.Control type={"date"} size="sm" value={to} onChange={(e) => setTo(e.target.value)} />
      </Col>
      <Col md={6}></Col>
      <Col md={3} className="my-3">
        <div>Company</div>
        <Radio.Group className="mt-1" value={company} onChange={(e) =>setCompany(e.target.value)}>
          <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
          <Radio value={2}>CARGO LINKERS</Radio>
          <Radio value={3}>AIR CARGO SERVICES</Radio>
        </Radio.Group>
      </Col>
      <Col md={7}></Col>
      <Col md={6}>
        <div> Accounts</div>
        <Select showSearch style={{ width: "100%" }} placeholder="Select Account" onChange={(e) =>setAccount(e) } options={records}
          filterOption={(input, option)=>(option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
          filterSort={(optionA, optionB)=>(optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
        />
      </Col>
      <Col md={12}>
        <button className='btn-custom mt-3' onClick={handleSubmit}>
          Go
        </button>
      </Col>
    </Row>
    <Modal
        open={visible}
        width={"70%"}
        onOk={()=> setVisible(false)}
        onCancel={()=> setVisible(false)}
        footer={false}
        maskClosable={false}
        title={`Vouchers`}
      >
        <h5 style={{lineHeight:0}}>{records.filter((x)=>x.value==account).map((x)=>{ 
          { return(<div>{x.label}</div>)}
         })}</h5>
        <MainTable ledger={ledger} closing={closing} opening={opening} />
      </Modal>
  </div>
)}

export default Ledger