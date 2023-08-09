import React from 'react'
import PrintComp from './PrintComp';
import { useState } from 'react';
import Column1 from './Column1';
import Column2 from './Column2';
import Column3 from './Column3';
import {  Popover } from 'antd'
import { Col } from 'react-bootstrap';

const LoadingForm = ({handleSubmit, register, control, onSubmit, state, load, allValues, jobData}) => {

  
  return (
    <div style={{overflowY:"scroll", height:700, overflowX:"hidden"}}>
    <form className="d-flex justify-content-between flex-column" >
      
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