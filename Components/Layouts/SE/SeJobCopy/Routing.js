import React from 'react';
import InputComp from '../../../Shared/Form/InputComp';
import { Row, Col } from 'react-bootstrap';
import SelectSearchComp from '../../../Shared/Form/SelectSearchComp';
import DateComp from '../../../Shared/Form/DateComp';
import ports from "/jsonData/ports";

const Routing = ({register, control, errors, state, useWatch}) => {
    const Space = () => <div className='mt-2'/>
  return (
    <>
    <Row>
        <Col md={4}>
            <SelectSearchComp register={register} name='pol' control={control} label='Port Of Loading' width={300}
                options={ports.ports}
            />
            <Space/>
        </Col>
        <Col md={6} style={{paddingTop:29}}> 
            <DateComp register={register} name='polDate' control={control} label='' /> <Space/>
        </Col>
        <Col md={4}>
            <SelectSearchComp register={register} name='pod' control={control} label='Port Of Discharge' width={300}
                options={ports.ports} /> <Space/>
        </Col>
        <Col md={6} style={{paddingTop:29}}> 
            <DateComp register={register} name='podDate' control={control} label='' /> <Space/>
        </Col>
        <Col md={12}>
            <SelectSearchComp register={register} name='fd' control={control} label='Final Destination' width={300}
                options={ports.ports} /> <Space/>
        </Col>
        <Col md={3} className='my-1'>
            <InputComp register={register} name='freightPaybleAt' control={control} label='Freight Payble At' width={300} /> <Space/>
        </Col>
        <Col md={12}>
            <SelectSearchComp register={register} name='terminal' control={control} label='Terminal' width={300}
                options={[  
                    {id:'Direct', name:'Direct'},
                ]}
            /> <Space/>
        </Col>
        <Col md={12}>
            <SelectSearchComp register={register} name='delivery' control={control} label='Delivery' width={300}
                options={[  
                    {id:'CY/CY', name:'CY/CY'},
                ]}
            /> <Space/>
        </Col>
        <div style={{minHeight:258}}></div>
    </Row>
    </>
  )
}

export default Routing