// import React, { useState, useEffect } from 'react';
// import { Input, Select, List, Radio, Modal, DatePicker } from 'antd';
// import { Row, Col, Form } from 'react-bootstrap';
// import axios from 'axios';
// import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import Sheet from './Sheet';
// import moment from "moment";

// const JobBalancing = () => {

//     const [visible, setVisible] = useState(false);
//     const [load, setLoad] = useState(true);
//     const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
//     const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
//     const [type, setType] = useState("client");
//     const [payType, setPayType] = useState("Recievable");
//     const [selectedCompany, setSelectedCompany] = useState("");
//     const [selectedParty, setSelectedParty] = useState([]);
//     const [comapnies, setCompanies] = useState([]);
//     const [partyOptions, setPartyOptions] = useState([]);
//     const [search, setSearch] = useState("");

//     useEffect(() => { getCompanies() }, []);
//     useEffect(() => { searchParties() }, [search]);

//     const getCompanies = async() => {
//         await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
//         .then((x)=>{
//           let tempState = [];
//           x.data.result.forEach((x, index) => {
//             tempState[index]={value:x.id, label:x.title}
//           });
//           setCompanies(tempState)
//         });
//     }
//     const searchParties = async() => {
//         if(search.length>2){
//             await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type })
//             .then((x)=> setPartyOptions(x.data.result) )
//         }
//     }
//     const getJobBalancing = async(id) => {
//         if(search.length>2){
//             await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_JOB_BALANCING, { id, type, payType ,to, from })
//             .then((x)=> {
//                 setSelectedParty(x.data.result);
//                 setVisible(true);
//             })
//         }
//     }
//     const ListComp = ({data}) => {
//         return(
//             <List size="small" bordered
//                 dataSource={data}
//                 renderItem={(item)=>
//                     <List.Item key={item.id} 
//                         className='searched-item' 
//                         onClick={()=>getJobBalancing(item.id)}
//                     >{item.name}
//                     </List.Item>
//                 }
//             />
//         )
//     }

//   return (
//     <div className='base-page-layout'>
//         <h4 className='fw-7'>Search</h4>
//         <hr/>
//         <Row>
//             <Col md={6}>
//                 <div>Company</div>
//                 <Select defaultValue="" style={{ width: 170 }} 
//                     options={comapnies} 
//                     onChange={(e)=>setSelectedCompany(e)} 
//                 />
//             </Col>
//             <Col md={6}>
//                 <div>Party</div>
//                 <Input style={{ width: 400 }}  disabled={selectedCompany==""?true:false} placeholder="Search" 
//                     suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
//                     value={search} onChange={(e)=>setSearch(e.target.value)}
//                 />
//                 {search.length>2 &&
//                     <div style={{position:"absolute", zIndex:10}}>
//                         <ListComp data={partyOptions} />
//                     </div>
//                 }
//             </Col>
//             <Col md={3} className="mt-3">
//                 <div>Party</div>
//                 <Radio.Group className='mt-1' value={type}
//                     onChange={(e)=>{
//                         setType(e.target.value);
//                         setSearch("");
//                     }} 
//                 >
//                     <Radio value={"client"}>Client</Radio>
//                     <Radio value={"vendor"}>Vendor</Radio>
//                 </Radio.Group>
//             </Col>
//             <Col md={12} className="mt-3">
//                 <div>Pay Type</div>
//                 <Radio.Group className='mt-1' value={payType}
//                     onChange={(e)=>setPayType(e.target.value)} 
//                 >
//                     <Radio value={"Recievable"}>Recievable</Radio>
//                     <Radio value={"Payble"}>Payble</Radio>
//                     <Radio value={"Both"}>Both</Radio>
//                 </Radio.Group>
//             </Col>
//             <Col md={2} className="mt-3">
//                 <div>From</div>
//                 <Form.Control type={"date"} size="sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
//             </Col>
//             <Col md={2} className="mt-3">
//                 <div>To</div>
//                 <Form.Control type={"date"} size="sm" value={to} onChange={(e)=>setTo(e.target.value)} />
//             </Col>
//         </Row>
//         <Modal title={"Job Balancing List"} open={visible} 
//             onOk={()=>setVisible(false)} onCancel={()=>setVisible(false)} 
//             footer={false} maskClosable={false} width={'100%'}
//         >
//             {selectedParty.length>0 && <Sheet data={selectedParty} payType={payType} />}
//         </Modal>
//     </div>
//   )
// }

// export default JobBalancing









import { Row, Col, Form } from "react-bootstrap";
import { Select, Input, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJobValues } from '/apis/jobs';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import Router from "next/router";
import moment from 'moment';

const JobBalancing = () => {

    const dispatch = useDispatch();

    const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
    const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
    const [ company, setCompany ] = useState(1);
    const [ party, setParty ] = useState("");
    const [ vendor, setVendor ] = useState("");
    const [ overseasAgent, setOverseasAgent ] = useState("");

    const [ representator, setRepresentator ] = useState("");
    const [ currency, setCurrency ] = useState("");
    const [ jobTypes, setJobTypes ] = useState([]);
    const [ values, setValues ] = useState({});
    const [ payType, setPayType ] = useState("Payble");
    const { data, status } = useQuery({ queryKey:['values'], queryFn:getJobValues });
    
    useEffect(() => {
      if(status=="success"){
        setValues(data.result)
      }
    }, [status]);

    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const plainOptions = [
        { label: 'Sea Export', value: 'SE' },
        { label: 'Sea Import', value: 'SI' },
        { label: 'Air Export', value: 'AE' },
        { label: 'Air Import', value: 'AI' }
    ];
    const handleSearch = async() => {
        Router.push({
            pathname:`/reports/jobBalancing/report`, 
            query:{ 
                "company":company,
                "overseasagent":overseasAgent,
                "representator":representator,
                "jobtypes":jobTypes,
                "currency":currency,
                "from":from,
                "to":to,
                "paytype":payType,
                "party":party,
             }
        });
        dispatch(incrementTab({
          "label": "Job Balancing Report",
          "key": "5-1-1",
          "id":`report?company=${company}&overseasagent=${overseasAgent}&representator=${representator}&currency=${currency}&jobtypes=${jobTypes}&to=${to}&from=${from}&paytype=${payType}`
        }))
    }

    return(
    <div className='base-page-layout fs-12'>
    {(status=="success" && Object.keys(values).length>0) &&
    <Row>
        <Col md={7} style={{border:'1px solid silver'}} className='mx-3 py-2'>
            Company
            <Select size='small' style={{width:'100%', marginBottom:5}}
                allowClear
                value={company}
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
                            {value:"Payble", label:"Payble"},
                            {value:"All", label:"All"},
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
            Party Specific
            <Select defaultValue="" onChange={(e)=>setParty(e)} style={{width:'100%', marginBottom:5}} size='small'
                showSearch
                allowClear
                filterOption={filterOption}
                options={[
                    ...values?.party?.client?.map((x)=>{ return { value:x.id, label:x.name }}),
                    ...values?.vendor?.localVendor?.map((x)=>{ return { value:x.id, label:x.name }}),

                    ...values?.vendor?.airLine?.map((x)=>{ return { value:x.id, label:x.name }}),
                    ...values?.vendor?.chaChb?.map((x)=>{ return { value:x.id, label:x.name }}),
                    ...values?.vendor?.forwarder?.map((x)=>{ return { value:x.id, label:x.name }}),
                    ...values?.vendor?.sLine?.map((x)=>{ return { value:x.id, label:x.name }}),
                    ...values?.vendor?.transporter?.map((x)=>{ return { value:x.id, label:x.name }}),
                ]}
            />
            Overseas Agent
            <Select defaultValue="" style={{width:'100%', marginBottom:5}} size='small' disabled
                onChange={(e)=>setOverseasAgent(e)}
                showSearch
                allowClear
                filterOption={filterOption}
                options={values?.vendor?.overseasAgent.map((x)=>{ return { value:x.id, label:x.name }})}
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
                    <Checkbox.Group options={plainOptions} defaultValue={['SE']} onChange={(e)=>setJobTypes(e)} />
                </Col>
                <Col md={6}></Col>
                <Col md={2}><button className='btn-custom' onClick={()=>handleSearch()}>Go</button></Col>
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
    </div>
    );
}
export default JobBalancing;