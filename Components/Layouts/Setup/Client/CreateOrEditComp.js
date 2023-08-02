import { Row, Col } from 'react-bootstrap';
import React, { useEffect, useReducer } from 'react';
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
  companies:[],
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
  bankAuthorizeDate:"",
  authorizedById : "",
  //Account Info
  accountRepresentatorId : "",
  salesRepresentatorId : "",
  docRepresentatorId : "",
  currency:"",
  code:"",
}

const initialState = {
    load:false,
    values:baseValues,
    Representatives:[
      {name:'Accounts', records:[]},
      {name:'Sales', records:[]},
      {name:'Doc', records:[]}
    ],
    Operations:[
      { label: "Sea Import", value: "Sea Import" },
      { label: "Sea Export", value: "Sea Export" },
      { label: "Air Import", value: "Air Import" },
      { label: "Air Export", value: "Air Export" }
    ],
    Types:[
      { label: "Shipper", value: "Shipper" },
      { label: "Consignee", value: "Consignee" },
      { label: "Notify", value: "Notify" },
      { label: "Potential Customer", value: "Potential Customer" },
      { label: "Invoice Party", value: "Invoice Party" },
      { label: "Non operational Party", value: "Non operational Party" },
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

const Client = ({id, representativeData, clientData}) => {
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
    let tempState = [
      {name:'Accounts', records:[]},
      {name:'Sales', records:[]},
      {name:'Doc', records:[]}
    ];
    representativeData.result.Ar.forEach((x)=>{tempState[0].records.push(x)});
    representativeData.result.Dr.forEach((x)=>{tempState[1].records.push(x)});
    representativeData.result.Sr.forEach((x)=>{tempState[2].records.push(x)});
    dispatch({type:'toggle', fieldName:'Representatives', payload:tempState});
  }

  return (
    <div className='base-page-layout'>
      <CreateOrEdit state={state} dispatch={dispatch} baseValues={baseValues} clientData={clientData} id={id} />
    </div>
  )
}

export default Client