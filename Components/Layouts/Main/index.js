'use client'
import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from "react-bootstrap";
import AWBCalculator from './AWBCalculator';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';
import { RiShip2Fill } from "react-icons/ri"
import { CgSandClock } from "react-icons/cg"
import { AiFillCheckCircle } from "react-icons/ai"
import { BsFillClockFill, BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs"
import { FcSalesPerformance } from "react-icons/fc";
import dynamic from 'next/dynamic';
const DynamicComponent = dynamic(() => import("./ChartComp"));

const Main = ({sessionData, chartData}) => {

  const [loadGraph, setLoadGraph] = useState(false)
  const companyId = useSelector((state) => state.company.value);
  const { data, status, error, refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login');
    }
  }, [sessionData]);

  useEffect(() => {
    if (typeof window === "undefined"){
      setLoadGraph(false)
    }else{
      setLoadGraph(true)
    }
  }, [])
  
  return (
  <div className='home-styles'>
    <Row>
      {companyId==3 && <AWBCalculator/>}
    </Row>
    {companyId==1 && 
    <Container>
      <Row>
        <Col md={12} className='mt-4'>
          <h3 className='top-section-heading'>Job Statistics</h3>
          <hr className='mt-0' />
        </Col>
        <Col md={3} className='wh-bg-round mx-2'>
          <div className='text-center mb-3'>
            <img src='/seanet colored.png' height={50} />
          </div>
          <div>
            <div className='line'>
              <span className='line-heading-'>FCL</span>
              <AiFillCheckCircle className='line-icon-green' />
              <span className='line-value-blue'>56</span>
            </div>
            <div className='line'>
              <span className='line-heading-'>LCL</span>
              <AiFillCheckCircle className='line-icon-green' />
              <span className='line-value-blue'>10</span>
            </div>
            <div className=''>
              <span className='line-heading-'>Pending</span>
              <CgSandClock className='line-icon-silver' />
              <span className='line-value-blue'>23</span>
            </div>
          </div>
        </Col>
        <Col md={3} className='wh-bg-round mx-2'>
          <div className='text-center mb-3'>
            <img src='/acs colored.png' height={50} />
          </div>
          <div>
            <div className='line'>
              <span className='line-heading-'>FCL</span>
              <AiFillCheckCircle className='line-icon-green' />
              <span className='line-value-blue'>23</span>
            </div>
            <div className='line'>
              <span className='line-heading-'>LCL</span>
              <AiFillCheckCircle className='line-icon-green' />
              <span className='line-value-blue'>7</span>
            </div>
            <div className=''>
              <span className='line-heading-'>Pending</span>
              <CgSandClock className='line-icon-silver' />
              <span className='line-value-blue'>15</span>
            </div>
          </div>
        </Col>
        <Col md={5} className='wh-bg-round mx-2'>
          <span className='timeline blue-txt'>Timeline History <BsFillClockFill className='pl-b2' color='orange' /></span>
          <hr className='my-1' />
          <div className='timeline-container px-4 mt-4'>
            <div className='timeline-value'>
              <div className='time-value'>162</div>
              <div className='time-heading'>365 Days</div>
            </div>
            <div className='timeline-value'>
              <div className='time-value'>33</div>
              <div className='time-heading'>30 Days</div>
            </div>
            <div className='timeline-value'>
              <div className='time-value'>12</div>
              <div className='time-heading'>7 Days</div>
            </div>
          </div>
        </Col>
        <Col md={12} className='mt-4'>
          <h3 className='top-section-heading'>Sales Statistics</h3>
          <hr className='mt-0' />
        </Col>
        <Col md={3} className='wh-bg-round mx-2'>
          <span className='timeline blue-txt mb-3'>Projected Sales <FcSalesPerformance className='pl-b2' /></span>
          <hr className='my-1' />
          <div className='sales'> <span className='amount'>123,456,23.00</span> <span className='mx-1'>PKR</span></div>
        </Col>
        <Col md={3} className='wh-bg-round mx-2'>
          <span className='timeline blue-txt mb-3'>Ex. Rate Profits <BsGraphUpArrow className='pl-b2' color='orange' /></span>
          <hr className='my-1' />
          <div className='sales'> <span className='amount-2'>759,71.00</span> <span className='mx-1'>PKR</span></div>
        </Col>
        <Col md={3} className='wh-bg-round mx-2'>
          <span className='timeline blue-txt mb-3'>Ex. Rate Losses <BsGraphDownArrow className='pl-b2' color='orange' /></span>
          <hr className='my-1' />
          <div className='sales'> <span className='amount-2'>3,155,93.00</span> <span className='mx-1'>PKR</span></div>
        </Col>
        <Col md={9} className='wh-bg-round mx-2 mt-4'>
          {loadGraph && <DynamicComponent chartData={chartData} />}
        </Col>
      </Row>
    </Container>
    }
  </div>
  )
}

export default Main