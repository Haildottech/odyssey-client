import React, { useEffect, useState } from 'react';
import { Tabs } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Spinner } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import openNotification from '/Components/Shared/Notification';
import { SignupSchema, getInvoices } from './states';
import BookingInfo from './BookingInfo';
import EquipmentInfo from './EquipmentInfo';
import Routing from './Routing';
import Invoice from './Invoice';
import ChargesComp from './ChargesComp/'
import LoadingProgram from './Loading Program';
import { useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router";
import {createNotification} from '../../../../functions/notifications'

const CreateOrEdit = ({state, dispatch, baseValues, companyId, jobData, id}) => {
  
  const {register, control, handleSubmit, reset, formState:{errors}, watch } = useForm({
    resolver:yupResolver(SignupSchema), defaultValues:state.values
  });
  const approved = useWatch({control, name:"approved"});
  const subType = useWatch({control, name:"subType"});
  const [check, setCheck] = useState(state.selectedRecord.approved == 1 ? true : false);
  const dispatchNew = useDispatch();

  useEffect(() => {
    if(state.edit){
      let tempState = {...jobData};
      let tempVoyageList = [...state.voyageList];
      tempVoyageList.length>0?null:tempVoyageList.push(tempState.Voyage);
      tempState = { ...tempState,
        customCheck: tempState.customCheck!==""?tempState.customCheck.split(", "):"",
        transportCheck:tempState.transportCheck!==""?tempState.transportCheck.split(", "):"",// tempState.transportCheck.split(", "),
        eta: tempState.eta==""?"":moment(tempState.eta),
        approved: tempState.approved=="true"?["1"]:[],
        //val.length==0?false:val[0]=="1"?false:true 
        polDate: tempState.polDate==""?"":moment(tempState.polDate),
        podDate: tempState.podDate==""?"":moment(tempState.podDate),
        aesDate: tempState.aesDate==""?"":moment(tempState.aesDate),
        aesTime: tempState.aesTime==""?"":moment(tempState.aesTime),
        eRcDate: tempState.eRcDate==""?"":moment(tempState.eRcDate),
        eRcTime: tempState.eRcTime==""?"":moment(tempState.eRcTime),
        eRlDate: tempState.eRlDate==""?"":moment(tempState.eRlDate),
        eRlTime: tempState.eRlTime==""?"":moment(tempState.eRlTime),
        jobDate: tempState.jobDate==""?"":moment(tempState.jobDate),
        shipDate:tempState.shipDate==""?"":moment(tempState.shipDate),
        doorMove:tempState.doorMove==""?"":moment(tempState.doorMove),
        cutOffDate:tempState.cutOffDate==""?"":moment(tempState.cutOffDate),
        cutOffTime:tempState.cutOffTime==""?"":moment(tempState.cutOffTime),
        siCutOffDate:tempState.siCutOffDate==""?"":moment(tempState.siCutOffDate),
        siCutOffTime:tempState.siCutOffTime==""?"":moment(tempState.siCutOffTime),
        vgmCutOffDate:tempState.vgmCutOffDate==""?"":moment(tempState.vgmCutOffDate),
        vgmCutOffTime:tempState.vgmCutOffTime==""?"":moment(tempState.vgmCutOffTime)
      }
      let tempEquipments = []
      if(tempState.SE_Equipments.length>0){
        let tempEquips = tempState.SE_Equipments;
        tempEquips.push({id:'', size:'', qty:'', dg:tempState.dg=="Mix"?"DG":tempState.dg, gross:'', teu:''})
        tempEquipments = tempState.SE_Equipments
      }else{
        tempEquipments = [{id:'', size:'', qty:'', dg:tempState.dg=="Mix"?"DG":tempState.dg, gross:'', teu:''}]
      }
      dispatch({type:"set",payload:{
        exRate:tempState.exRate,
        equipments:tempEquipments,
        voyageList:tempVoyageList
      }})
      getInvoices(tempState.id, dispatch)
      reset(tempState);
    }
    if(!state.edit){ reset(baseValues) }
  }, [state.selectedRecord])

  const onSubmit = async(data) => {
    data.equipments = state.equipments
    data.customAgentId = data.customCheck.length>0?data.customAgentId:null;
    data.transporterId = data.transportCheck.length>0?data.transporterId:null;
    data.VoyageId = data.VoyageId!=""?data.VoyageId:null;
    data.ClientId = data.ClientId!=""?data.ClientId:null;
    data.shippingLineId = data.shippingLineId!=""?data.shippingLineId:null;
    data.shipperId = data.shipperId!=""?data.shipperId:null;
    data.consigneeId = data.consigneeId!=""?data.consigneeId:null;
    data.overseasAgentId = data.overseasAgentId!=""?data.overseasAgentId:null;
    data.salesRepresentatorId = data.salesRepresentatorId!=""?data.salesRepresentatorId:null;
    data.forwarderId = data.forwarderId!=""?data.forwarderId:null;
    data.localVendorId = data.localVendorId!=""?data.localVendorId:null;
    data.commodityId = data.commodityId!=""?data.commodityId:null;
    data.shippingLineId = data.shippingLineId!=""?data.shippingLineId:null;
    data.approved = data.approved[0]=="1"?true:false;
    data.companyId = companyId;

    let loginId = Cookies.get('loginId');
    data.createdById = loginId;
    dispatch({type:'toggle', fieldName:'load', payload:true});
    
    console.log(data.approved)
    setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_CREATE_SEAJOB,{
          data
        }).then((x)=>{
          if(x.data.status=='success'){
              openNotification('Success', `Job Created!`, 'green');
              dispatchNew(incrementTab({
                "label": "SE JOB",
                "key": "4-3",
                "id":x.data.result.id
              }))
              Router.push(`/seJob/${x.data.result.id}`)
          }else{
              openNotification('Error', `An Error occured Please Try Again!`, 'red')
          }
          dispatch({type:'toggle', fieldName:'load', payload:false});
        })
    }, 3000);
  };

  const onEdit = async(data) => {
    data.equipments = state.equipments
    data.customAgentId = data.customCheck.length>0?data.customAgentId:null;
    data.transporterId = data.transportCheck.length>0?data.transporterId:null;

    data.VoyageId = data.VoyageId!=""?data.VoyageId:null;
    data.ClientId = data.ClientId!=""?data.ClientId:null;
    data.shippingLineId = data.shippingLineId!=""?data.shippingLineId:null;
    data.shipperId = data.shipperId!=""?data.shipperId:null;
    data.consigneeId = data.consigneeId!=""?data.consigneeId:null;
    data.overseasAgentId = data.overseasAgentId!=""?data.overseasAgentId:null;
    data.salesRepresentatorId = data.salesRepresentatorId!=""?data.salesRepresentatorId:null;
    data.forwarderId = data.forwarderId!=""?data.forwarderId:null;
    data.localVendorId = data.localVendorId!=""?data.localVendorId:null;
    data.commodityId = data.commodityId!=""?data.commodityId:null;
    data.shippingLineId = data.shippingLineId!=""?data.shippingLineId:null;
    data.approved = data.approved[0]=="1"?true:false;
    data.companyId = companyId;
  
    dispatch({type:'toggle', fieldName:'load', payload:true});
    const notification = {
      creatorId: state.selectedRecord.createdById ,
      type: "SE JOB", 
      subType : data.jobNo, 
      opened: 0,
      companyId, 
      recordId: data.id, 
      createdById: Cookies.get("loginId"),
      notification: approved[0] == '1' ?  `Job No ${data.jobNo} Approved`: `Job No ${data.jobNo} Dispproved`
    }
    setTimeout(async() => {
        await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_EDIT_SEAJOB,{data}).then((x)=>{
          if(x.data.status=='success'){
              openNotification('Success', `Job Updated!`, 'green')
              createNotification(notification)

          }else{
              openNotification('Error', `An Error occured Please Try Again!`, 'red')
          }
          dispatch({type:'toggle', fieldName:'load', payload:false});
        })
    }, 3000);
  };

  const onError = (errors) => console.log(errors);

  return(
  <div className='client-styles' style={{overflowY:'auto', overflowX:'hidden'}}>
      <form onSubmit={handleSubmit(state.edit?onEdit:onSubmit, onError)}>
      <Tabs defaultActiveKey={state.tabState} activeKey={state.tabState}
      onChange={(e)=> dispatch({type:'toggle', fieldName:'tabState', payload:e}) }>
      <Tabs.TabPane tab="Booking Info" key="1"> 
      <BookingInfo handleSubmit={handleSubmit} onEdit={onEdit} companyId={companyId} control={control} register={register} errors={errors} state={state} 
        useWatch={useWatch} dispatch={dispatch} reset={reset} id={id}
      />
  
      </Tabs.TabPane>
      {subType=="FCL" &&
      <Tabs.TabPane tab="Equipment" key="2">
      <EquipmentInfo control={control} register={register} errors={errors} state={state} dispatch={dispatch} useWatch={useWatch}/>
      </Tabs.TabPane>
      }
      <Tabs.TabPane tab="Routing" key="3">
      <Routing control={control} register={register} errors={errors} state={state} useWatch={useWatch} />
      </Tabs.TabPane >
      {state.edit &&
      <Tabs.TabPane tab="Charges" key="4">
      <ChargesComp state={state} dispatch={dispatch} />
      </Tabs.TabPane>
      }
      {(state.selectedInvoice!='') &&
      <Tabs.TabPane tab="Invoice / Bills" key="5">
      <Invoice state={state} dispatch={dispatch} companyId={companyId} />
      </Tabs.TabPane>
      }
      {(state.loadingProgram!='') &&
      <Tabs.TabPane tab="Loading Program" key="6">
      <LoadingProgram state={state} dispatch={dispatch} companyId={companyId} jobData={jobData} />
      </Tabs.TabPane>
      }
      </Tabs>
      {(state.tabState!="4" && state.tabState!="5" && state.tabState!="6") &&
      <>
      <button type="submit" disabled={state.load?true:false} className='btn-custom mt-3'>
      {state.load?<Spinner animation="border" size='sm' className='mx-3' />:'Save Job'}
      </button>
      </>
      }
    </form>
  </div>
  )
}

export default CreateOrEdit