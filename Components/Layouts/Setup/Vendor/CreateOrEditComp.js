import { Row, Col } from 'react-bootstrap';
import React, { useEffect, useReducer } from 'react';
import Router from 'next/router';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
      }

      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      default: return state 
    }
}

const baseValues = {
  //Basic Info
  code:"",
  id:'',
  name:"",
  registerDate:"",
  person1:"",
  mobile1:"",
  person2:"",
  mobile2:"",
  telephone1:"",
  telephone2:"",
  address1:"",
  address2:"",
  city:"",
  zip:"",
  ntn:"",
  strn:"",
  website:"",
  infoMail:"",
  accountsMail:"",
  operations:[],
  types: [],
  companies:[1,2,3],
  //Bank Info
  bank:"",
  branchName:"",
  branchCode:"",
  accountNo:"",
  iban:"",
  swiftCode:"",
  routingNo:"",
  ifscCode:"",
  micrCode:"",
  bankAuthorizeDate:null,
  authorizedById : null,

  //Account Info
  accountRepresentatorId : "",
  currency:"",
}

const initialState = {
    load:false,
    values:baseValues,
    Representatives:[
      {name:'Accounts', records:[]},
      // {name:'Sales', records:[]},
      // {name:'Doc', records:[]}
    ],
    Operations:[
      { label: "Sea Import", value: "Sea Import" },
      { label: "Sea Export", value: "Sea Export" },
      { label: "Air Import", value: "Air Import" },
      { label: "Air Export", value: "Air Export" }
    ],
    Types:[
      { label: "Forwarder/Coloader", value: "Forwarder/Coloader" },
      { label: "Local Vendor", value: "Local Vendor" },
      { label: "Overseas Agent", value: "Overseas Agent" },
      { label: "Commission Agent", value: "Commission Agent" },
      { label: "Indentor", value: "Indentor" },
      { label: "Transporter", value: "Transporter" },
      { label: "CHA/CHB", value: "CHA/CHB" },
      { label: "Shipping Line", value: "Shipping Line" },
      { label: "Delivery Agent", value: "Delivery Agent" },
      { label: "Warehouse", value: "Warehouse" },
      { label: "Buying House", value: "Buying House" },
      { label: "Air Line", value: "Air Line" },
      { label: "Trucking", value: "Trucking" },
      { label: "Drayman", value: "Drayman" },
      { label: "Cartage", value: "Cartage" },
      { label: "Stevedore", value: "Stevedore" },
      { label: "Principal", value: "Principal" },
      { label: "Depot", value: "Depot" },
      { label: "Terminal", value: "Terminal" },
      { label: "Buyer", value: "Buyer" },
      { label: "Invoice Party", value: "Invoice Party" },
      { label: "Slot Operator", value: "Slot Operator" },
    ],
    companyList:[
      {id:1, name:''}
    ],
    editCompanyList:[
      {id:1, name:''}
    ],
    history:[],
    // Editing Records
    oldRecord:{},
};

const CreateOrEditComp = ({sessionData, representativeData, vendorData, id}) => {

  useEffect(()=>{ if(sessionData.isLoggedIn==false) Router.push('/login') }, [sessionData]);
  const companiesList = useSelector((state) => state.company.companies);

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    dispatch({type:'toggle', fieldName:'companyList', payload:createCompanyList(companiesList)});
    dispatch({type:'toggle', fieldName:'editCompanyList', payload:createCompanyList(companiesList)});
    setRecords();
  }, [])

  const createCompanyList = (list) => {
    let tempState = [];
    list.forEach((x, index)=>{
          tempState.push({value:x.id, label:x.title, disabled:false})
    })
    return tempState
  }

  const setRecords = () => {
    let tempState = [ {name:'Accounts', records:[]}, {name:'Sales', records:[]}, {name:'Doc', records:[]} ];

    representativeData.result.Ar.forEach((x)=>{tempState[0].records.push(x)});
    representativeData.result.Dr.forEach((x)=>{tempState[1].records.push(x)});
    representativeData.result.Sr.forEach((x)=>{tempState[2].records.push(x)});
    
    dispatch({type:'toggle', fieldName:'Representatives', payload:tempState});
  }

  return (
    <div className='base-page-layout'>
      <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} vendorData={vendorData.result} id={id} />
    </div>
  )
}

export default CreateOrEditComp