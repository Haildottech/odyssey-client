import React, { useEffect, useState } from 'react';
import { Row, Col, Table, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import { Select, Radio, Modal } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import moment from "moment";

const AccountActivity = () => {

    const [visible, setVisible] = useState(false);
    const [load, setLoad] = useState(false);
    const [pageLoad, setPageLoad] = useState(false);
    const [records, setRecords] = useState([]);
    const [voucherRecords, setVoucherRecords] = useState([]);
    const [accountId, setAccountId] = useState("");
    const [type, setType] = useState("");
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [company, setCompany] = useState(1);
    const [from, setFrom] = useState(`${new Date()}`);
    const [to, setTo] = useState(`${new Date()}`);

    const commas = (a) =>  { return parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}

    const getTotal = (type, list) => {
      let result = 0.00;
      list.forEach((x)=>{
        if(type==x.type){
          result = result + parseFloat(x.amount)
        }
      })
      return result;
    }

    useEffect(() => {
      getRecords();
    }, [company])

    const getRecords = async() => {
      setPageLoad(true);
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
        headers:{ companyid:company }
      }).then((x)=>{
        let temprecords = [];
        x.data.result.forEach((x)=>{
          temprecords.push({value:x.id, label:x.title});
        })
        setRecords(temprecords);
      })
      setPageLoad(false);
    }
    
    const handleSubmit = async() => {
      setLoad(true);
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_ACTIVITY,{
        headers:{
          debitAccount,
          creditAccount,
          from,
          to
        }
      }).then((x)=>{
        setVoucherRecords(x.data.result);
        setLoad(false);
        setVisible(true);
        console.log(x.data.result)
      })
    }

  return (
    <div className='base-page-layout'>
        <Row>
            <Col md={12} xs={12}><h4 className='fw-7'>Account Activity
            </h4></Col>
            <Col md={12}><hr/></Col>
            <Col md={3} className="mt-3">
                <div>From</div>
                <Form.Control type={"date"} size="sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
            </Col>
            <Col md={3} className="mt-3">
                <div>To</div>
                <Form.Control type={"date"} size="sm" value={to} onChange={(e)=>setTo(e.target.value)} />
            </Col>
            <Col md={6} className=""><div className='py-5'></div></Col>
            <Col md={4} className="mb-3">
              <div>Company</div>
              <Radio.Group className='mt-1' 
                value={company}
                onChange={(e)=>{
                    setCompany(e.target.value);
                }} 
              >
                <Radio value={1}>SEA NET SHIPPING & LOGISTICS</Radio>
                <Radio value={2}>CARGO LINKERS</Radio>
                <Radio value={3}>AIR CARGO SERVICES</Radio>
              </Radio.Group>
            </Col>
            <Col md={8}></Col>
            <Col md={4}>
              <div>Debit Account</div>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Debit Account"
                onChange={(e)=>setDebitAccount(e)}
                options={records}
                value={debitAccount}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
              />
            </Col>
            <Col md={1} className=""><br/> <CloseCircleOutlined className="cur" onClick={()=>setDebitAccount("")} /></Col>
            <Col md={7}></Col>
            <Col md={4} className="my-3">
              <div>Credit Account</div>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Credit Account"
                onChange={(e)=>setCreditAccount(e)}
                options={records}
                value={creditAccount}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
              />
            </Col>
            <Col md={1} className="my-3"><br/> <CloseCircleOutlined className="cur" onClick={()=>setCreditAccount("")} /></Col>
        </Row>
        <button className='btn-custom' disabled={load?true:false} onClick={handleSubmit}>
          {load? <Spinner size='sm' className='mx-3' />:"Search"}
        </button>
        <Modal 
            open={visible} 
            width={"60%"}
            onOk={()=>setVisible(false)} 
            onCancel={()=> { setVisible(false); setVoucherRecords([]); }}
            footer={false} maskClosable={false}
            title={`Vouchers`}
        >
          {voucherRecords.length>0 &&
            <div style={{maxHeight:660, overflowY:'auto', overflowX:'hidden'}}>
            {
              voucherRecords.map((z, i)=>{
                return(
                <div className='table-sm-1' key={i}>
                  <Row style={{fontSize:15}} className="mb-2">
                    <Col md={4}>
                      <span>Voucher No:</span> <span className='grey-txt'>{z.voucher_Id}</span>
                    </Col>
                    <Col md={2}>
                      <span>Currency:</span> <span className='grey-txt'>{z.currency}</span>
                    </Col>
                    <Col md={2} className="text-end">
                      <span>Ex Rate:</span> <span className='grey-txt'>{z.exRate}</span>
                    </Col>
                    <Col md={4} className="text-end px-4">
                      <span>Dated:</span> <span className='grey-txt'>{moment(z.createdAt).format("DD-MM-YYYY")}</span>
                    </Col>
                  </Row>
                  <Table className='tableFixHead' bordered style={{fontSize:14}}>
                    <thead>
                        <tr>
                            <th className='' style={{width:260}}>Particular</th>
                            <th className='text-center' style={{width:25}}>Debit</th>
                            <th className='text-center' style={{width:25}}>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                    {z.Voucher_Heads.length>0 && z.Voucher_Heads.map((x, index) => {
                    return (
                        <tr key={index}>
                            <td>{x.Child_Account?.title}</td>
                            <td className='text-end'>{x.type!="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.amount)}</>:''}</td>
                            <td className='text-end'>{x.type=="credit"?<><span className='gl-curr-rep'>Rs.{" "}</span>{commas(x.amount)}</>:''}</td>
                        </tr>
                        )
                    })}
                      <tr>
                          <td>Balance</td>
                          <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('debit', z.Voucher_Heads))}</td>
                          <td className='text-end'><span className='gl-curr-rep'>Rs.{" "}</span>{commas(getTotal('credit', z.Voucher_Heads))}</td>
                      </tr>
                    </tbody>
                  </Table>
                  {voucherRecords.length-1 > i && <hr/>}
                </div>
                )
              })
            }
            </div>
          }
        </Modal>
    </div>
  )
}

export default AccountActivity