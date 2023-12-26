import React, { useEffect } from 'react';
import { Col, Row, Table } from "react-bootstrap";
import moment from 'moment';

const VoucherPrint = ({ compLogo, voucherData }) => {

    const paraStyles = { lineHeight: 1.2, fontSize: 11 }
    const heading = { lineHeight: 1, fontSize: 11, fontWeight: '800', paddingBottom: 5 };
    const Line = () => <div style={{ backgroundColor: "grey", height: 1, position: 'relative', top: 12 }}></div>
    const border = "1px solid black";
    const fomratedDate = moment(voucherData.createdAt).format("yyyy-MM-DD");
    const commas = (a) => a < 1 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")

    useEffect(() => {
        console.log(voucherData)
    }, []);


    return (
        <div className='pb-5 px-5 pt-4'>
            <Row>
                <Col md={4} className='text-center'>
                    {compLogo == "1" &&
                        <>
                            <img src={'/public/seanetLogo.png'} style={{ filter: `invert(0.5)` }} height={100} />
                            <div>SHIPPING & LOGISTICS</div>
                        </>
                    }
                    {compLogo == "2" &&
                        <>
                            <img src={'/public/aircargo-logo.png'} style={{ filter: `invert(0.5)` }} height={100} />
                        </>
                    }
                </Col>
                <Col>
                    <div className='text-center '>
                        <div style={{ fontSize: 20 }}><b>{compLogo == "1" ? "SEA NET SHIPPING & LOGISTICS" : "AIR CARGO SERVICES"}</b></div>
                        <div style={paraStyles}>House# D-213, DMCHS, Siraj Ud Daula Road, Karachi</div>
                        <div style={paraStyles}>Tel: 9221 34395444-55-66   Fax: 9221 34385001</div>
                        <div style={paraStyles}>Email: {compLogo == "1" ? "info@seanetpk.com" : "info@acs.com.pk"}   Web: {compLogo == "1" ? "www.seanetpk.com" : "www.acs.com.pk"}</div>
                        <div style={paraStyles}>NTN # {compLogo == "1" ? "8271203-5" : "0287230-7"}</div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md={5}><Line /></Col>
                <Col md={2}>
                    <div className='text-center fs-15' style={{ whiteSpace: 'nowrap' }}>
                        <strong>
                            {
                                voucherData.vType == "SI" ?
                                    "Settlemen Inovice" :
                                    voucherData.vType == "PI" ?
                                        "Payble Inovice" :
                                        voucherData.vType == "JV" ?
                                            "General Voucher" :
                                            voucherData.vType == "BPV" ?
                                                "Bank Payment Voucher" :
                                                voucherData.vType == "BRV" ?
                                                    "Bank Recieve Voucher" :
                                                    voucherData.vType == "CRV" ?
                                                        "Cash Recieve Voucher" :
                                                        voucherData.vType == "CPV" ?
                                                            "Cash Payment Voucher" :
                                                            "Undefined Type"
                            }
                        </strong>
                    </div>
                </Col>
                <Col md={5}><Line /></Col>
            </Row>
            <Row className='my-2'>
                <Col md={4}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className=' mt-2 me-2 font-bold'>Voucher  # :</label>
                        <input
                            readOnly
                            style={{ outline: "none" }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                            defaultValue={voucherData.voucher_Id}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className=' mt-2 font-bold'>Source No # :</label>
                        <input
                            readOnly
                            style={{ outline: "none" }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className='mt-2 font-bold'>Date # :</label>
                        <input
                            readOnly
                            style={{ outline: "none" }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                            defaultValue={fomratedDate}
                        />
                    </div>
                </Col>
            </Row>
            <Row className='my-2 '>
                <Col md={8}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className='mt-2  font-bold'>Cheque No :</label>
                        <input
                            readOnly
                            style={{ outline: "none", }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                            defaultValue={voucherData.chequeNo ? voucherData.chequeNo : ""}
                        />
                    </div>
                </Col>
                <Col md={4}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className='mt-2 font-bold'>Cheque Date :</label>
                        <input
                            readOnly
                            style={{ outline: "none" }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                            defaultValue={voucherData.chequeDate ? voucherData.chequeDate : ""}
                        />
                    </div>
                </Col>
            </Row>
            <Row className='my-2 '>
                <Col md={8}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className=' mt-2 font-bold'>Pay to :</label>
                        <input
                            readOnly
                            style={{ outline: "none" }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                            defaultValue={voucherData.payTo ? voucherData.payTo : ""}
                        />
                    </div>
                </Col>
                <Col md={4}></Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div className='d-flex justify-content-start px-2 fs-12'>
                        <label className='mt-2 font-bold'>Narration :</label>
                        <input
                            readOnly
                            style={{ outline: "none", width: "80%", }}
                            type='text'
                            className='px-2 mx-2 border-top-0 border-start-0 border-end-0'
                        />
                    </div>
                </Col>
            </Row>
            <div className='mt-3' style={{ maxHeight: 500, overflowY: 'auto' }}>
                <Table className='tableFixHead'>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Head of Account</th>
                            <th>Cost Center</th>
                            <th>Debit</th>
                            <th>Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {voucherData.Voucher_Heads.map((x, index) => {
                            return (
                                <tr key={index} className='f'>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className=''>{x.narration}</span>
                                    </td>
                                    <td>
                                        <span className=''>{"KHI"}</span>
                                    </td>
                                    <td>
                                        <span className=''>{commas(x.amount)}</span>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default VoucherPrint