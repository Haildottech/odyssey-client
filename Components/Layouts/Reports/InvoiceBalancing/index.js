import React, { useEffect, useState } from 'react';
import { Select, Input, Checkbox, Modal } from 'antd';
import { Row, Col, Spinner, Form, Table } from "react-bootstrap";
import { useQuery } from '@tanstack/react-query';
import { getJobValues } from '/apis/jobs';
import axios from 'axios';
import moment from 'moment';

const InvoiceBalaincing = () => {
    
    const [from, setFrom] = useState("2023-01-01");
    const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
    const [company,      setCompany] = useState("");
    const [overseasAgent, setOverseasAgent] = useState("");
    const [representator, setRepresentator] = useState("");
    const [currency,     setCurrency] = useState("");
    const [jobTypes,     setJobTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [load, setLoad] = useState(false);
    const [records, setRecords] = useState([]);

    const commas = (a) =>  {
        return a==0?'0.00':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
      }

    const [values, setValues] = useState();
    const { data, status } = useQuery({
        queryKey:['values'],
        queryFn:getJobValues
    });

    useEffect(() => {
        if(status=="success"){
            setValues(data.result);
        }
    }, [status]);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const plainOptions = [
        {
          label: 'Sea Export',
          value: 'SE',
        },
        {
          label: 'Sea Import',
          value: 'SI',
        },
        {
          label: 'Air Export',
          value: 'AE',
        },
        {
          label: 'Air Import',
          value: 'AI',
        },
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
            }
        }).then((x)=>{
            if(x.data.status=="success"){
                setIsModalOpen(x.data.result);
                setRecords(x.data.result);
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

    return(
    <div className='base-page-layout fs-12'>
    {status=="success" &&<Row>
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
            <Col md={7}>
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
            onChange={(e)=>{setOverseasAgent(e) }} 
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
    </Row>}
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
                    <th className='text-center' style={{width:260}}>Name</th>
                    <th className='text-center' style={{width:30}}>Final Dest</th>
                    <th className='text-center' style={{}}>F/Tp</th>
                    <th className='text-center' style={{}}>Curr</th>
                    <th className='text-center' style={{width:90}}>Debit</th>
                    <th className='text-center' style={{width:90}}>Credit</th>
                    <th className='text-center' style={{width:90}}>Paid/Received</th>
                    <th className='text-center' style={{width:90}}>Balance</th>
                    <th className='text-center' style={{width:10}}>Age</th>
                </tr>
            </thead>
            <tbody>
                {records.map((x, i)=>{
                    return(
                        <tr key={i}>
                            <td>{x.invoice_No}</td>
                            <td>{moment(x.createdAt).format("DD-MMM-YYYY")}</td>
                            <td>{x?.SE_Job?.Bl?.hbl}</td>
                            <td>{x.party_Name}</td>
                            <td>{x?.SE_Job?.fd}</td>
                            <td>{x?.SE_Job?.freightType=="Prepaid"?"PP":"CC"}</td>
                            <td>{x.currency}</td>
                            <td style={{textAlign:'right'}}>{x.payType=="Recievable"?commas(parseFloat(x.total)+parseFloat(x.roundOff)):"-"}</td>
                            <td style={{textAlign:'right'}}>{x.payType!="Recievable"?commas(parseFloat(x.total)+parseFloat(x.roundOff)):"-"}</td>
                            <td style={{textAlign:'right'}}>{x.payType=="Recievable"?commas(parseFloat(x.recieved)):commas(parseFloat(x.paid))}</td>
                            <td style={{textAlign:'right'}}>
                                {
                                    x.payType=="Recievable"?
                                        commas(parseFloat(x.total)+parseFloat(x.roundOff) - parseFloat(x.recieved)):
                                        commas(parseFloat(x.total)+parseFloat(x.roundOff) - parseFloat(x.paid))
                                }
                            </td>
                            <td>{getAge(x.createdAt)}</td>
                        </tr>
                    )
                })}
                <tr>
                    <td colSpan={7} style={{textAlign:'right'}}>Total</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
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