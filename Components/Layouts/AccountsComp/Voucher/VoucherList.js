import React, { useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col,Table } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import PopConfirm from '../../../Shared/PopConfirm';
import { RiDeleteBin2Fill, RiEdit2Fill } from "react-icons/ri";
import Pagination from '../../../Shared/Pagination';

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const VoucherList = ({ voucherData }) => {

  const [rowData, setRowData] = useState();
  const [originalData, setOriginalData] = useState();
  const dispatch = useDispatch();

  const amountDetails = {
    component: (props) => <>
      <span style={{ color: 'grey' }}>Rs. </span>
      <span className='blue-txt fw-6'>{commas(props.data.amount)}</span>
    </>
  };

  const genderDetails = {
    component: (props) => <>
      <span className='blue-txt fw-6 fs-12'>{props.data.voucher_Id}</span>
    </>
  };

  const dateComp = {
    component: (props) => <>
      <span className='fw-6 fs-12'>{moment(props.data.createdAt).format("YYYY-MM-DD")}</span>
    </>
  };
  const DeleteComp = {
    component: (props) => <>
      <div className='px-2'
        onClick={() => {
          PopConfirm("Confirmation", "Are You Sure To Remove This Charge?",
            () => {
              axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_DELETE_BASE_VOUCHER, {
                id: props.data.id
              }).then((x) => {
                Router.push("/accounts/voucherList")
              })
            })
        }}
      >
        <span className='fs-15 btn-red-two'><RiDeleteBin2Fill /></span>
      </div>
    </>
  };

  const [columnDefs, setColumnDefs] = useState([
    // { headerName: '#', field: 'no', width: 40 },
    { headerName: 'Voucher No.', field: 'voucher_Id', filter: true, filter: 'agTextColumnFilter', cellRendererSelector: () => genderDetails, filter: true },
    { headerName: 'Type', field: 'type', filter: true , filter: 'agTextColumnFilter', },
    { headerName: 'Cheque Date', field: 'date', filter: true, filter: 'agTextColumnFilter', },
    { headerName: 'Paid To', field: 'payTo', filter: true , filter: 'agTextColumnFilter',},
    { headerName: 'Amount', field: 'amount', filter: true, filter: 'agTextColumnFilter', cellRendererSelector: () => amountDetails, filter: true },
    { headerName: 'Voucher Date', field: 'createdAt', filter: true, filter: 'agTextColumnFilter', cellRendererSelector: () => dateComp, filter: true },
    { headerName: 'Delete', cellRendererSelector: () => DeleteComp },
  ]);

  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageLoad, setPageLoad] = useState(false)
  const [noMoreData, setNoMoreData] = useState(false);
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
                    <td style={{cursor:"pointer"}} onClick={() => handleEdit(x.id)}>
                      <span className='fs-15 text-dark'><RiEdit2Fill /></span>
                    </td>
                    <td style={{cursor:"pointer"}} onClick={() => handleDelete(x.id)}>
                      <span className='fs-15 text-danger'><RiDeleteBin2Fill /></span>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
      <div className='my-1'>
        <button className='btn-custom-small px-3' onClick={() => offset != 0 ? nextPage(offset - 30) : null}>Previous</button>
        <span className='mx-3 fs-20'>{page}</span>
        <button className='btn-custom-small px-4' disabled={noMoreData} onClick={() => nextPage(offset + 30)}>Next</button>
        {pageLoad && <Spinner size='sm' className='mx-4' color={'red'} />}
      </div>
    </div>
  );
};

export default React.memo(VoucherList)