import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from "react-bootstrap";
import Router from 'next/router';

const OpeningBalance = ({sessionData, openingBalancesList}) => {

  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(openingBalancesList.result)
  }, [])
    
  return (
    <div className='base-page-layout'>
      <Row>
        <Col md={10}>
          <h5>Opening Balance List</h5>
        </Col>
        <Col>
          <button className='btn-custom' style={{float:'right'}}
            onClick={()=>{
              Router.push("/accounts/openingBalance/new")
            }}
          >Create</button>
        </Col>
      </Row>
      <hr/>
      <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
          <thead>
            <tr>
              <th>Voucher No</th>
              <th>Voucher Id</th>
              <th>Job Type</th>
              <th>Cost Center</th>
            </tr>
          </thead>
          <tbody>
          {records?.map((x, index) => {
          return (
          <tr key={index} className='f table-row-center-singleLine row-hov' 
            onClick={() => {
                //dispatch(incrementTab({"label":"Voucher","key":"3-5","id":`${x.id}`}));
                Router.push(`/accounts/openingBalance/${x.id}`);
            }}>
            <td>{x?.voucher_No}</td>
            <td>{x?.voucher_Id}</td>
            <td>{x?.type}      </td>
            <td>{x?.costCenter}</td>   
          </tr>
            )
          })}
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default OpeningBalance