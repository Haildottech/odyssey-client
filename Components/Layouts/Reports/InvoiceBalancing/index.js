import { Row, Col, Spinner, Form, Table } from "react-bootstrap";
import { Select, Input, Checkbox, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobValues } from '/apis/jobs';
import moment from 'moment';
import axios from 'axios';

const InvoiceBalaincing = () => {
    
    const [ from, setFrom ] = useState("2023-01-01");
    const [ to, setTo ] = useState(moment().format("YYYY-MM-DD"));
    const [ company, setCompany ] = useState("");
    const [ overseasAgent, setOverseasAgent ] = useState("");
    const [ representator, setRepresentator ] = useState("");
    const [ currency, setCurrency ] = useState("");
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ load, setLoad ] = useState(false);
    const [ records, setRecords ] = useState([]);
    const [ values, setValues ] = useState();
    const [ payType, setPayType ] = useState("Payble");
    const { data, status } = useQuery({ queryKey:['values'], queryFn:getJobValues });
    const commas=(a) => a? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ") : '0.0';
    
    useEffect(() => { if(status=="success") setValues(data.result) }, [status]);
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const plainOptions = [
        { label: 'Sea Export', value: 'SE' },
        { label: 'Sea Import', value: 'SI' },
        { label: 'Air Export', value: 'AE' },
        { label: 'Air Import', value: 'AI' }
    ];
    const handleSearch = async() => {
        setLoad(true)
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_INVOICE_BALANCING,{
            headers:{
                "company":company,
                "overseasagent":overseasAgent,
                "representator":representator,
                "jobtypes":jobTypes,
                "currency":currency,
                "from":from,
                "to":to,
                "paytype":payType,
            }
        }).then(async(x)=>{
            if(x.data.status=="success"){
                
                await setIsModalOpen(true);
                await setRecords([...x.data.result]);
                let newArray = [...x.data.result];
                newArray.forEach((y)=>{
                    y.balance = y.payType=="Recievable"?
                        (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved))/ parseFloat(y.ex_rate):
                        (parseFloat(y.total)+parseFloat(y.roundOff) - parseFloat(y.paid)) / parseFloat(y.ex_rate);
                    y.total = (parseFloat(y.total) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                    y.paid = (parseFloat(y.paid) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                    y.recieved = (parseFloat(y.recieved) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                    y.age = getAge(y.createdAt)
                })
                console.log(newArray)
            }else{
                
            }
            setLoad(false)
        })
    }
    const getAge = (date) => {
        let date1 = new Date(date);
        let date2 = new Date();
        let difference = date2.getTime() - date1.getTime();
        return parseInt(difference/86400000)
    }

    const getTotal = (type, list) => {
        let result = 0.00;
        list.forEach((x)=>{
          if(type==x.payType){
            result = result + x.total
         }
        })
        return commas(result);
    }

    const paidReceivedTotal = (list) => {
        let paid = 0.00, Received = 0.00, total = 0.00;
        list.forEach((x)=>{
          if(x.payType=="Payble"){
            paid = paid + parseFloat(x.paid)
          } else {
            Received = Received + parseFloat(x.recieved)
        }
    })
        total = Received - paid
        return total>0?commas(total):`(${commas(total*-1)})`;
    }

    const balanceTotal = (list) => {
        let balance = 0.00;
        list.forEach((x)=>{
          if(x.payType=="Payble"){
            balance = balance - parseFloat(x.balance)
          } else {
            balance = balance + parseFloat(x.balance)
        }
    })
        return balance>0?commas(balance):`(${commas(balance*-1)})`;
    }

    return(
    <div className='base-page-layout fs-12'>
    {status=="success" &&
    <Row>
        <Col md={7} style={{border:'1px solid silver'}} className='mx-3 py-2'>
            Company
            <Select defaultValue="" size='small' style={{width:'100%', marginBottom:5}}
                allowClear
                onChange={(e)=>{setCompany(e) }} 
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            <Row>
                <Col md={3}>
                    Pay Type
                    <Select defaultValue="" style={{width:'100%', marginBottom:5}} size='small' 
                        onChange={(e)=>{setPayType(e) }} value={payType}
                        options={[
                            {value:"Recievable", label:"Recievable"},
                            {value:"Payble", label:"Payble"}
                        ]}
                    />
                </Col>
                <Col md={4}>
                    Job #
                    <Input style={{marginBottom:10}} size='small' />
                </Col>
                <Col>
                    File #
                    <Input style={{marginBottom:10}} size='small' />
                </Col>
            </Row>
            Overseas Agent
            <Select defaultValue="" style={{width:'100%', marginBottom:5}} size='small'
                onChange={(e)=>setOverseasAgent(e)}
                showSearch
                filterOption={filterOption}
                options={values?.vendor?.overseasAgent.map((x)=>{ return { value:x.id, label:x.name }})}
            />
            Client
            <Select defaultValue="" onChange={()=>{ }} style={{width:'100%', marginBottom:5}} size='small' disabled
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            Local Vendor
            <Select defaultValue="" onChange={()=>{ }} style={{width:'100%', marginBottom:5}} size='small' disabled
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            Forwarder/Coloader
            <Select defaultValue="" onChange={()=>{ }} style={{width:'100%', marginBottom:5}} size='small' disabled
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            Shipping Line
            <Select defaultValue="" onChange={()=>{ }} style={{width:'100%', marginBottom:5}} size='small' disabled
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            Air Line
            <Select defaultValue="" onChange={()=>{ }} style={{width:'100%', marginBottom:5}} size='small' disabled
                options={[
                    {value:1,label:"Sea Net Shipping & Logistics"},
                    {value:2,label:"Cargo Linkers"},
                    {value:3,label:"Air Cargo Services"},
                ]}
            />
            Sales Representor
            <Select defaultValue="" style={{width:'100%', marginBottom:5}} size='small' 
                onChange={(e)=>{setRepresentator(e) }} 
                showSearch
                filterOption={filterOption}
                options={values?.sr?.map((x)=>{ return { value:x.id, label:x.name }})}
            />
            <Row>
                <Col md={4}>
                    Currency
                    <Select defaultValue="" style={{width:'100%', marginBottom:5}} size='small' 
                        onChange={(e)=>{setCurrency(e) }} 
                        options={[
                            {value:"PKR", label:"PKR"},
                            {value:"USD", label:"USD"},
                            {value:"GBP", label:"GBP"},
                        ]}
                    />
                </Col>
                <Col md={4}>
                    Flight #
                    <Input style={{marginBottom:10}} size='small' />
                </Col>
                <Col md={4}>
                    Voyage #
                    <Input style={{marginBottom:10}} size='small' />
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col md={3} style={{border:'1px solid silver', marginLeft:12}} className='py-1'>
                    Job Types
                    <Checkbox.Group options={plainOptions} defaultValue={['Apple']} 
                        onChange={(e)=>setJobTypes(e)} 
                    />
                </Col>
                <Col md={6}></Col>
                <Col md={2}>
                    <button className='btn-custom' onClick={()=>handleSearch()}
                        disabled={load?true:false}
                    >
                        {load?<Spinner size='sm' className='mx-2' />:"Go"}
                    </button>
                </Col>
            </Row>
            
        </Col>
        <Col style={{border:'1px solid silver'}} className='py-2' md={3}>
            From
            <Form.Control type="date" size='sm' value={from} onChange={(e)=>setFrom(e.target.value)} className='mb-2' />
            To
            <Form.Control type="date" size='sm' value={to} onChange={(e)=>setTo(e.target.value)} />
        </Col>
    </Row>
    }
    <Modal title="Invoice Balancing Report"
        width={"100%"}
        open={isModalOpen} 
        onOk={()=>setIsModalOpen(false)} 
        onCancel={()=>setIsModalOpen(false)}
        footer={false}
    >
        {records.length>0 &&<>
        <div className='table-sm-1' style={{maxHeight:600, overflowY:'auto'}}>
        <Table className='tableFixHead' bordered style={{fontSize:12}}>
            <thead>
                <tr>
                    <th className='text-center' style={{}}>Invoice No</th>
                    <th className='text-center' style={{}}>Date</th>
                    <th className='text-center' style={{}}>HBL/HAWB</th>
                    <th className='text-center' style={{width:250}}>Name</th>
                    <th className='text-center' style={{width:30}}>F. Dest</th>
                    <th className='text-center' style={{width:10}}>F/Tp</th>
                    <th className='text-center' style={{width:10}}>Curr</th>
                    <th className='text-center' style={{width:110}}>Debit</th>
                    <th className='text-center' style={{width:110}}>Credit</th>
                    <th className='text-center' style={{width:110}}>Paid/Received</th>
                    <th className='text-center' style={{width:110}}>Balance</th>
                    <th className='text-center' style={{width:10}}>Age</th>
                </tr>
            </thead>
            <tbody>
                {records.map((x, i) => {
                    return(
                    <tr key={i}>
                        <td style={{lineHeight:1.1}}>{x.invoice_No}</td>
                        <td style={{lineHeight:1.1}}>{moment(x.createdAt).format("DD-MMM-YYYY")}</td>
                        <td style={{lineHeight:1.1}}>{x?.SE_Job?.Bl?.hbl}</td>
                        <td style={{lineHeight:1.1}}>{x.party_Name}</td>
                        <td style={{lineHeight:1.1}}>{x?.SE_Job?.fd}</td>
                        <td style={{textAlign:'center',lineHeight:1.1}}>{x?.SE_Job?.freightType=="Prepaid"?"PP":"CC"}</td>
                        <td style={{textAlign:'center',lineHeight:1.1}}>{x.currency}</td>
                        <td style={{textAlign:'right',lineHeight:1.1}} >{x.payType=="Recievable"?commas(x.total):"-"}</td>
                        <td style={{textAlign:'right',lineHeight:1.1}} >{x.payType!="Recievable"?commas(x.total):"-"}</td>
                        <td style={{textAlign:'right',lineHeight:1.1}} >{commas(x.payType=="Recievable"?x.recieved:x.paid)}</td>
                        <td style={{textAlign:'right',lineHeight:1.1}} >{x.payType!="Recievable"?`(${commas(x.balance)})`:commas(x.balance)}</td>
                        <td style={{textAlign:'center',lineHeight:1.1}}>{x.age}</td>
                    </tr>
                )})}
                <tr>
                    <td colSpan={7} style={{textAlign:'right'}}><b>Total</b></td>
                    <td style={{textAlign:'right'}}>{getTotal("Recievable", records)}</td>
                    <td style={{textAlign:'right'}}>{getTotal("Payble", records)}</td>
                    <td style={{textAlign:'right'}}>{paidReceivedTotal(records)}</td>
                    <td style={{textAlign:'right'}}>{balanceTotal(records)}</td>
                    <td style={{textAlign:'center'}}>-</td>
                </tr>
            </tbody>
        </Table>
        </div>
        </>}
        {records.length==0 && <>No Similar Record</>}
    </Modal>
    {status!="success" && <div className='text-center'><Spinner/></div>}
    </div>
    );
}
export default InvoiceBalaincing;