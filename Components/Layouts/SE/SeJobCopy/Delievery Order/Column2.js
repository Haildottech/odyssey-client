import React from 'react'
import InputComp from "../../../../Shared/Form/InputComp";
import TextAreaComp from "../../../../Shared/Form/TextAreaComp";
import RadioComp  from "../../../../Shared/Form/RadioComp";
import { landigFlagStatus  } from "./states";
import ports from "../../../../../jsonData/ports.json"
import { Col, Row } from 'react-bootstrap';
import SelectSearchComp from "../../../../Shared/Form/SelectSearchComp";
import DateComp from "../../../../Shared/Form/DateComp";
import TimeComp from "../../../../Shared/Form/TimeComp";
 
const Column2 = ({register, control, state, jobData}) => {
  let deliverTo = jobData.consigneeId && state.fields.party.consignee.filter((x) => x.id == jobData.consigneeId)
  return (

      <Row className="fs-12">
      <Col md={4}>
      <Col>
      <SelectSearchComp width="100%" name="clearing_agent" options={[]} control={control} register={register} label="Clearing Agent"/>
      </Col>
      <Col md={12}>
      <div className='fs-12'>Deliver To</div>
      <div style={{border:'1px solid silver', padding:"7px 1px 4px 4px"}}>{deliverTo[0].name}</div>
      </Col>
      <Col className='mt-1'>
      <TextAreaComp width="100%" name="on_account_of" control={control} register={register} label="On Account Of"/>
      </Col>
      <Col className='mt-1'>
      <InputComp width="100%" name="name" control={control} register={register} label="Name"/>
      </Col>
      <Col className='mt-1'>
      <InputComp width="100%" name="print_by" control={control} register={register} label="Print By"/>
      </Col>
      </Col>

      <Col md={4}>
     
      <Col>
      <SelectSearchComp width="100%" name="local_cutom" options={[]} control={control} register={register} label="Local Custom"/>
      </Col>
      <Col className='mt-1'>
      <TextAreaComp width="100%" name="delivery_req" control={control} register={register} label="Delivery Req To"/>
      </Col>

      <Row>
      <Col md={6}>
      <InputComp label={"CNIC No"} name="cnic_no" register={register} control={control}/>
      </Col>
      <Col md={6}>
      <DateComp name="expire_date" label="Expiry Date" control={control} register={register}/>
      </Col>
      <Col md={12}>
      <InputComp label={"Mobile No"} name="Mobile No" register={register} control={control}/>
      </Col>
      </Row>

      <Col className='mt-1'>
      <InputComp  register={register} name="remarks" label="Remarks" control={control} />
      </Col>
      <Col className='mt-1'>
      <SelectSearchComp width="100%" options={[]} register={register} name="return_at" label="Return At" control={control} />
      </Col>
      </Col>

      </Row>
 
  )
}

export default Column2