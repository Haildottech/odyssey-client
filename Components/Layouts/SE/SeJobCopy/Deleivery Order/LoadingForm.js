import React from 'react'
import PrintComp from './PrintComp';
import { useState } from 'react';
import Column1 from './Column1';
import Column2 from './Column2';
import Column3 from './Column3';
import {  Popover } from 'antd'
import { Col, Row } from 'react-bootstrap';

const LoadingForm = ({handleSubmit, register, control, onSubmit, state, load, allValues, jobData}) => {

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <div style={{overflowY:"scroll", height:600, overflowX:"hidden"}}>
    <form className="d-flex justify-content-between flex-column" >
      
    <Popover content={<div>{(open && allValues.id ) && <PrintComp allValues={allValues} state={state} />}</div>}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <button type="button" className="btn-custom mt-1" style={{width:"100px"}}>Print</button>
    </Popover>
    <Col>
    <Column1 registr={register} control={control} state={state} jobData={jobData}/>
    <hr />
    <Column2 registr={register} control={control} state={state} jobData={jobData}/>
    <hr />
    <Column3 registr={register}  load={load} control={control} state={state}  onSubmit={onSubmit} handleSubmit={handleSubmit}/>
    </Col>
    </form>
  </div>
  )
}

export default LoadingForm