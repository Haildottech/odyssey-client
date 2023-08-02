import React, { useEffect, useState } from 'react';
import InputComp from '/Components/Shared/Form/InputComp';
import TextAreaComp from '/Components/Shared/Form/TextAreaComp';
import DateComp from '../../../Shared/Form/DateComp';
import SelectComp from '../../../Shared/Form/SelectComp';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import { Row, Col } from 'react-bootstrap';
import { Modal, Select } from 'antd';
import JobSearch from './JobSearch';
import { fetchJobsData, convetAsHtml } from './states';
import moment from 'moment';

const BlInfo = ({control, id, register, state, useWatch, dispatch, reset}) => {

  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b})
  const setAll = (obj) => dispatch({type:'set', payload:obj});
  const allValues = useWatch({control});

    const findNotifyParty = (id,content) => {
        state.partiesData.forEach((x)=>{
            if(id==x.id){
                set(content,convetAsHtml(x))
                set('updateContent',!state.updateContent)
            }
        })
    }

    const parseValues = (data) => {
        let tempVal = [];
        data.forEach((x) => {
            tempVal.push({
                value:x.id,
                label:x.name,
                code:x.code
            })
        })
        return tempVal
    }

  return (
    <div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
    <Row>
        <Col md={3}>
            <Row>
                <Col md={10}>
                <div className="" style={{lineHeight:1.35}}>Job No. *</div>
                <div className='dummy-input' onClick={()=>{id=="new"?fetchJobsData(set, dispatch):null}}>
                    {allValues.jobNo}
                </div>
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <InputComp register={register} name='hbl' control={control} label='HBL # *' width={150} disabled={true} />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <InputComp register={register} name='mbl' control={control} label='MBL #' width={150} />
                </Col>
            </Row>
        </Col>
        <Col md={2}>
            <Row>
                <Col md={12}>
                    <SelectComp register={register} name='status'control={control}label='Status' width={120}
                        options={[ 
                            {id:'Final', name:'Final'}, 
                            {id:'Draft', name:'Draft'} 
                        ]}
                    />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <DateComp register={register} name='hblDate'control={control}label='HBL Date' width={120} />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <DateComp register={register} name='mblDate'control={control}label='MBL Date' width={120} />
                </Col>
            </Row>
        </Col>
        <Col md={6}>
            <Row style={{border:'1px solid silver'}} className='pb-2 pt-1 mt-4'>
                <Col md={4}>
                    <SelectComp register={register} name='blReleaseStatus' control={control} label='Release Status' width={'100%'}
                        options={[ 
                            {id:'Original'        , name:'Original'        }, 
                            {id:'Surrender'       , name:'Surrender'       },
                            {id:'Hold'            , name:'Hold'            },
                            {id:'Bank Guarantee'  , name:'Bank Guarantee'  },
                            {id:'Do Null'         , name:'Do Null'         },
                            {id:'Auction'         , name:'Auction'         },
                            {id:'Telex Release'   , name:'Telex Release'   },
                            {id:'SeaWay Bill'     , name:'SeaWay Bill'     },
                            {id:'Express Release' , name:'Express Release' },
                            {id:'Without Document', name:'Without Document'}
                        ]}
                    />
                </Col>
                <Col md={4}>
                    <SelectComp register={register} name='blhandoverType' control={control} label='Handover Type' width={'100%'}
                        options={[ 
                            {id:'By Hand', name:'By Hand'}, 
                            {id:'Courier', name:'Courier'},
                            {id:'Email'  , name:'Email'  },
                            {id:'Fax'    , name:'Fax'    },
                            {id:'Telex'  , name:'Telex'  },
                        ]}
                    />
                </Col>
                <Col md={4}>
                    <div></div>
                    <SelectComp register={register} name='releaseInstruction' control={control} label='Instructions' width={'100%'}
                        options={[ 
                            {id:'Release', name:'Release'}, 
                            {id:'Stop', name:'Stop'}, 
                        ]}
                    />
                </Col>
                <Col md={12}>
                    <div className='mt-2'></div>
                    <TextAreaComp register={register} rows={1} name='remarks' control={control} label='Remarks'/>
                </Col>
            </Row>
        </Col>
        <Col md={12}><hr/></Col>
        <Col md={3} className=''>
            <Row className='pt-1'>
                <Col md={12}>
                <div className="" style={{lineHeight:1.35}}>Shipper *</div>
                <div className='dummy-input'>{allValues.shipper}</div>
                </Col>
                <Col md={12}>
                <div className="mt-2" style={{lineHeight:1.35}}>Consignee *</div>
                <div className='dummy-input'>{allValues.consignee}</div>
                </Col>
                <Col md={12}>
                    {/* <SelectSearchComp register={register} name='notifyPartyOneId' control={control} label='Notify Party #1z' width={'100%'}
                        options={state.partiesData} onChange={()=>console.log("Hello")}
                    /> */}
                    {/* <SelectSearchComp register={register} name='notifyPartyTwoId' control={control} label='Notify Party #2' width={'100%'}
                        options={state.partiesData}
                    /> */}
                    <div className='mt-2'>Notify Party #1 *</div>
                    <Select style={{minWidth:'100%'}}
                        onChange={(e)=>{
                            let tempState = {...allValues};
                            tempState.notifyPartyOneId = e;
                            reset(tempState);
                            findNotifyParty(tempState.notifyPartyOneId, 'notifyOneContent')
                        }} 
                        value={allValues.notifyPartyOneId} 
                        showSearch
                        optionFilterProp="children"
                        options={parseValues(state.partiesData)}
                        filterOption={(input, option) =>
                            ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
                            ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    <div className='mt-2'>Notify Party #2</div>
                    <Select style={{minWidth:'100%'}}
                        onChange={(e)=>{
                            let tempState = {...allValues};
                            tempState.notifyPartyTwoId = e;
                            reset(tempState);
                            findNotifyParty(tempState.notifyPartyTwoId, 'notifyTwoContent')
                        }} 
                        value={allValues.notifyPartyTwoId} 
                        showSearch
                        optionFilterProp="children"
                        options={parseValues(state.partiesData)}
                        filterOption={(input, option) =>
                            ((option?.label) ?? '').toLowerCase().includes(input.toLowerCase())||
                            ((option?.code) ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                    <div className="mt-2" style={{lineHeight:1.35}}>Vessel *</div>
                    <div className='dummy-input'>{allValues.vessel}</div>

                    <div className="mt-2" style={{lineHeight:1.35}}>Shipment Date</div>
                    <div className='dummy-input'>{moment(allValues.shipDate).format("DD-MM-YYYY")}</div>
                </Col>
            </Row>
        </Col>
        <Col md={7}>
            <div className='text-center'>Booking Info</div> 
            <Row style={{border:'1px solid silver'}} className='pb-3 pt-0'>
                <Col md={5}>
                <Row>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>POL</div>
                        <div className='dummy-input'>{allValues.pol}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>POFD</div>
                        <div className='dummy-input'>{allValues.pofd}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Final Dest.</div>
                        <div className='dummy-input'>{allValues.fd}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Commodity</div>
                        <div className='dummy-input'>{allValues.commodity}</div>
                    </Col>
                </Row>
                </Col>
                <Col md={7}>
                <Row>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Overseas Agent</div>
                        <div className='dummy-input'>{allValues.overseas_agent}</div>
                    </Col>
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>S/Line Carrier</div>
                        <div className='dummy-input'>{allValues.pol}</div>
                    </Col>
                    {/*
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Total Container</div>
                        <div className='dummy-input'>
                            {allValues.equip.map((x, i)=>{
                                return(<span key={i}>{x.qty} X {x.size}</span>)
                            })
                            }
                        </div>
                    </Col>
                    */}
                    <Col md={12}>
                        <div className="mt-2" style={{lineHeight:1.35}}>Delivery</div>
                        <div className='dummy-input'>{allValues.delivery}</div>
                    </Col>
                </Row>
                </Col>
            </Row>
        </Col>
    </Row>
    <Modal
        open={state.partyVisible} maskClosable={false}
        onOk={()=>set('partyVisible', false)}
        onCancel={()=>set('partyVisible', false)}
        width={800} footer={false} //centered={true}
    ><JobSearch state={state} useWatch={useWatch} dispatch={dispatch} control={control} reset={reset} />    
    </Modal>
    </div>
  )
}

export default BlInfo