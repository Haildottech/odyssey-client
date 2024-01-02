import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { Row, Col, Spinner } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from 'moment';
import axios from 'axios';
import Cookies from 'js-cookie';
import PopConfirm from '../../../Shared/PopConfirm';
import { RiDeleteBin2Fill } from "react-icons/ri";
import Form from 'react-bootstrap/Form';

const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const VoucherList = ({ voucherData }) => {

  const gridRef = useRef();
  const [rowData, setRowData] = useState();
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
  const [searchData,setSearchData] = useState([])
  
  const defaultColDef = useMemo(() => ({
    sortable: true
  }));

  const cellClickedListener = useCallback(async (e) => {
    if (e.colDef.headerName != "Delete") {
      await Router.push(`/accounts/vouchers/${e.data.id}`);
      dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${e.data.id}` }));
    }
  }, []);

  const nextPage = (offsetValue) => {
    setPageLoad(true)
    const limit = query ? 0 : 30;
    axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_VOUCHERS, {
      headers: {
        "id": `${Cookies.get('companyId')}`,
        "offset": `${offsetValue}`,
        "limit": `${limit}`,
      }
    }).then((x) => {
      offsetValue > offset ?
        setPage(page + 1) :
        setPage(page - 1)
      setOffset(offsetValue)
      setData(x.data);
      setNoMoreData(x.data.result.length < 30);
      setPageLoad(false)
    });
  }

   // search funtionalites
  const handleFilterChanged = () => {
    const api = gridRef.current.api;
    const filters = api.getFilterModel();
    const searchText = Object.values(filters)
      .map(filter => filter.filter)
      .join(' ');
  
    setQuery(searchText.toLowerCase());
  };
  
  const search = (data) => {
    return data.filter(item => {
      // Combining all column values into a single string for searching
      const rowValues = Object.values(item).join(' ').toLowerCase();
      // converting query into the lowercase 
      const lowerCaseQuery = query.toLowerCase()
      // searching with both lowercase and uppercase
      return keys.some(key => rowValues.includes(lowerCaseQuery) || rowValues.includes(query));
    });
  };

  useEffect(()=>{
    if(rowData){
      const filterData = search(rowData);
      setSearchData(filterData);
    }
  },[query, rowData])

  useEffect(() => {
    setCount(parseInt(voucherData.count / 30))
    setData(voucherData);
  }, []);


  const setData = async (data) => {
    let tempData = data.result
    await tempData?.forEach((x, i) => {
      x.no = i + 1;
      x.amount = x.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0),
        x.date = moment(x.createdAt).format("YYYY-MM-DD")
    });
    setRowData(tempData);
  }

  const getRowHeight = useCallback(() => {
    return 38;
  }, []);

  return (
    <div className='base-page-layout'>
      <Row>
        <Col md="6"><h5>Voucher Details</h5></Col>
        <Col md="4">
          <Form.Control type="text" placeholder="Search..." size='sm' onChange={e => setQuery(e.target.value)} />
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
      <div className="ag-theme-alpine" style={{ width: "100%", height: '72vh' }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={searchData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection='multiple' // Options - allows click selection of rows
          onCellClicked={cellClickedListener}
          getRowHeight={getRowHeight}
          onFilterChanged={()=>handleFilterChanged()}//for multi searching
        />
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

export default React.memo(VoucherList);