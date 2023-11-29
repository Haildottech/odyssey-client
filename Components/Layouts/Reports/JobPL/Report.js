import { recordsReducer, initialState, companies, handleSubmit, plainOptions } from './states';
import React, { useReducer, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Sheet from './Sheet';
import PrintTopHeader from '../../../Shared/PrintTopHeader';
import Cookies from "js-cookie";
import ReactToPrint from 'react-to-print';
import { AiFillPrinter } from "react-icons/ai";
import moment from 'moment';
import { Spinner } from "react-bootstrap";
import { AgGridReact } from 'ag-grid-react';

const Report = ({query}) => {

  const [ username, setUserName ] = useState("");
  let inputRef = useRef(null);
  const setCommas = (val) => {
    if(val){
        return val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
    }else{
        return 0
    }
  }

  const set = (obj) => dispatch({type:'set', payload:obj});
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    getValues();
    getUserName();
    async function getUserName(){
      let name = await Cookies.get("username");
      setUserName(name)
    }
  }, [])

  async function getValues(){
    await set(query);
    handleSubmit(set,state)
  }

  const TableComponent = () => {
    return(
    <>
      <PrintTopHeader company={query.company} />
      <hr className='mb-2'/>
      <Sheet state={state}/>
    </>
    )
  }

  const gridRef = useRef(); 
  const [columnDefs, setColumnDefs] = useState([
      //{headerName: '#', field:'no', width: 50 },
      {headerName: 'Job No', field:'jobNo', width:120, filter: true},
      {headerName: 'Date', field:'createdAt', width:70, filter: true,
        cellRenderer: params => {
        return <>
          {moment(params.value).format("MM/DD/YY")}
        </>;
        }
      },
      {headerName: 'Client', field:'hbl', filter: true,
        cellRenderer: params => {
          return <>
            {params.data.Client.name}
          </>;
        }
      },
      {headerName: 'F. Dest', field:'fd', width:100, filter: true},
      {headerName: 'Weight', field:'fd', width:10, filter: true},
      {headerName: 'Volume', field:'ppcc', width:0, filter: true},
      {headerName: 'Revenue', field:'revenue', filter: true,
        cellRenderer: params => {
          return <>
            {setCommas(params.value)}
          </>;
        }
      },
      {headerName: 'Cost', field:'cost', filter: true,
        cellRenderer: params => {
          return <>
            {setCommas(params.value)}
          </>;
        }
      },
      {headerName: 'P/L', field:'actual', filter: true,
        cellRenderer: params => {
          return <span>
            {setCommas(params.value)}
          </span>;
        }
      },
      {headerName: 'Gain/Loss', field:'gainLoss', filter: true,
        cellRenderer: params => {
          return <span style={{color:params.data.gainLoss<0?'crimson':'green'}}>
            {setCommas(params.value<0?params.value*-1:params.value)}
          </span>;
        }
      },
      {headerName: 'After Gain/Loss', field:'after', filter: true,
        cellRenderer: params => {
          return <span>
            {setCommas(params.value)}
          </span>;
        }
      }

  ]);
  
  const defaultColDef = useMemo( ()=> ({
      sortable: true,
      resizable: true,
  }));

  const getRowHeight = useCallback(() => {
      return 38;
  }, []);

  return (
  <div className='base-page-layout'>
    {query.report=="viewer" &&<>
    <ReactToPrint content={()=>inputRef} trigger={()=><AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
      {!state.load &&
        <>
          <PrintTopHeader company={query.company} />
          <hr className='mb-2'/>
          <Sheet state={state}/>
        </>
        }
      {state.load && <Spinner/>}
    </>
    }
    {query.report!="viewer" &&
    <div className="ag-theme-alpine" style={{width:"100%", height:'72vh'}}>
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowData={state.records} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection='multiple' // Options - allows click selection of rows
        getRowHeight={getRowHeight}
      />
    </div>
    }
    <div style={{display:'none'}}>
    <div className="pt-5 px-3" ref={(response)=>(inputRef=response)}>
      <TableComponent />
      <div style={{position:'absolute', bottom:10}}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
      <div style={{position:'absolute', bottom:10, right:10}}>Printed By: {username}</div>
    </div>
    </div>
  </div>
  )
}

export default React.memo(Report)