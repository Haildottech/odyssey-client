import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';

const VoucherList = ({ voucherData }) => {
  const companyId = useSelector((state) => state.company.value);
  const [records, setRecords] = useState([]);
  const dispatch = useDispatch();

    useEffect(() => {
    const getVoucherList = async () =>{
      if (voucherData && Array.isArray(voucherData.result)) {
        const filtered = voucherData.result.filter((x) => {
          return x.CompanyId === companyId && x;
        });
        setRecords(filtered);
      }
    }
    getVoucherList()
    }, [])

  return (
    <>
    {companyId!='' &&
    <div className='base-page-layout'>
      <Row>
        <Col><h5>Voucher Details</h5></Col>
        <Col>
          <button className='btn-custom right'
            //onClick={()=>dispatch({type:'create'})}
            onClick={()=>{
              dispatch(incrementTab({"label":"Voucher","key":"3-5","id":"new"}))
              Router.push(`/accounts/vouchers/new`)
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
            <th>Voucher No</th>
            <th>Voucher Id</th>
            <th>Job Type</th>
            <th>Cheque Date</th>
            <th>Cheque No</th>
            <th>Paid To</th>
            <th>Cost Center</th>
          </tr>
        </thead>
        <tbody>
        {records?.map((x, index) => {
        return (
        <tr key={index} className='f table-row-center-singleLine row-hov' 
          onClick={() => {
              dispatch(incrementTab({"label":"Voucher","key":"3-5","id":`${x.id}`}));
              Router.push(`/accounts/vouchers/${x.id}`);
          }}>
          <td>{x?.voucher_No}</td>
          <td>{x?.voucher_Id}</td>
          <td>{x?.type}      </td>
          <td>{x?.chequeDate?.substr(0, 10)}</td>
          <td>{x?.chequeNo}  </td>
          <td>{x?.payTo}     </td>
          <td>{x?.costCenter}</td>   
        </tr>
          )
        })}
        </tbody>
      </Table>
      </div>
      </div>
    }
  </>
  )
}

export default VoucherList