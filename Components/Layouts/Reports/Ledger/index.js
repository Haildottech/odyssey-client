import React, { useState, useEffect } from 'react';
import {Row, Col, Spinner, Form} from "react-bootstrap";
import moment from "moment";
import { Radio, Modal, Select } from "antd";
import axios from 'axios';
import MainTable from './MainTable';

const Ledger = () => {
  
  const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
  const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
  const [ company, setCompany ] = useState("");
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
              voucherType:y['Voucher.type'],
              voucherId:y['Voucher.id'],
              type:y.type,
              narration:y.narration
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
        <button className='btn-custom mt-3' onClick={handleSubmit}> Go </button>
      </Col>
    </Row>
    <Modal open={visible} width={"70%"} title={`Vouchers`}
      onOk={()=> setVisible(false)}
      onCancel={()=> setVisible(false)}
      footer={false} maskClosable={false}
    >
      <h5 style={{lineHeight:0}}>{
        records.filter((x)=>x.value==account).map((x)=>{{ 
          return(<div>{x.label}</div>)
        }})}
      </h5>
      <MainTable ledger={ledger} closing={closing} opening={opening} />
    </Modal>
  </div>
)}

export default Ledger