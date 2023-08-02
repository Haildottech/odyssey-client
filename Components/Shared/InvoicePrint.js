import React, { useEffect } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import moment from "moment";
import ports from "/jsonData/ports";
import inWords from '../../functions/numToWords';
import parse from "html-react-parser";
import Cookies from 'js-cookie';

const InvoicePrint = ({records, invoice, calculateTotal}) => {

    const getPort = (id) => {
        const index = ports.ports.findIndex(element => element.id == id);
        let value = "";
        if(index>-1){
            value = ports.ports[index].name;
            let str;
            let ourSubstring = "(";
            str = value.indexOf(ourSubstring);
            value = value.slice(0,str-1)
        }
        return value
    }

    const paraStyles = { lineHeight:1.2, fontSize:11 }
    const heading = { lineHeight:1, fontSize:11, fontWeight:'800', paddingBottom:5 };
    const Line = () => <div style={{backgroundColor:"black", height:3, position:'relative', top:12}}></div>
    const border = "1px solid black";

  return (
    <div className='p-5'>
    <Row>
        <Col md={4} className='text-center'>
            <img src={'/seanet-logo.png'} style={{filter: `invert(0.5)`}} height={100} />
            <div>SHIPPING & LOGISTICS</div>
        </Col>
        <Col>
        <div className='text-center '>
            <div style={{fontSize:20}}><b>SEA NET SHIPPING & LOGISTICS</b></div>
            <div style={paraStyles}>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
            <div style={paraStyles}>Tel: 9221 34395444-55-66   Fax: 9221 34385001</div>
            <div style={paraStyles}>Email: info@seanetpk.com   Web: www.seanetpk.com</div>
            <div style={paraStyles}>NTN # 8271203-5</div>
        </div>
        </Col>
    </Row>
    <Row>
        <Col md={5}><Line/></Col>
        <Col md={2}><p className='text-center fs-15'><strong>{invoice.type}</strong></p></Col>
        <Col md={5}><Line/></Col>
    </Row>
    <Row style={{paddingLeft:12, paddingRight:12}}>
        <Col md={6} style={{borderTop:border, borderRight:border, borderLeft:border, borderBottom:border, maxHeight:70, overflow:'hidden'}} className='p-0 px-1'>
            <div style={heading}>INVOICE TO</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.name}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.address1}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.infoMail}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.telephone1}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.mobile1}</div>
        </Col>
        <Col md={6} style={{  borderTop:border, borderBottom:border, borderRight:border, maxHeight:70, overflow:'hidden'}} className='p-0 px-1'>
        <div style={heading}>Shipper/Consignee</div>
            <div style={paraStyles}>{invoice.SE_Job.consignee?.name}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.address1}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.infoMail}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.telephone1}</div>
            <div style={paraStyles}>{invoice.SE_Job.Client?.mobile1}</div>
        </Col>
    </Row>
    <Row style={{paddingLeft:12, paddingRight:12}}>
        <Col md={6} style={{borderRight:border, borderLeft:border, borderBottom:border}} className='p-0 px-1'>
            <span style={heading}>Reference No.</span>
            
        </Col>
        <Col md={6} style={{borderRight:border, borderBottom:border}} className='p-0 px-1'>
            <span style={heading}>Sales Rep</span>
            <span style={{...paraStyles, paddingLeft:70}}>{invoice.SE_Job.sales_representator?.name}</span>
        </Col>
    </Row>
    <Row style={{paddingLeft:12, paddingRight:12}}>
        <Col md={6} style={{borderRight:border, borderLeft:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>MBL No.</div>
                    <div style={paraStyles}>{invoice.SE_Job?.Bl?.mbl}</div>
                </Col>
                <Col md={5}>
                    <div style={heading}>Bill of Lading</div>
                    <div style={paraStyles}>{invoice.SE_Job?.Bl?.hbl}</div>
                </Col>
            </Row>
        </Col>
        <Col md={6} style={{borderRight:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Job No</div>
                    <div style={paraStyles}>{invoice.SE_Job.jobNo}</div>
                    
                </Col>
                <Col md={5}>
                    <div style={heading}>Job Date</div>
                    <div style={paraStyles}>{moment(invoice.SE_Job.jobDate).format("DD-MMM-YYYY")}</div>
                </Col>
            </Row>
        </Col>
    </Row>
    <Row style={{paddingLeft:12, paddingRight:12}}>
        <Col md={6} style={{borderRight:border, borderLeft:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Vessel / Voyage</div>
                    <div style={paraStyles}>{invoice.SE_Job?.vessel?.name} / {invoice.SE_Job?.Voyage?.voyage}</div>
                </Col>
                <Col md={5}>
                    <div style={heading}>Sailing Date</div>
                    <div style={paraStyles}>{moment(invoice.SE_Job?.Voyage?.exportSailDate).format("DD-MMM-YYYY")}</div>
                </Col>
            </Row>
        </Col>
        <Col md={6} style={{borderRight:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Invoice No</div>
                    <div style={paraStyles}>{invoice.invoice_No}</div>
                    
                </Col>
                <Col md={5}>
                    <div style={heading}>Invoice Date</div>
                    <div style={paraStyles}>{moment(invoice.createdAt).format("DD-MMM-YYYY")}</div>
                </Col>
            </Row>
        </Col>
    </Row>
    <Row style={{paddingLeft:12, paddingRight:12}}>
        <Col md={6} style={{borderRight:border, borderLeft:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Port of Loading</div>
                    <div style={paraStyles}>{getPort(invoice.SE_Job.pol)}</div>
                </Col>
                <Col md={5}>
                    <div style={heading}>Port of Discharge</div>
                    <div style={paraStyles}>{getPort(invoice.SE_Job.pod)}</div>
                </Col>
            </Row>
        </Col>
        <Col md={6} style={{borderRight:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Destination Port</div>
                    <div style={paraStyles}>{getPort(invoice.SE_Job.fd)}</div>
                </Col>
                <Col md={5}>
                    <div style={heading}>Shipping Line</div>
                    <div style={paraStyles}>{invoice.SE_Job.shipping_line?.name}</div>
                </Col>
            </Row>
        </Col>
        <Col md={6} style={{borderRight:border, borderLeft:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={4}>
                    <div style={heading}>Volume</div>
                    <div style={paraStyles}>{parseFloat(invoice.SE_Job.vol).toFixed(2)}</div>
                </Col>
                <Col md={4}>
                    <div style={heading}>Weight</div>
                    <div style={paraStyles}>{invoice.SE_Job.weight?parseFloat(invoice.SE_Job.weight).toFixed(2):"0.00"}</div>
                </Col>
                <Col md={4}>
                    <div style={heading}>PCS</div>
                    <div style={paraStyles}>{invoice.SE_Job.pcs}</div>
                </Col>
            </Row>
        </Col>
        <Col md={6} style={{borderRight:border, borderBottom:border}} className='p-1'>
            <Row>
                <Col md={7}>
                    <div style={heading}>Currency</div>
                    <div style={paraStyles}>{invoice.type=="Job Invoice"?"PKR":invoice.type=="Job Bill"?"PKR":"USD"}</div>
                    
                </Col>
                <Col md={5}>
                    <div style={heading}>Exchange Rate</div>
                    <div style={paraStyles}>{records.length>0?records[0].ex_rate:''}</div>
                </Col>
            </Row>
        </Col>
        <Col md={12} style={{border:'1px solid silver'}} className=''>
            <Row>
                <Col md={12}>
                    {/*<>
                        <span style={heading}>Container #</span>
                        <span className='mx-1' style={paraStyles}>1X40</span>
                        <span className='mx-1' style={paraStyles}>FCIU8538841</span>
                    </>*/}
                </Col>
            </Row>
        </Col>
    </Row>
    <Table className='pb-0 mb-0' bordered variant='white' size='sm'>
    <thead className='p-0 m-0'>
        <tr className='p-0 m-0' style={{border:'1px solid black', backgroundColor:'silver', fontSize:9, color:"black"}}>
        <td className='p-0 text-center fw-6'>Sr.         </td>
        <td className='p-0 text-center fw-6'>Charges     </td>
        <td className='p-0 text-center fw-6'>Qty         </td>
        <td className='p-0 text-center fw-6'>Rate        </td>
        <td className='p-0 text-center fw-6'>Curr        </td>
        <td className='p-0 text-center fw-6'>Amount      </td>
        <td className='p-0 text-center fw-6'>Dis         </td>  
        <td className='p-0 text-center fw-6'>Tax         </td>  
        <td className='p-0 text-center fw-6'>Total Amount</td>  
        </tr>
    </thead>
    <tbody>
    {records.map((x, index) => {
    return (
    <tr key={index} className='table-row-center-singleLine' style={{border:'1px solid black', fontSize:9}}>
        <td className='text-center p-0'>{index + 1}</td>
        <td className='text-center p-0'>{x.particular}</td>
        <td className='text-center p-0'>{x.qty}</td>
        <td className='text-center p-0'>{x.amount}</td>
        <td className='text-center p-0'>{x.currency}</td>
        <td className='text-center p-0'>{x.amount}</td>
        <td className='text-center p-0'>{x.discount}</td>
        <td className='text-center p-0'>{x.tax_amount}</td>
        <td className='text-center p-0'>{x.local_amount}</td>
    </tr>
    )})}
    </tbody>
    </Table>
    <Row style={{borderRight:border, borderLeft:border, borderBottom:border}} className='mx-0 pt-1'>
    <Col md={4} style={{fontSize:10}}><b className='fw-8'>Total Discount</b> <span style={{float:'right'}} className='px-3'>0.00</span></Col>
    <Col md={4} style={{fontSize:10}}><b className='fw-8'>Tax Amount</b>     <span style={{float:'right'}} className='px-3'>0.00</span></Col>
    <Col md={4} style={{fontSize:10}}>
        <div><b className='fw-8'>Invoice Total {"("}PKR{")"}</b> <span style={{float:'right'}}>{(calculateTotal(records))}</span></div>
        <div><b className='fw-8'>Round Off </b> <span style={{float:'right'}} >{invoice.roundOff}</span></div>
        <div><b className='fw-8'>Total Amount </b> <span style={{float:'right'}} >{((parseFloat(invoice.total) + parseFloat(invoice.roundOff)).toFixed(2))}</span></div>
    </Col>
    </Row>
    <Row className='mx-0'>
        <Col md={6} className='p-1' style={{borderRight:border, borderLeft:border, borderBottom:border, fontSize:12}}>
            <b className='fw-8'>Note</b>
            <div style={{minHeight:60, lineHeight:1}} >
                {invoice?.note?.length>40 && 
                <div className="bl-print" style={{color:'black', whiteSpace:'pre-wrap'}}>{invoice.note}</div>
                }
            </div>
        </Col>
        <Col md={6} className='p-1' style={{borderRight:border, borderBottom:border, fontSize:12}}>
            <b className='fw-8'>In-Words</b>
            <p>{invoice.type=="Job Invoice"?"PKR":invoice.type=="Job Bill"?"PKR":"USD"} {inWords(parseFloat(calculateTotal(records)))}</p>
        </Col>
    </Row>
    <Row className='mx-0'>
        <Col md={6} className='p-1' style={{borderRight:border, borderLeft:border, borderBottom:border}}>
            <b className='fw-8' style={{fontSize:12}}>Bank Details</b>
            <div style={{fontSize:12, lineHeight:1.5}}>
                IBAN: PK08 BAHL 1054 0081 0028 1201<br/>
                A/C #: 1054-0081-002182-01-5<br/>
                TITLE: SEANET SHIPPING & LOGISTICS<br/>
                BANK: BANL AL HABIB LIMITED<br/>
                BRANCH: TARIQ ROAD 1054, KARACHI<br/>
                SWIFT: BAHLPKKAXXX
            </div>
        </Col>
    </Row>
    <div style={{position:'fixed', bottom:30, width:'90vw'}}>
        <Row className='justify-content-center'>
            <Col md={4} className='fs-10'></Col>
            <Col md={4} className='fs-10'></Col>
            <Col md={4} className='text-center'>
                <div>____________________</div>
                <div className='fs-12 px-5'><b>SEAN NET SHIPPING {"&"} LOGISTICS</b></div>
            </Col>
        </Row>
    </div>
    <div style={{position:'fixed', bottom:30, width:'90vw'}}>
        <Row className='justify-content-center'>
            <Col md={4} className='fs-10'>Printed On: <span className='mx-2'>{moment().format("DD / MMM / YYYY")}</span></Col>
            <Col md={4} className='fs-10'>Printed By: {Cookies.get("username")}</Col>
            <Col md={4} className=''>
            </Col>
        </Row>
    </div>
    </div>
  )
}

export default InvoicePrint