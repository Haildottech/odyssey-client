import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import React, { useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Tabs } from 'antd';
import Charges from './Charges';
import { getHeadsNew, setHeadsCache } from '../states';
import { useSelector } from 'react-redux';
import { getChargeHeads } from "/apis/jobs";
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

const ChargesComp = ({state, dispatch, type, allValues}) => {

  const companyId = useSelector((state) => state.company.value);

  const chargesData = useQuery({
    queryKey:["charges", {id:state.selectedRecord.id}], queryFn: () => getChargeHeads({id:state.selectedRecord.id}),
  })
  // useEffect(() => {
  //   if(state.tabState=='4'){
  //     dispatch({type:'toggle', fieldName:'chargeLoad', payload:true})
  //     getHeadsNew(state.selectedRecord.id, dispatch);
  //   }
  // }, [state.selectedRecord])

  const { register, control, handleSubmit, reset } = useForm({});
  const { fields, append, remove } = useFieldArray({
      control,
      name: "chargeList"
  });
  const chargeList = useWatch({ control, name: 'chargeList' });
  useEffect(() => {
    setHeadsCache(chargesData, dispatch, reset)
    console.log(chargesData.data)
    // chargesData.status=="success"?
    //   reset({chargeList:[ ...chargesData.data.reciveableCharges, ...chargesData.data.paybleCharges ]}):
    //   null
  }, [chargesData.status])

  //useEffect(() => {
  //  reset({chargeList:[ ...state.reciveableCharges, ...state.paybleCharges ]})
  //}, [state.reciveableCharges, state.paybleCharges])
    
  useEffect(() => {
    //console.log(chargeList)
    // let obj = [...chargeList];
    // queryClient.setQueryData(
    //   ['charges', {id:state.selectedRecord.id}],
    //   (x) => x?{...x,result:obj}:x
    // )
    //console.log(state.payble);
    
    // console.log(chargeList);
    // let paybleCharges = [];
    // chargeList.map((x)=>{
    //   if(x.type=="Recievable"){
    //     paybleCharges.push(x)
    //   }
    // })
  }, [chargeList])

  return (
    <>
    <div style={{minHeight:525, maxHeight:525}}>
      <Tabs defaultActiveKey="1" onChange={(e)=> dispatch({type:'toggle', fieldName:'chargesTab',payload:e})}>
      <Tabs.TabPane tab="Recievable" key="1">
        {chargesData.status=="success" && <Charges state={state} dispatch={dispatch} type={"Recievable"} register={register}
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} 
          companyId={companyId} operationType={type} allValues={allValues} remove={remove}
        />}
        {chargesData.status!="success" && <div style={{textAlign:"center", paddingTop:'5%', paddingBottom:"5%"}}><Spinner/></div>}
      </Tabs.TabPane>
      <Tabs.TabPane tab="Payble" key="2">
        {chargesData.status=="success" && <Charges state={state} dispatch={dispatch} type={"Payble"} register={register}
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} 
          companyId={companyId} operationType={type} allValues={allValues} remove={remove}
        />}
        {chargesData.status!="success" && <div style={{textAlign:"center", paddingTop:'5%', paddingBottom:"5%"}}><Spinner/></div>}
      </Tabs.TabPane>
    </Tabs>
    <hr/>
    </div>
    <div className='px-3'>
    <Row className='charges-box' >
      <Col md={9}>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Recievable:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.reciveable.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
        <Row className='my-1'>
          <Col style={{maxWidth:100}} className="py-4">
            Payble:
          </Col>
          <Col>
            <div className='text-center'>PP</div>
            <div className="field-box p-1 text-end">
              {state.payble.pp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>CC</div>
            <div className="field-box p-1 text-end">
              {state.payble.cc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Tax</div>
            <div className="field-box p-1 text-end">
              {state.payble.tax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
          <Col>
            <div className='text-center'>Total</div>
            <div className="field-box p-1 text-end">
              {state.payble.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
          </Col>
        </Row>
      </Col>
      <Col md={2} className="py-4">
        <div className='text-center mt-3'>Net</div>
        <div className="field-box p-1 text-end">
          {(state.reciveable.total-state.payble.total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      </Col>
    </Row>
    </div>
    </>
  )
}

export default React.memo(ChargesComp)