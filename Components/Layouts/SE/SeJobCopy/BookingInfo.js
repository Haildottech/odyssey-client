import React, { useEffect, useState } from 'react'
import { Popover, InputNumber, Tag, Checkbox, Modal } from "antd";
import SelectComp from '/Components/Shared/Form/SelectComp';
import SelectSearchComp from '/Components/Shared/Form/SelectSearchComp';
import DateComp from '/Components/Shared/Form/DateComp';
import TimeComp from '/Components/Shared/Form/TimeComp';
import CheckGroupComp from '/Components/Shared/Form/CheckGroupComp';
import { Row, Col } from 'react-bootstrap';
import Dates from './Dates';
import InputNumComp from '/Components/Shared/Form/InputNumComp';
import Notes from "./Notes";
import ports from "/jsonData/ports";
import moment from 'moment';
import CustomBoxSelect from '/Components/Shared/Form/CustomBoxSelect';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import InputComp from '/Components/Shared/Form/InputComp';
import {createNotification} from '../../../../functions/notifications'
import Cookies from 'js-cookie';

const BookingInfo = ({handleSubmit, onEdit, companyId, register, control, errors, state, useWatch, dispatch, reset, id}) => {

  const dispatchNew = useDispatch();
  const transportCheck = useWatch({control, name:"transportCheck"});
  const transporterId = useWatch({control, name:"transporterId"});
  const customCheck = useWatch({control, name:"customCheck"});
  const customAgentId = useWatch({control, name:"customAgentId"});
  const vesselId = useWatch({control, name:"vesselId"});
  const VoyageId = useWatch({control, name:"VoyageId"});
  const ClientId = useWatch({control, name:"ClientId"});
  const shipperId = useWatch({control, name:"shipperId"});
  const consigneeId = useWatch({control, name:"consigneeId"});
  const overseasAgentId = useWatch({control, name:"overseasAgentId"});
  const forwarderId = useWatch({control, name:"forwarderId"});
  const shippingLineId = useWatch({control, name:"shippingLineId"});
  const localVendorId = useWatch({control, name:"localVendorId"});
  const approved = useWatch({control, name:"approved"});
  let allValues = useWatch({control})



   
  const handleOk = () => {
    allValues.approved = approved
    handleSubmit(onEdit(allValues))
    dispatch({type:"set",payload:{
      isModalOpen : false,
    }})
  };

  const handleCancel = () => {
    dispatch({type:"set",payload:{
      isModalOpen : false,
    }})
  };
 
  const filterVessels = (list) => {
    let result = [];
    list.forEach((x)=>{
      result.push({id:x.id, name:x.name+" ~ "+x.code, code:x.code})
    })
    return result
  }
  const getStatus = (val) => {
    return val[0]=="1"?true:false
  };

  function getWeight(){
    let weight = 0.0, teu = 0, qty = 0;
    state.equipments.forEach((x) => {
      if(x.gross!=''&&x.teu!=''){
        weight = weight + parseFloat(x.gross.replace(/,/g, ''));
        teu = teu + parseInt(x.teu);
        qty = qty + parseInt(x.qty);
      }
    });
    return {weight, teu, qty}
  }

  function getVoyageNumber (id) {
    let result = '';
    if(state.voyageList[0]!==null){
      state.voyageList.forEach((x)=>{
        if(x.id==id){
          result = x.voyage
        }
      })
    }
    return result
  }
  const Space = () => <div className='mt-2'/>

  const pageLinking = (type, value) => {
    let route= "";
    let obj = {}
    if(type=="client"){
      route=`/setup/client/${(value!="" && value!==null)?value:"new"}`
      obj={"label":"Client", "key":"2-7", "id":(value!="" && value!==null)?value:"new"}

    }else if(type=="vendor"){
      route=`/setup/vendor/${(value!="" && value!==null)?value:"new"}`
      obj={"label":"Vendor", "key":"2-8", "id":(value!="" && value!==null)?value:"new"}
      
    }else if(type="vessel"){
      route=`/setup/voyage/`
      obj={"label":"Voyages", "key":"2-4"}
    }
    //dispatchNew(incrementTab({ "label":label, "key":key, "id":(value!="" && value!==null)?value:"new" }));
    dispatchNew(incrementTab(obj));
    Router.push(route);
  }


  
  return (
  <>
    <Row>
      <Col md={2} className=''>
        <div className="mt-1">Job No.</div>
        <div className="dummy-input">
          {state.edit?(state.selectedRecord.jobNo):<span style={{color:'white'}}>.</span>}
        </div>
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='jobType' control={control} label='Job Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Direct', name:'Direct'},
            {id:'Coloaded', name:'Coloaded'},
            {id:'Cross Trade', name:'Cross Trade'},
            {id:'Liner Agency', name:'Liner Agency'},
        ]}/>
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='jobKind' control={control} label='Job Kind' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Current', name:'Current'},
            {id:'Opening', name:'Opening'},
          ]}/>
      </Col>
      <Col md={2} className='py-1'>     
        <DateComp register={register} name='jobDate' control={control} label='Job Date' width={"100%"} disabled={getStatus(approved)} />
        {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
      <Col md={2} className='py-1'>     
          <DateComp register={register} name='shipDate' control={control} label='Ship Date' disabled={getStatus(approved)} width={"100%"} />
          {errors.registerDate && <div className='error-line'>Required*</div>}
      </Col>
      
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='costCenter' control={control} label='Cost Center' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'FSD', name:'FSD'},
            {id:'KHI', name:'KHI'}
          ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='shipStatus' control={control} label='Ship Status:' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Hold', name:'Hold'},
            {id:'Booked', name:'Booked'},
            {id:'Delivered', name:'Delivered'},
            {id:'Shipped', name:'Shipped'},
            {id:'Closed', name:'Closed'}
          ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='subType' control={control} disabled={getStatus(approved) || state.selectedRecord.id!=null} 
        label='Sub Type' width={"100%"}
          options={[  
            {id:'FCL', name:'FCL'},
            {id:'LCL', name:'LCL'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='dg' control={control} label='DG Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'DG', name:'DG'},
            {id:'non-DG', name:'non-DG'},
            {id:'Mix', name:'Mix'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='freightType' control={control} label='Freight Type' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Prepaid', name:'Prepaid'},
            {id:'Collect', name:'Collect'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='nomination' control={control} label='Nomination' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'Free Hand', name:'Free Hand'},
            {id:'Nominated', name:'Nominated'},
            {id:'B2B', name:'B2B'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <SelectComp register={register} name='incoTerms' control={control} label='Inco Terms' width={"100%"} disabled={getStatus(approved)}
          options={[  
            {id:'EXW', name:'EXW'},
            {id:'FCP', name:'FCP'},
            {id:'FAS', name:'FAS'},
            {id:'FOB', name:'FOB'},
            {id:'CFR', name:'CFR'},
            {id:'CIF', name:'CIF'},
            {id:'CIP', name:'CIP'},
            {id:'CPT', name:'CPT'},
            {id:'DAP', name:'DAP'},
            {id:'DPU', name:'DPU'},
            {id:'DDP', name:'DDP'},
            {id:'CNI', name:'CNI'},
            {id:'DTP', name:'DTP'},
            {id:'DPP', name:'DPP'},
            {id:'DAT', name:'DAT'},
            {id:'DDU', name:'DDU'},
            {id:'DES', name:'DES'},
            {id:'DEQ', name:'DEQ'},
            {id:'DAF', name:'DAF'},
            {id:'CNF', name:'CNF'},
        ]} />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='customerRef' control={control} label='Customer Ref#' width={"100%"} disabled={getStatus(approved)} />
      </Col>
      <Col md={2} className='py-1'>
        <InputComp register={register} name='fileNo' control={control} label='File #' width={"100%"} disabled={getStatus(approved)} />
      </Col>
    </Row>
    <hr className='my-1' />
    <Row>
      <Col md={3} className=''>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", ClientId)} >Client *</div>
        <SelectSearchComp register={register} name='ClientId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.client} />
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", shipperId)} >Shipper *</div>
        <SelectSearchComp register={register} name='shipperId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.shipper} /><Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("client", consigneeId)} >Consignee *</div>
        <SelectSearchComp register={register} name='consigneeId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.party.consignee} /><Space/>
        <SelectSearchComp register={register} name='pol' control={control} label='Port Of Loading' disabled={getStatus(approved)} width={"100%"}
          options={ports.ports} /><Space/>
        <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge *' disabled={getStatus(approved)} width={"100%"}
          options={ports.ports} /><Space/>
        <SelectSearchComp register={register} name='fd' control={control} label='Final Destination *' disabled={getStatus(approved)} width={"100%"}
          options={ports.ports} /><Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", forwarderId)} >Forwarder/Coloader *</div>
        <SelectSearchComp register={register} name='forwarderId' control={control} label='' disabled={getStatus(approved)} width={"100%"}
          options={state.fields.vendor.forwarder} /><Space/>
        <SelectSearchComp register={register} name='salesRepresentatorId' control={control} label='Sales Representator' disabled={getStatus(approved)}
          options={state.fields.sr} width={"100%"} />
      </Col>
      <Col md={3}><Space/>
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", overseasAgentId)} >Overseas Agent *</div>
        <SelectSearchComp register={register} name='overseasAgentId' control={control} label='' disabled={getStatus(approved)}options={state.fields.vendor.overseasAgent} width={"100%"} />
        
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", localVendorId)} >Local Vendor *</div>
        <SelectSearchComp register={register} name='localVendorId' control={control} label='' 
          disabled={getStatus(approved)}options={state.fields.vendor.localVendor} width={"100%"} 
        />
        <div className='custom-link mt-2' onClick={()=>pageLinking("vendor", shippingLineId)} >Sline/Carrier</div>
        <SelectSearchComp register={register} name='shippingLineId' control={control} label='' disabled={getStatus(approved)}options={state.fields.vendor.sLine} width={"100%"} />
        <div className='px-2 pb-2 mt-3' style={{border:'1px solid silver'}}>
        
        <div className='custom-link mt-2' onClick={()=>pageLinking("vessel")} >Vessel *</div>
        <SelectSearchComp register={register} name='vesselId' control={control} label=''disabled={getStatus(approved)} width={"100%"}
          options={filterVessels(state.fields.vessel)} 
        />
          <div className='mt-2'>Voyage *</div>
          <div className="dummy-input"
           onClick={()=>{
            if(vesselId!=''){
              dispatch({type:'voyageSelection', payload:vesselId})
            }
          }}
          >{getVoyageNumber(VoyageId)}</div>
        <div className='my-2'></div>
        <DateComp register={register} name='eta' control={control} label='ETA' disabled={getStatus(approved)} />
        <div className='my-2'></div>
        <DateComp register={register} name='cutOffDate' control={control} label='Cut Off'  disabled={getStatus(approved)} />
        <div className='mt-1'></div>
        <TimeComp register={register} name='cutOffTime' control={control} label=''  width={100} disabled={getStatus(approved)} />
        <Popover content={
            <div className='p-2 m-0' style={{border:'1px solid silver'}}>
              <Dates register={register} control={control} disabled={getStatus(approved)} />
            </div>
          } trigger="click">
          <span className='ex-btn py-1 px-3'>Dates</span>
        </Popover>
        </div> 
      </Col>
      <Col md={3}><Space/>
      <SelectSearchComp register={register} name='commodityId' control={control} label='Commodity *' disabled={getStatus(approved)} width={"100%"}
        options={state.fields.commodity} 
      />
        <div className='mt-2' />
        <Row>
        <Col md={1}>
          <CheckGroupComp register={register} name='transportCheck' control={control} label='' disabled={getStatus(approved)} 
          options={[{ label:"", value:"Transport" }]} />
        </Col>
        <Col md={3}>
          <div className='custom-link' onClick={()=>pageLinking("vendor", transporterId)} >Transport</div>
        </Col>
        <Col>.</Col>
        </Row>
        <SelectSearchComp register={register} name='transporterId' control={control} label='' 
          options={state.fields.vendor.transporter} disabled={getStatus(approved) || transportCheck[0]!='Transport'} width={"100%"} />
        <div className='mt-2'></div>
        <Row>
          <Col md={1}>
            <CheckGroupComp register={register} name='customCheck' control={control} label='' disabled={getStatus(approved)} 
            options={[{ label:"", value: "Custom Clearance" }]} />
          </Col>
          <Col md={6}>
            <div className='custom-link' onClick={()=>pageLinking("vendor", customAgentId)} >Custom Clearance</div>
          </Col>
          <Col>.</Col>
        </Row>
        <SelectSearchComp register={register} name='customAgentId' control={control} label='' width={"100%"}
          options={state.fields.vendor.chaChb} disabled={getStatus(approved) || customCheck[0]!='Custom Clearance'} />
        <div style={{marginTop:20}}></div>
        <div className='px-2 pb-2' style={{border:'1px solid silver'}}>
          <Row>
            <Col md={6} className='mt-2'>
            <div>Weight</div><InputNumber value={getWeight().weight} disabled style={{ color:'black'}} width={"100%"} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='BKG Weight' step={'0.01'} disabled={getStatus(approved)} />
            </Col>
            <Col md={6} className='mt-2'>
            <div>Container</div><InputNumber value={getWeight().qty} disabled width={"100%"} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
            </Col>
            <Col md={6} className='mt-2'>
              <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{ color:'black'}} width={"100%"} />
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='vol' control={control} label='Vol' width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
            </Col>
            <Col md={6} className='mt-2'>
              <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
            </Col>
            <Col md={6} className='mt-2'>
              <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
                options={[  
                {"id":"BAGS"   , "name":"BAGS"},
                {"id":"BALES"  , "name":"BALES"},
                {"id":"BARRELS", "name":"BARRELS"},
                {"id":"CARTONS", "name":"CARTONS"},
                {"id":"BLOCKS" , "name":"BLOCKS"},
                {"id":"BOATS"  , "name":"BOATS"}
              ]} />
            </Col>
          </Row>
        </div>
      </Col>
      <Col md={3}>
      {state.edit &&<Notes state={state} dispatch={dispatch} />}
        {console.log("approved", approved  )}
        {approved=="1" && <img src={'/approve.png'} height={100} />}
        <div
          onClick={()=>    dispatch({type:"set",payload:{isModalOpen : true,}}) }>
        <CheckGroupComp register={register} name='approved'
        control={control} label='_____________________' options={[{ label:"Approve Job", value:"1" }]} />
        </div>
        <hr/>
        <div style={{display:"flex", flexWrap:"wrap", gap:"0.8rem"}}>
        <button className='btn-custom px-4' type="button"
          onClick={()=>{
             dispatchNew(incrementTab({
              "label":"SE BL",
              "key":"4-4",
              "id":state.selectedRecord.Bl!=null?`${state.selectedRecord.Bl.id}`:"new"
            }));
            Router.push(`/seJob/bl/${state.selectedRecord.Bl!=null?state.selectedRecord.Bl.id:"new"}`);
          }}
        >BL
        </button>
        <Popover
        content={
          <>{state.InvoiceList?.map((x, i) => 
            (<div key={i} className='my-1'>
              <Tag color="geekblue" style={{fontSize:15, cursor:"pointer", width:130, textAlign:'center'}}
                onClick={()=>{
                dispatch({ type:'set',
                  payload:{ selectedInvoice:x.invoice_No, tabState:"5" }
                })
              }}>
                {x.invoice_No}
              </Tag>
            </div>))}
          </>}>
          <button type="button" className="btn-custom">Invoice/Bills {`(${state.InvoiceList.length})`}</button>
        </Popover>
         <button className='btn-custom px-4'  type='button' 
          onClick={()=>{
           dispatch({type:'toggle', fieldName:'loadingProgram', payload:"6"}) ;
           state.tabState = "6"
          }}
        >Loading Program</button>
        </div>
      </Col>
    </Row>
    {(state.voyageVisible && approved[0]!="1") && 
      <CustomBoxSelect reset={reset} useWatch={useWatch} control={control} state={state} dispatch={dispatch}/>
    }
     <Modal open={state.isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {approved=="1" ? "Are You Sure You Want To Approve This Job? " : "Are You Sure You Want To Disapprove This Job?"}
      </Modal>
    
  </>
)}
export default BookingInfo