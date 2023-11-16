import moment from 'moment';
import ReactToPrint from 'react-to-print';
import { Spinner, Table } from "react-bootstrap";
import React, { useEffect, useState, useRef } from 'react';
import PrintTopHeader from '../../../Shared/PrintTopHeader';
import Cookies from "js-cookie";
import { AiFillPrinter } from "react-icons/ai";

const JobBalancingReport = ({result, query}) => {

    let inputRef = useRef(null);
    const [ load, setLoad ] = useState(true);
    const [ records, setRecords ] = useState([]);
    const [username, setUserName] = useState("");

    const commas = (a) => a? parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,", ") : '0.0';

    const getTotal = (type, list) => {
        let result = 0.00;
        list.forEach((x)=>{
          if(type==x.payType){
            result = result + x.total
         }
        })
        return commas(result);
    }

    const paidReceivedTotal = (list) => {
        let paid = 0.00, Received = 0.00, total = 0.00;
        list.forEach((x)=>{
          if(x.payType=="Payble"){
            paid = paid + parseFloat(x.paid)
          } else {
            Received = Received + parseFloat(x.recieved)
        }
    })
        total = Received - paid
        return total>0?commas(total):`(${commas(total*-1)})`;
    }

    const balanceTotal = (list) => {
        let balance = 0.00;
        list.forEach((x)=>{
            if(x.payType=="Payble"){
                balance = balance - parseFloat(x.balance)
            } else {
                balance = balance + parseFloat(x.balance)
            }
        })
        return balance>0?commas(balance):`(${commas(balance*-1)})`;
    }

    const getAge = (date) => {
        let date1 = new Date(date);
        let date2 = new Date();
        let difference = date2.getTime() - date1.getTime();
        return parseInt(difference/86400000)
    }

    useEffect(() => { 
        getValues(result);
        getUserName();
        async function getUserName(){
          let name = await Cookies.get("username");
          setUserName(name)
        }
    }, [])

    async function getValues(value){
        if(value.status=="success") {
            let newArray = [...value.result];
            await newArray.forEach((y)=>{
                y.balance = y.payType=="Recievable"?
                    (parseFloat(y.total) + parseFloat(y.roundOff) - parseFloat(y.recieved))/ parseFloat(y.ex_rate):
                    (parseFloat(y.total)+parseFloat(y.roundOff) - parseFloat(y.paid)) / parseFloat(y.ex_rate);
                y.total = (parseFloat(y.total) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                y.paid = (parseFloat(y.paid) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                y.recieved = (parseFloat(y.recieved) / parseFloat(y.ex_rate))+parseFloat(y.roundOff)
                y.age = getAge(y.createdAt)
            })
            setRecords(newArray);
        } else {
                    
        }
        setLoad(false)
    }

    const TableComponent = () => {
     return(
      <>
        {!load&&
        <div>
            {records.length>0 &&
            <>
                <PrintTopHeader company={query.company} />
                <hr className='mb-2' />
                <div className='table-sm-1' style={{maxHeight:600, overflowY:'auto'}}>
                <Table className='tableFixHead' bordered style={{fontSize:12}}>
                    <thead>
                        <tr>
                            <th className='text-center'>Inv. No</th>
                            <th className='text-center'>Date</th>
                            <th className='text-center'>HBL/HAWB</th>
                            <th className='text-center'>Name</th>
                            <th className='text-center'>F. Dest</th>
                            <th className='text-center'>F/Tp</th>
                            <th className='text-center'>Curr</th>
                            <th className='text-center'>Debit</th>
                            <th className='text-center'>Credit</th>
                            <th className='text-center'>Paid/Rcvd</th>
                            <th className='text-center'>Balance</th>
                            <th className='text-center'>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((x, i) => {
                            return(
                            <tr key={i}>
                                <td style={{}}>{x.invoice_No}</td>
                                <td style={{}}>{moment(x.createdAt).format("DD-MMM-YYYY")}</td>
                                <td style={{}}>{x?.SE_Job?.Bl?.hbl}</td>
                                <td style={{}}>{x.party_Name}</td>
                                <td style={{}}>{x?.SE_Job?.fd}</td>
                                <td style={{}}>{x?.SE_Job?.freightType=="Prepaid"?"PP":"CC"}</td>
                                <td style={{}}>{x.currency}</td>
                                <td style={{textAlign:'right'}} >{x.payType=="Recievable"?commas(x.total):"-"}</td>
                                <td style={{textAlign:'right'}} >{x.payType!="Recievable"?commas(x.total):"-"}</td>
                                <td style={{textAlign:'right'}} >{commas(x.payType=="Recievable"?x.recieved:x.paid)}</td>
                                <td style={{textAlign:'right'}} >{x.payType!="Recievable"?`(${commas(x.balance)})`:commas(x.balance)}</td>
                                <td style={{textAlign:'center'}}>{x.age}</td>
                            </tr>
                        )})}
                        <tr>
                            <td colSpan={7} style={{textAlign:'right'}}><b>Total</b></td>
                            <td style={{textAlign:'right'}}>{getTotal("Recievable", records)}</td>
                            <td style={{textAlign:'right'}}>{getTotal("Payble", records)}</td>
                            <td style={{textAlign:'right'}}>{paidReceivedTotal(records)}</td>
                            <td style={{textAlign:'right'}}>{balanceTotal(records)}</td>
                            <td style={{textAlign:'center'}}>-</td>
                        </tr>
                    </tbody>
                </Table>
                </div>
            </>
            }
            {records.length==0 && <>No Similar Record</>}
        </div>
        }
        {load && <div className='text-center py-5 my-5'> <Spinner/> </div>}
      </>
    )}

  return (
    <div className='base-page-layout'>
    <ReactToPrint content={()=>inputRef} trigger={()=><AiFillPrinter className="blue-txt cur fl-r" size={30} />} />
    <TableComponent  />
    <div style={{display:'none'}}>
      <div className="pt-5 px-3" ref={(response)=>(inputRef=response)}>
        <TableComponent size={'sm'} />
        <div style={{position:'absolute', bottom:10}}>Printed On: {`${moment().format("YYYY-MM-DD")}`}</div>
        <div style={{position:'absolute', bottom:10, right:10}}>Printed By: {username}</div>
      </div>
    </div>
    </div>
  )
}

export default JobBalancingReport