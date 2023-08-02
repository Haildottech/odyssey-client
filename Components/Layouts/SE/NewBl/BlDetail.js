import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Paragraph from '@tiptap/extension-paragraph'
import { Row, Col } from 'react-bootstrap';
import InputComp from '/Components/Shared/Form/InputComp';
import InputNumComp from '/Components/Shared/Form/InputNumComp';
import DateComp from '/Components/Shared/Form/DateComp';

const BlDetail = ({control, register, state, useWatch, dispatch}) => {
  const set = (a, b) => dispatch({type:'toggle', fieldName:a, payload:b});

  const Editor = (variable) => useEditor({
    extensions: [
      StarterKit,
      // CharacterCount.configure({
      //   limit: 10
      // }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'my-custom-paragraph'
        }
      }),
    ],
    autofocus: true,
    content: state[variable],
    onUpdate({ editor }) {
      set(variable, editor.getHTML())
    },
  },[state.updateContent])

  const partyDetail = {
    height:80,
    overflowY:'auto',
    padding:0
  }
  const allValues = useWatch({control})

return(
<div style={{height:600, overflowY:'auto', overflowX:'hidden'}}>
  <Row>
    <Col md={4}>
      <div>Shipper</div>
      <div className='brdr-grey'>
      <EditorContent editor={Editor('shipperContent')} style={partyDetail} />
      </div>
    </Col>
    <Col md={4}>
      <div>Consignee</div>
      <div className='brdr-grey'>
      <EditorContent editor={Editor('consigneeContent')} style={partyDetail} />
      </div>
    </Col>
    <Col md={4} style={{paddingRight:20}}>
      <div>Notify One</div>
      <div className='brdr-grey'>
      <EditorContent editor={Editor('notifyOneContent')} style={partyDetail} />
      </div>
    </Col>
    <Col md={4} className='mt-2'>
      <div>Notify Two</div>
      <div className='brdr-grey'>
      <EditorContent editor={Editor('notifyTwoContent')} style={partyDetail} />
      </div>
    </Col>
    <Col md={4} className='mt-2'>
      <div>Delivery Agent</div>
      <div className='brdr-grey'>
      <EditorContent editor={Editor('deliveryContent')} style={partyDetail} />
      </div>
    </Col>
  </Row>
  <hr className='my-2 mb-1' />
  <Row>
    <Col md={3}>
      <Row className='pt-1'>
        <Col md={12}>
          <InputComp register={register} name='polTwo' control={control} label='Port of Loading' width={150} />
        </Col>
        <Col md={12} className='mt-2'>
          <InputComp register={register} name='podTwo' control={control} label='Port of Discharge' width={150} />
        </Col>
        <Col md={12} className='mt-2'>
          <InputComp register={register} name='poDeliveryTwo' control={control} label='Port of Delivery' width={150} />
        </Col>
        <Col md={12} className='mt-2'>
          <InputComp register={register} name='AgentStamp' control={control} label='Agent Stamp' width={150} />
        </Col>
      </Row>
    </Col>
    <Col md={3}>
    <Row>
      <Col md={7} className='mt-1'>
        Freight Type
        <div className='dummy-input'>{allValues.freightType}</div>
      </Col>
      <Col md={5} className='mt-1'>
        Unit
        <div className='dummy-input'>{allValues.wtUnit}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <div>Net WT</div>
        <div className='dummy-input'>{allValues.net}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <div>Gross WT</div>
        <div className='dummy-input'>{allValues.gross}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <div>Tare WT</div>
        <div className='dummy-input'>{allValues.tare}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <div>CBM</div>
        <div className='dummy-input'>{allValues.cbm}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='agentM3' control={control} label='Agent M3' width={"100%"} />
      </Col>
      <Col md={6} className='mt-2'>
        <InputNumComp register={register} name='coloadM3' control={control} label='Coload M3' width={"100%"} />
      </Col>
      <Col md={6} className='mt-2'>
        <div>Packages</div>
        <div className='dummy-input'>{allValues.pkgs}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <div>Units</div>
        <div className='dummy-input'>{allValues.unit}</div>
      </Col>
      <Col md={6} className='mt-2'>
        <InputComp register={register} name='hs' control={control} label='HS Code' />
      </Col>
      <Col md={6} className='mt-2'>
        <InputComp register={register} name='noBls' control={control} label='NO. BLS' />
      </Col>
    </Row>
    </Col>
    <Col md={6}>
      <Row>
        <Col md={6}>
        <div>Marks & No. Of Containers</div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('marksContent')} style={partyDetail} />
        </div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('marksContentTwo')} style={partyDetail} />
        </div>
        </Col>
        <Col md={6} style={{paddingRight:20}}>
        <div>Packages or Shipping Units</div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('noOfPckgs')} style={partyDetail} />
        </div>
        </Col>
        <Col md={7}>
        <div>Description Of Goods</div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('descOfGoodsContent')} style={partyDetail} />
        </div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('descOfGoodsContentTwo')} style={partyDetail} />
        </div>
        </Col>
        <Col md={5} style={{paddingRight:20}}>
        <div>Gross Weight</div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('grossWeightContent')} style={partyDetail} />
        </div>
        </Col>
        <Col md={5}>
        <div>Measurement</div>
        <div className='brdr-grey mb-2'>
          <EditorContent editor={Editor('measurementContent')} style={partyDetail} />
        </div>
        </Col>
        <Col md={7} style={{paddingRight:20}}>
          <InputComp register={register} name='issuePlace' control={control} label='Place & Date Of Issue' width={50} />
          <div className='my-2'></div>
          <DateComp register={register} name='issueDate' control={control} label=''  />
          <div className='my-2'></div>
          <InputComp register={register} name='formE' control={control} label='Form E #'  />
          <div className='my-2'></div>
          <DateComp register={register} name='formEDate' control={control} label='' />
        </Col>
        <Col md={5}>
        </Col>
      </Row>
    </Col>
  </Row>
</div>
)}
export default BlDetail