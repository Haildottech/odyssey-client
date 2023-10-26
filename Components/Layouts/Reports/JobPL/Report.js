import { recordsReducer, initialState, companies, handleSubmit, plainOptions } from './states';
import React, { useReducer, useEffect, useRef, useState } from 'react';
import Sheet from './Sheet';
import PrintTopHeader from '../../../Shared/PrintTopHeader';
import Cookies from "js-cookie";
import ReactToPrint from 'react-to-print';
import { AiFillPrinter } from "react-icons/ai";
import moment from 'moment';

const Report = ({query}) => {

  const [ username, setUserName ] = useState("");

  let inputRef = useRef(null);

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

  return (
  <div className='base-page-layout'>
    <ReactToPrint content={()=>inputRef} trigger={()=><AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
    <TableComponent  />
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

export default Report