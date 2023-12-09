import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';
import moment from 'moment';

const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

const App = ({voucherData}) => {

  const gridRef = useRef(); 
  const [rowData, setRowData] = useState(); 
  const dispatch = useDispatch();

  const amountDetails = {
    component: (props)=> <>
      <span style={{color:'grey'}}>Rs. </span>
      <span className='blue-txt fw-6'>{commas(props.data.amount)}</span>
    </>
  };

  const genderDetails = {
    component: (props)=> <>
      <span className='blue-txt fw-6 fs-12'>{props.data.voucher_Id}</span>
    </>
  };

  const dateComp = {
    component: (props)=> <>
      <span className='fw-6 fs-12'>{moment(props.data.createdAt).format("YYYY-MM-DD")}</span>
    </>
  };

  const [columnDefs, setColumnDefs] = useState([
    {headerName: '#', field:'no', width: 40 },
    {headerName: 'Voucher No.', field:'voucher_Id', filter: true, cellRendererSelector: () => genderDetails, filter: true},
    {headerName: 'Type', field:'type',       filter: true},
    {headerName: 'Cheque Date', field:'date', filter: true, },
    {headerName: 'Paid To', field:'payTo',      filter: true},
    {headerName: 'Amount', field:'amount', filter: true, cellRendererSelector: () => amountDetails, filter: true},
    {headerName: 'Voucher Date', field:'createdAt', filter: true, cellRendererSelector: () => dateComp, filter: true},
  ]);

  const defaultColDef = useMemo(()=> ({
    sortable: true
  }));

  const cellClickedListener = useCallback((e)=> {
    dispatch(incrementTab({"label":"Voucher","key":"3-5","id":`${e.data.id}`}));
    Router.push(`/accounts/vouchers/${e.data.id}`);
  }, []);

  useEffect(() => {
    const setData = async() => {
      let tempData = voucherData.result
      await tempData.forEach((x, i) => {
        x.no = i+1
        x.amount = x.Voucher_Heads?.reduce((x, cur) => x + Number(cur.amount), 0 ),
        x.date = moment(x.createdAt).format("YYYY-MM-DD")
      });
      setRowData(tempData);
      console.log(tempData)
    }
    setData();
  }, []);

  const getRowHeight = useCallback(() => {
    return 38;
  }, []);

  return (
  <div className='base-page-layout'>
    <Row>
      <Col><h5>Voucher Details</h5></Col>
      <Col>
        <button className='btn-custom right'
          onClick={()=>{
            dispatch(incrementTab({"label":"Voucher","key":"3-5","id":"new"}))
            Router.push(`/accounts/vouchers/new`)
          }}
        > Create </button>
      </Col>
    </Row>
    <hr/>
    <div className="ag-theme-alpine" style={{width:"100%", height:'72vh'}}>
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowData={rowData} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection='multiple' // Options - allows click selection of rows
        onCellClicked={cellClickedListener} 
        getRowHeight={getRowHeight}
      />
    </div>
  </div>
  );
};

export default App;