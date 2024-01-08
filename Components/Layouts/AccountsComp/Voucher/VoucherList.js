import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { Row, Col, Spinner, Table } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import PopConfirm from '../../../Shared/PopConfirm';
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import Form from 'react-bootstrap/Form';
import Pagination from '../../../Shared/Pagination';

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const VoucherList = ({ voucherData }) => {

  const [rowData, setRowData] = useState();
  const [originalData, setOriginalData] = useState();
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
      () => {
        axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
          id: id
        }).then((x) => {
          Router.push("/accounts/voucherList")
        })
      })
  }
  const handleEdit = async (voucherId) => {
    await Router.push(`/accounts/vouchers/${voucherId}`);
    dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${voucherId}` }));
  };

  //search 
  const [query, setQuery] = useState("")
  const keys = ["voucher_Id", "type", "amount"]
  // search funtionalites
  const search = (data) => {
    return data.filter(item => {
      return keys.some(key => 
        typeof item[key] === 'string' && 
        item[key]?.toLowerCase().includes(query.toLowerCase())
      );
    });
  };
  useEffect(() => {
    if (originalData) {
      const filterData = search(originalData);
      setRowData(filterData);
    }
  }, [query, originalData]);

  useEffect(() => {
    setData(voucherData);
  }, []);


  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(50);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = rowData ? rowData.slice(indexOfFirst, indexOfLast) : null;
  const noOfPages = rowData ? Math.ceil(rowData.length / recordsPerPage) : null;

  const setData = async (data) => {
    let tempData = data.result
    await tempData?.forEach((x, i) => {
      x.no = i + 1;
      x.amount = x.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0),
        x.date = moment(x.createdAt).format("YYYY-MM-DD")
    });
    setRowData(tempData);
    setOriginalData(tempData);
  }

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md="6"><h5>Voucher Details</h5></Col>
        <Col md="4">
          <input type="text" className='searchInput' placeholder="Enter Voucher No" size='sm' onChange={e => setQuery(e.target.value)} />
        </Col>
        <Col md="2">
          <button className='btn-custom right'
            onClick={async () => {
              await Router.push(`/accounts/vouchers/new`)
              dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": "new" }))
            }}
          > Create </button>
        </Col>
      </Row>
      <hr />
      <div className='mt-3' style={{ maxHeight: "65vh", overflowY: 'auto', overflowX: "scroll" }}>
        <Table className='tableFixHead'>
          <thead>
            <tr>
              <th >Voucher No.</th>
              <th>Type</th>
              <th>Cheque Date</th>
              <th>Paid to</th>
              <th>Amount</th>
              <th>Voucher Date</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              currentRecords?.map((x, index) => {
                return (
                  <tr key={index}>
                    <td className='blue-txt fw-6 fs-12'>{x.voucher_Id}</td>
                    <td>{x.type}</td>
                    <td>{moment(x.chequedate).format("YYYY-MM-DD")}</td>
                    <td>{x.payTo}</td>
                    <td>
                      <span style={{ color: 'grey' }}>Rs. </span>
                      <span className='blue-txt fw-6'>{commas(x.amount)}</span>
                    </td>
                    <td>{moment(x.createdAt).format("YYYY-MM-DD")}</td>
                    <td onClick={() => handleEdit(x.id)}>
                      <span className='fs-15 btn-red-two'><RiEdit2Fill /></span>
                    </td>
                    <td onClick={() => handleDelete(x.id)}>
                      <span className='fs-15 btn-red-two'><RiDeleteBin2Fill /></span>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <div className='d-flex justify-content-end items-end my-4' style={{ maxWidth: "100%" }} >
        <Pagination noOfPages={noOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default React.memo(VoucherList)