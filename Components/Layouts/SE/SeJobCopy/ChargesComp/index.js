import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Tabs } from 'antd';
import Charges from './Charges';
import { getHeadsNew } from '../states';
import { useSelector } from 'react-redux';

const ChargesComp = ({state, dispatch}) => {
  const companyId = useSelector((state) => state.company.value);
  useEffect(() => {
    if(state.tabState=='4'){
      dispatch({type:'toggle', fieldName:'chargeLoad', payload:true})
      getHeadsNew(state.selectedRecord.id, dispatch);
    }
  }, [state.selectedRecord, state.tabState])

  const { register, control, handleSubmit, reset, trigger, setError } = useForm({
    // defaultValues: {};
  });
  const { fields, append, remove } = useFieldArray({
      control,
      name: "chargeList"
  });
  const chargeList = useWatch({ control, name: 'chargeList' });
  useEffect(() => {
   reset({chargeList:[ ...state.reciveableCharges, ...state.paybleCharges ]})
  }, [state.reciveableCharges, state.paybleCharges])
    
  return (
    <>
    <div style={{minHeight:525, maxHeight:525}}>
      <Tabs defaultActiveKey="1" onChange={(e)=> dispatch({type:'toggle', fieldName:'chargesTab',payload:e})}>
      <Tabs.TabPane tab="Recievable" key="1">
        <Charges state={state} dispatch={dispatch} chargeType={state.reciveableCharges} type={"Recievable"} 
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} register={register}
          companyId={companyId}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Payble" key="2">
        <Charges state={state} dispatch={dispatch} chargeType={state.paybleCharges} type={"Payble"} 
          chargeList={chargeList} fields={fields} append={append} reset={reset} control={control} register={register}
          companyId={companyId}
        />
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

export default ChargesComp