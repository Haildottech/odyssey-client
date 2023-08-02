import { recordsReducer, initialState, companies, handleSubmit, plainOptions } from './states';
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Select, Checkbox, Modal } from 'antd';
import React, { useReducer } from 'react';
import Search from './Search';
import Sheet from './Sheet';
import AdvanceSearch from './AdvanceSearch';

const JobPL = () => {

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
      {/* <Row className='mt-3'>
        <Col md={3}>
          <div>Client</div>
          <Search getChild={(value)=>set({client:value})}  placeholder={"Search"} style={{width:"100%"}} type={"client"} />
        </Col>
      </Row> */}
      <Row className='mt-3'>
        <Col md={3}>
          <div>Client</div>
          <AdvanceSearch getChild={(value)=>set({client:value})}  placeholder={"Search"} style={{width:"100%"}} type={"client"} />
        </Col>
      </Row>
      <button className='btn-custom right' onClick={()=>handleSubmit(set,state)} disabled={state.load}>
        {state.load?<Spinner size='sm' />:"Go"}
      </button>
    </div>
    <Modal title={"Job Balancing List"} 
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