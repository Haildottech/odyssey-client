import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { incrementTab } from '/redux/tabs/tabSlice';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
const Index=({manifest})=>{

  const dispatch = useDispatch();

  return (
    <div className="base-page-layout">
        <div className='base-page-layout'>
      <Row>
        <Col><h5>Manifest List</h5></Col>
        <Col>
          <button className='btn-custom right'
            onClick={()=>{
              // dispatch(incrementTab({"label":"Voucher","key":"3-5","id":"new"}))
              dispatch(incrementTab({
                "label":"Manifest",
                "key":"7-8",
                "id":"new"
              }))
              Router.push(`/airJobs/manifest/new`);
            }}
          >
            Create
          </button>
        </Col>
      </Row>
      <hr className='my-2' />
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>S No</th>
            <th>Owner And Operator</th>
            <th>Type Of Aircraft</th>
            <th>Point Of Loading</th>
            <th>Point Of Unloading</th>
            <th>Manifest No</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
        {manifest?.map((x, index) => {
        return (
        <tr key={index} className='f table-row-center-singleLine row-hov' 
          onClick={() => {
          // dispatch(incrementTab({"label":"Voucher","key":"3-5","id":`${x.id}`}));
          dispatch(incrementTab({
            "label":"Manifest",
            "key":"7-8",
            "id":x.id
          }))
          Router.push(`/airJobs/manifest/${x.id}`);
          }}>
          <td>{index + 1}</td>
          <td>{x?.owner_and_operator}</td>
          <td>{x?.type_of_aircraft}</td>
          <td>{x?.point_of_loading}</td>
          <td>{x?.point_of_unloading}</td>
          <td>{x?.job_no}  </td>
          <td>{x?.date?.substr(0, 10)}     </td>
        </tr>
          )
        })}
        </tbody>
      </Table>
      </div>
      </div>
    </div>
  );
};

export default Index;