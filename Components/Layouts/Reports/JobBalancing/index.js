import React, { useState, useEffect } from 'react';
import { Input, Select, List, Radio, Modal, DatePicker } from 'antd';
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Sheet from './Sheet';
import moment from "moment";

const JobBalancing = () => {

    const [visible, setVisible] = useState(false);
    const [load, setLoad] = useState(true);
    const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));
    const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
    const [type, setType] = useState("client");
    const [payType, setPayType] = useState("Recievable");
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedParty, setSelectedParty] = useState([]);
    const [comapnies, setCompanies] = useState([]);
    const [partyOptions, setPartyOptions] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => { getCompanies() }, []);
    useEffect(() => { searchParties() }, [search]);

    const getCompanies = async() => {
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_COMPANIES)
        .then((x)=>{
          let tempState = [];
          x.data.result.forEach((x, index) => {
            tempState[index]={value:x.id, label:x.title}
          });
          setCompanies(tempState)
        });
    }
    const searchParties = async() => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type })
            .then((x)=> setPartyOptions(x.data.result) )
        }
    }
    const getJobBalancing = async(id) => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_JOB_BALANCING, { id, type, payType ,to, from })
            .then((x)=> {
                setSelectedParty(x.data.result);
                setVisible(true);
            })
        }
    }
    const ListComp = ({data}) => {
        return(
            <List size="small" bordered
                dataSource={data}
                renderItem={(item)=>
                    <List.Item key={item.id} 
                        className='searched-item' 
                        onClick={()=>getJobBalancing(item.id)}
                    >{item.name}
                    </List.Item>
                }
            />
        )
    }

  return (
    <div className='base-page-layout'>
        <h4 className='fw-7'>Search</h4>
        <hr/>
        <Row>
            <Col md={6}>
                <div>Company</div>
                <Select defaultValue="" style={{ width: 170 }} 
                    options={comapnies} 
                    onChange={(e)=>setSelectedCompany(e)} 
                />
            </Col>
            <Col md={6}>
                <div>Party</div>
                <Input style={{ width: 400 }}  disabled={selectedCompany==""?true:false} placeholder="Search" 
                    suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                />
                {search.length>2 &&
                    <div style={{position:"absolute", zIndex:10}}>
                        <ListComp data={partyOptions} />
                    </div>
                }
            </Col>
            <Col md={3} className="mt-3">
                <div>Party</div>
                <Radio.Group className='mt-1' 
                    value={type}
                    onChange={(e)=>{
                        setType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"vendor"}>Vendor</Radio>
                </Radio.Group>
            </Col>
            <Col md={12} className="mt-3">
                <div>Pay Type</div>
                <Radio.Group className='mt-1' 
                    value={payType}
                    onChange={(e)=>{
                        setPayType(e.target.value);
                    }} 
                >
                    <Radio value={"Recievable"}>Recievable</Radio>
                    <Radio value={"Payble"}>Payble</Radio>
                    <Radio value={"Both"}>Both</Radio>
                </Radio.Group>
            </Col>
            <Col md={2} className="mt-3">
                <div>From</div>
                <Form.Control type={"date"} size="sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
            </Col>
            <Col md={2} className="mt-3">
                <div>To</div>
                <Form.Control type={"date"} size="sm" value={to} onChange={(e)=>setTo(e.target.value)} />
            </Col>
        </Row>
        <Modal 
            title={"Job Balancing List"} 
            open={visible} 
            onOk={()=>setVisible(false)} 
            onCancel={()=>setVisible(false)} 
            footer={false} 
            maskClosable={false} 
            width={'100%'}
        >
            {selectedParty.length>0 && <Sheet data={selectedParty} payType={payType} />}
        </Modal>
    </div>
  )
}

export default JobBalancing





// import React, { useState, useEffect } from 'react';
// import { Input, Select, Checkbox, Radio, Modal } from 'antd';
// import { Row, Col, Form } from 'react-bootstrap';
// import axios from 'axios';
// import Sheet from './Sheet';
// import moment from "moment";
// import { useQuery } from '@tanstack/react-query';
// import { getJobValues } from '/apis/jobs';

// const JobBalancing = () => {

//     const { data, status } = useQuery({ queryKey:['values'], queryFn:getJobValues });
//     const [visible, setVisible] = useState(false);
//     const [load, setLoad] = useState(true);
//     const [selectedParty, setSelectedParty] = useState([]);
    
//     const [values, setValues] = useState({});
//     const [comapnies, setCompanies] = useState([]);
//     const [selectedCompany, setSelectedCompany] = useState("");
//     const [type, setType] = useState("client");
//     const [payType, setPayType] = useState("Recievable");
//     const [to, setTo] = useState(moment().format("YYYY-MM-DD"));
//     const [from, setFrom] = useState(moment("2023-07-01").format("YYYY-MM-DD"));

//     const [filters, setFilters] = useState({
//         client:'',
//         vendor:'',
//         salesRep:'',
//         agent:'',
//         clearingAgent:'',
//         shippingLine:'',
//         airline:'',
//         consignee:'',
//         forwarder:'',
//     })
//     const operations = [
//         { label: 'Sea Export', value: 'SE' },
//         { label: 'Sea Import', value: 'SI' },
//         { label: 'Air Export', value: 'AE' },
//         { label: 'Air Import', value: 'AI' }
//     ];
//     useEffect(() => { getCompanies() }, []);
//     useEffect(() => { 
//       if(status=="success") {
//         console.log(data.result);
//         setValues(data.result);
//       }
//     }, [status]);
    
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

//     const SearchComp = (props) => {
//     return(
//         <div className='mb-2'>
//           <div className='fs-13'>{props.label}</div>
//           <Select
//             value={filters[props.value]}
//             onChange={(e)=>{
//                 let tempFilters = {...filters};
//                 tempFilters[props.value] = e;
//                 setFilters(tempFilters)
//             }}
//             options={props.options} 
//             style={{width:"100%", fontSize:11}}
//             optionFilterProp="children"
//             showSearch
//             filterOption={(input, option) => ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase()) }
//             allowClear
//             size='small'
//           />
//         </div>
//     )}

//   return (
//     <div className='base-page-layout'>
//     <hr/>
//     <Row>
//     <Col md={5}>
//     <Row>
//     <Col md={12}>
//         <div>Company</div>
//         <Select defaultValue="" style={{ width: 170 }} 
//             options={comapnies} 
//             onChange={(e)=>setSelectedCompany(e)} 
//         />
//         </Col>
//         <Col md={12} className="mt-3">
//             <div>Pay Type</div>
//             <Radio.Group className='mt-1' 
//                 value={payType}
//                 onChange={(e)=>{
//                     setPayType(e.target.value);
//                 }} 
//             >
//                 <Radio value={"Recievable"}>Recievable</Radio>
//                 <Radio value={"Payble"}>Payble</Radio>
//                 <Radio value={"Both"}>Both</Radio>
//             </Radio.Group>
//         </Col>
//         <Col md={4} className="mt-3">
//             <div>From</div>
//             <Form.Control type={"date"} size="sm" value={from} onChange={(e)=>setFrom(e.target.value)} />
//         </Col>
//         <Col md={4} className="mt-3 mb-2">
//             <div>To</div>
//             <Form.Control type={"date"} size="sm" value={to} onChange={(e)=>setTo(e.target.value)} />
//         </Col>
//         <Col md={6} className='mb-2'>
//             <div>Job Types</div>
//             <Checkbox.Group options={operations} defaultValue={['SE']} style={{border:'1px solid silver'}} className='p-2'
//                 onChange={(e)=>setJobTypes(e)} 
//             />
//         </Col>
//     </Row>
//     </Col>
//     <Col md={6}>
//     <SearchComp label={"Client"} value={"client"} options={values?.party?.client?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     <SearchComp label={"Vendor"} value={"vendor"} options={values?.vendor?.localVendor?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     <SearchComp label={"Agent"} value={"agent"} options={values?.vendor?.overseasAgent?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     <SearchComp label={"Sales Representative"} value={"salesRep"} options={values?.sr?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     <SearchComp label={"Fowrarder/Coloader"} value={"forwarder"} options={values?.vendor?.forwarder?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     <SearchComp label={"Clearing Agent"} value={"clearingAgent"} options={values?.vendor?.chaChb?.map((x)=>{return{label:x.name,value:x.id}})}/>
//     </Col>
//     </Row>
//     <Modal title={"Job Balancing List"} 
//         open={visible} onOk={()=>setVisible(false)} onCancel={()=>setVisible(false)}
//         footer={false} maskClosable={false} width={'100%'}
//     >
//         {selectedParty.length>0 && <Sheet data={selectedParty} payType={payType} />}
//     </Modal>
//     </div>
//   )
// }

// export default JobBalancing