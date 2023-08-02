import moment from "moment";
import { delay } from "/functions/delay";
import axios from "axios";

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': {
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
            visible: true
        }
      }
      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            selectedRecord:{},
            edit: true,
            visible: true,
            selectedRecord:action.payload
        }
      }
      case 'setContent': {
        return {
            ...state,
            shipperContent    :action.payload.shipperContent    ,
            consigneeContent  :action.payload.consigneeContent  ,
            notifyOneContent  :action.payload.notifyOneContent  ,
            notifyTwoContent  :action.payload.notifyTwoContent  ,
            deliveryContent   :action.payload.deliveryContent   ,
            marksContent      :action.payload.marksContent      ,
            noOfPckgs         :action.payload.noOfPckgs         ,
            descOfGoodsContent:action.payload.descOfGoodsContent,
            grossWeightContent:action.payload.grossWeightContent,
            measurementContent:action.payload.measurementContent
        }
      }
      case 'modalOff': {
        let returnVal = {
          ...state,
          visible: false,
          selectedRecord:state.edit?{}:state.selectedRecord,
          edit: false
        };
        return returnVal
      }
      default: return state 
    }
};

const baseValues = {
  //Basic Info
  id:'',
  hbl:'',
  hblDate:'',
  hblIssue:'',
  mbl:'',
  mblDate:'',
  status:'',
  blReleaseStatus:'',
  blHandoverType:'',
  releaseInstruction:'',
  remarks:'',
  //sailingDate:'',
  onBoardDate:'',
  issuePlace:'',
  issueDate:'',
  formE:'',
  SEJobId:'',
  notifyPartyOneId:null,
  notifyPartyTwoId:null,

  //Values Drawn From Job
  jobNo:'',
  shipper:'',
  consignee:'',
  overseas_agent:'',
  commodity:'',
  shipDate:'',
  vessel:'',
  pol:'',
  pofd:'',
  pot:'',
  fd:'',
  //Second Ports Option
  polTwo:'',
  podTwo:'',
  poDeliveryTwo:'',
  AgentStamp:'',

  freightType:"",
  unit:'',
  hs:'',
  agentM3:'',
  coloadM3:'',
  equip:[],
  gross:0,
  net:0,
  tare:0,  
  wtUnit:0,
  pkgs:0,  
  unit:0,  
  cbm:0   
};

const initialState = {
  records: [{
    SE_Job:{jobNo:""}
  }],
  load:false,
  visible:false,
  partyVisible:false,
  jobsData:[],
  partiesData:[],
  Container_Infos:[],
  deletingContinersList:[],
  //setNotifyParties:false,
  updateContent:false,
  shipperContent:"",
  consigneeContent:"",
  notifyOneContent:"",
  notifyTwoContent:"",
  deliveryContent:"",
  marksContent:"",
  noOfPckgs:"",
  saveContainers:false,
  descOfGoodsContent:"",
  grossWeightContent:"",
  measurementContent:"",
  jobLoad:false,
  edit:false,
  values:baseValues,
  jobId:'',
  selectedRecord:{}
};

const fetchJobsData = async(set) => {
  set('jobLoad', true);
  set('partyVisible', true);
  await delay(300);
  const jobsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEA_JOBS_WITHOUT_BL)
  .then((x)=>{
    let data = [];
    if(x.data.status=="success"){
      x.data.result.forEach(x => {
        data.push({...x, check:false})
      });
    }
    return data
  });
  set('jobsData', jobsData);
  set('jobLoad', false);
}

const convetAsHtml = (values) => {
  const getVar = (val) => {
    let result = ""
    if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone1"){ result='TEL'; }
    else if(val=="telephone2"){ result='TEL'; }
    return result;
  }
  let result = "";
  let gottenValues = {...values};
  delete gottenValues.id;
  Object.keys(gottenValues).forEach((x)=>{
    result = result + `<p>${getVar(x)} ${gottenValues[x]}</P>`;

  })
  return result
}

const setJob = (set, x, state, reset, allValues) => {
  if(!x.check){
    let temp = [...state.jobsData];
    temp.forEach((y, i2) => {
      if(y.jobNo==x.jobNo) {
        temp[i2].check=true
      } else {
        temp[i2].check=false 
      }
    })
    set('jobData', temp);
  } else {
    allValues.SEJobId =      x.id;                 
    allValues.jobNo =        x.jobNo;                        
    allValues.consignee =    x.consignee.name;     
    allValues.shipper =      x.shipper.name;            
    allValues.overseas_agent=x.overseas_agent.name;
    allValues.pol =          x.pol;                
    allValues.pofd =          x.pod;                
    allValues.fd =           x.fd;                 
    allValues.vessel =       x.vessel.name;             
    allValues.shipDate =     x.shipDate;
    allValues.commodity =    x.commodity.name;     
    allValues.equip =        x.SE_Equipments;      
    allValues.freightType =  x.freightType;      
    allValues.delivery =  x.delivery;      
  
    set('deliveryContent',convetAsHtml(x.overseas_agent));
    set('consigneeContent',convetAsHtml(x.consignee));
    set('shipperContent',convetAsHtml(x.Client));
    //set('values', allValues);
    reset(allValues)
    set('partyVisible', false);
    set('updateContent', !state.updateContent);
  }
}

const calculateContainerInfos=(state, set, reset, allValues)=>{
  let tempContainers = state.Container_Infos, cbm = 0.0, tare = 0.0, net = 0.0, gross = 0.0, pkgs = 0, unit = "", wtUnit = "";
  tempContainers.forEach((x,i)=>{
    if(i==0){
      unit= x.unit; wtUnit= x.wtUnit;
    }
    cbm = cbm + parseFloat(x.cbm||0); tare = tare + parseFloat(x.tare||0); net = net + parseFloat(x.net||0); gross = gross + parseFloat(x.gross||0); pkgs = pkgs + parseInt(x.pkgs||0);
  })
  set('saveContainers',false);
  allValues = {...allValues, gross:""+gross, net:""+net, tare:""+tare, wtUnit, pkgs:""+pkgs, unit, cbm:""+cbm}

  reset(allValues);

}

const setAndFetchBlData = async(reset, state, allValues, set, dispatch) => {
  set("load", true);
  let result = {...state.selectedRecord};
  result.equip = [{}];
  const fetchedResult = await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_FIND_JOB_BY_NO,{
    no:result.SE_Job.jobNo
  }).then((x)=>x.data.result)
  allValues.SEJobId =        fetchedResult[0].id;
  allValues.jobNo =          fetchedResult[0].jobNo;
  allValues.consignee =      fetchedResult[0].consignee.name;
  allValues.shipper =        fetchedResult[0].shipper.name;
  allValues.overseas_agent = fetchedResult[0].overseas_agent.name;
  allValues.pol =            fetchedResult[0].pol;
  allValues.pofd =           fetchedResult[0].pod;
  allValues.fd =             fetchedResult[0].fd;
  allValues.vessel =         fetchedResult[0].vessel.name;
  allValues.shipDate =       fetchedResult[0].shipDate;
  allValues.commodity =      fetchedResult[0].commodity.name;
  allValues.equip =          fetchedResult[0].SE_Equipments;
  allValues.freightType =    fetchedResult[0].freightType;
  allValues.delivery =       fetchedResult[0].delivery;

  result.Container_Infos.forEach((x, i)=>{
    result.Container_Infos[i].date = x.date!=""?moment(x.date):""
  })
  let cbm = 0.0, tare = 0.0, net = 0.0, gross = 0.0, pkgs = 0, unit = "", wtUnit = "";
  result.Container_Infos.forEach((x,i)=>{
    if(i==0){ unit= x.unit; wtUnit= x.wtUnit; }
    cbm = cbm + parseFloat(x.cbm||0); tare = tare + parseFloat(x.tare||0); net = net + parseFloat(x.net||0); gross = gross + parseFloat(x.gross||0); pkgs = pkgs + parseInt(x.pkgs||0);
  })
  allValues = {...allValues, gross:""+gross, net:""+net, tare:""+tare, wtUnit, pkgs:""+pkgs, unit, cbm:""+cbm}
  set("Container_Infos", result.Container_Infos);
  result = {
    ...allValues,
    ...result,
    //id:result.id
  }
  result.mblDate = result.mblDate?moment(result.mblDate):"";
  result.hblDate = result.hblDate?moment(result.hblDate):"";
  result.onBoardDate = result.onBoardDate?moment(result.onBoardDate):"";
  result.issueDate = result.issueDate?moment(result.issueDate):"";
  result.shipDate = result.shipDate?moment(result.shipDate):"";
  reset(result);
  dispatch({type:"setContent", payload:result});
  set('updateContent', true);
  set("load", false);
}

export { 
  initialState,
  baseValues,
  convetAsHtml,
  calculateContainerInfos,
  recordsReducer,
  fetchJobsData,
  setJob,
  setAndFetchBlData 
};