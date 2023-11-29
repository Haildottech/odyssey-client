import { recordsReducer, initialState, companies, handleSubmit, plainOptions } from './states';
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Select, Checkbox, Modal, Radio } from 'antd';
import React, { useReducer } from 'react';
import Search from './Search';
import Sheet from './Sheet';
import AdvanceSearch from './AdvanceSearch';
import { incrementTab } from '/redux/tabs/tabSlice';
import { useDispatch } from 'react-redux';
import Router from "next/router";

const JobPL = () => {

  const dispatchNew = useDispatch();
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const set = (obj) => dispatch({type:'set', payload:obj});

  return (
  <>
    <div className='base-page-layout pb-5'>
      <Row>
        <Col md={3}>
          <div>Start Date</div>
          <Form.Control type={"date"} size="sm" value={state.from} onChange={(e)=>set({from:e.target.value})} />
        </Col>
        <Col md={3}>
          <div>End Date</div>
          <Form.Control type={"date"} size="sm" value={state.to} onChange={(e)=>set({to:e.target.value})} />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={2}>
          <div>Job Types</div>
          <Checkbox.Group options={plainOptions}  value={state.jobType} onChange={(e)=>set({jobType:e})} />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={3}>
          <div>Company</div>
          <Select style={{width: "100%"}} value={state.company} onChange={(e)=>set({company:e})} options={companies} />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={3}>
          <div>Sales Representative</div>
          <Search getChild={(value)=>set({salesrepresentative:value})} placeholder={"Search"} style={{width:"100%"}} type={"representative"} />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={3}>
          <div>Overseas Agent</div>
          <Search getChild={(value)=>set({overseasagent:value})} placeholder={"Search"} style={{width:"100%"}} type={"agent"} />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col md={3}>
          <div>Client</div>
          <AdvanceSearch getChild={(value)=>set({client:value})}  placeholder={"Search"} style={{width:"100%"}} type={"client"} />
        </Col>
        <Col md={8}></Col>
        <Col md={2} style={{border:'1px solid silver', marginLeft:12, paddingRight:40}} className='py-1 mt-3'>
          Report Types
          <Radio.Group onChange={(e)=>set({reportType:e.target.value})} value={state.reportType}>
              <Radio value={"viewer"}>Viewer</Radio>
              <Radio value={"grid"}>Grid</Radio>
          </Radio.Group>
        </Col>
      </Row>
      <button className='btn-custom mt-3' 
        onClick={()=>{
          //handleSubmit(set,state)
          const { to, from, client, company, jobType, overseasagent, salesrepresentative } = state 
          Router.push({
            pathname:`/reports/jobPLReport/report`, 
            query:{ 
              to:to, 
              from:from, 
              client:client, 
              company:company, 
              jobtype:jobType, 
              overseasagent:overseasagent, 
              salesrepresentative:salesrepresentative,
              report:state.reportType
            }
          });
          dispatchNew(incrementTab({
            "label": "Job Profit & Loss", "key": "5-4-1",
            "id":`?to=${to}&from=${from}&client=${client}&company=${company}&jobtype=${jobType}&overseasagent=${overseasagent}&salesrepresentative=${salesrepresentative}$report=${state.reportType}`
          }));
        }} disabled={state.load}
      >
        {state.load?<Spinner size='sm' />:"Go"}
      </button>
    </div>
    <Modal title={"Job Profit & Loss Report"} 
      open={state.visible} 
      onOk={()=>set({visible:false})} 
      onCancel={()=>set({visible:false})}
      footer={false} maskClosable={false}
      width={'100%'}
    >
      {state.records.length>0 && <Sheet state={state} />}
    </Modal>
  </>
  )
}

export default JobPL