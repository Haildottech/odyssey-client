import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Input, List, Radio, Modal, Select } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from 'axios';
import BillComp from './BillComp';
import AgentBillComp from './AgentBillComp';
import { useSelector } from 'react-redux';

const PaymentsReceipt = () => {

    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");
    const [partytype, setPartyType] = useState("client");
    const [payType, setPayType] = useState("Recievable");
    const [invoiceCurrency, setInvoiceCurrency] = useState("USD");
    const [partyOptions, setPartyOptions] = useState([]);
    const [selectedParty, setSelectedParty] = useState({id:'', name:''});
    const companyId = useSelector((state) => state.company.value);

    useEffect(() => { searchParties() }, [search]);

    const searchParties = async() => {
        if(search.length>2){
            await axios.post(process.env.NEXT_PUBLIC_CLIMAX_MISC_GET_PARTIES_BY_SEARCH, { search, type:partytype })
            .then((x)=> {
                if(x.data.status=="success"){
                    setPartyOptions(x.data.result)
                }else{
                    setPartyOptions([])
                }
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
                        onClick={()=>{
                            setSelectedParty({id:"", name:""});
                            setSelectedParty({id:item.id, name:item.name});
                            setVisible(true);
                        }}
                    >
                        {item.name}
                    </List.Item>
                }
            />
        )
    }

    const basestyle = {borderBottom:'1px solid silver', paddingBottom:5, marginBottom:10}

  return (
    <div className='base-page-layout'>
        <Row>
            <Col md={12} xs={12}><h4 className='fw-7'>Payments / Receipts</h4></Col>
            <Col style={{maxWidth:100}}>
                <div style={basestyle}>Type</div>
                <Radio.Group className='mt-1' 
                    value={partytype}
                    onChange={(e)=>{
                        setPartyType(e.target.value);
                        if(e.target.value=="vendor"){
                            setPayType("Payble");
                        }else if(e.target.value=="client"){
                            setPayType("Recievable");
                        }else if(e.target.value=="agent"){
                            setPayType("Payble");
                        }
                        setSearch("");
                    }} 
                >
                    <Radio value={"client"}>Client</Radio>
                    <Radio value={"vendor"}>Vendor</Radio>
                    <Radio value={"agent"}>Agent</Radio>
                </Radio.Group>
            </Col>
            <Col style={{maxWidth:30}}></Col>
            <Col style={{maxWidth:250}}>
                <div style={basestyle}>Payment</div>
                <Radio.Group className='mt-1' 
                    value={payType}
                    onChange={(e)=>{
                        setPayType(e.target.value);
                        setSearch("");
                    }} 
                >
                    <Radio value={"Payble"}>Payble</Radio>
                    <Radio value={"Recievable"}>Recievable</Radio>
                </Radio.Group>
                <div className='mt-3' style={basestyle}>Currency</div>
                <Select size='small'
                    disabled={partytype!="agent"?true:false}
                    defaultValue={invoiceCurrency}
                    onChange={(e)=> setInvoiceCurrency(e)}
                    style={{
                        width:'100%',
                    }}
                    options={[
                        { value:'USD', label:'USD' },
                        { value:'PKR', label:'PKR' },
                        { value:'GBP', label:'GBP' },
                        { value:'EUR', label:'EUR' },
                        { value:'Multi', label:'Multi' },
                    ]}
                />
            </Col>
            <Col style={{maxWidth:30}}></Col>
            <Col style={{maxWidth:400}}>
                <div style={basestyle}>Search</div>
                <Input style={{ width: 400 }} placeholder="Search" 
                    suffix={search.length>2?<CloseCircleOutlined onClick={()=>setSearch("")} />:<SearchOutlined/>} 
                    value={search} onChange={(e)=>setSearch(e.target.value)}
                />
                {search.length>2 &&
                    <div style={{position:"absolute", zIndex:10}}>
                        <ListComp data={partyOptions} />
                    </div>
                }
            </Col>
            <Col md={12}><hr/></Col>
        </Row>
        <Modal 
            open={visible} 
            width={'100%'}
            onOk={()=>setVisible(false)} 
            onCancel={()=>{ setVisible(false); setSelectedParty({id:'', name:''}); }}
            footer={false} maskClosable={false}
            title={`${selectedParty.name}'s Invoices/Bills`}
        >
            {(selectedParty.id!=''&& partytype!="agent") && <BillComp      selectedParty={selectedParty} payType={payType} partytype={partytype} companyId={companyId} invoiceCurrency={invoiceCurrency} />}
            {(selectedParty.id!=''&& partytype=="agent") && <AgentBillComp selectedParty={selectedParty} payType={payType} partytype={partytype} companyId={companyId} invoiceCurrency={invoiceCurrency} />}
        </Modal>
    </div>
  )
}

export default PaymentsReceipt