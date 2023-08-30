import SelectSearchComp from "/Components/Shared/Form/SelectSearchComp";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { CloseCircleOutlined } from "@ant-design/icons";
import DateComp from "/Components/Shared/Form/DateComp";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import {  Modal } from "antd";
import ModalTable from './Table'
import openNotification from "../../Shared/Notification";

const Index=({awbNo})=>{

  // const [child, setChild] = useState([]);
  const [load, setLoad] = useState(false);
  const [itemIndex, setItemIndex] = useState(0)
  const [visibleModalIndex, setVisibleModalIndex] = useState(-1);
  const [visible, setVisible] = useState(false)
  // const [number, setNumber] = useState(0);

  const { register, handleSubmit, control, reset, formState:{ errors } } = useForm({});

  const { fields, append, remove } = useFieldArray({
    name: "Manifest_Jobs",
    control,
    rules: { required: "Please append at least 1 item"}
  });
  const Manifest_Jobs = useWatch({control, name:"Manifest_Jobs"});

  const getJobById = async(id) => {
   const result = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_MANIFEST_BY_ID, 
    {headers: {id}})
    console.log(id)
    // const data = result.data.result
    // data.date = data?.date ? moment(data.date):""
    // reset(data)
  }

  const onSubmit = async(data) =>{
    let check = false
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_MANIFEST, data)
    .then((x)=> {
      if(x.status = "success"){
        getJobById(x.data.result.id)
        openNotification("Success", "Transaction Recorded!", "green")
      } 
      setLoad(false)
    })}
  return (
    <>
    <div className="base-page-layout">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={7}>
            <Row>
            <Col md={6}>
              <InputComp control={control} register={register} 
              label={"Owner or Operator and Registration"} name="owner_and_operator"/>
            </Col>
            <Col md={3}>
              <InputComp control={control} register={register} 
              label={"Type Of Aircraft"} name="type_of_aircraft"/>
            </Col>
            <Col md={3}>
              <InputComp control={control} register={register} 
              label={"Flight No"} name="flight_no"/>
            </Col>

            <Col md={4}>
              <InputComp control={control} register={register} 
              label={"Point Of Loading"} name="point_of_loading"/>
            </Col>
            <Col md={4}>
              <InputComp control={control} register={register} 
              label={"Point Of Unloading"} name="point_of_unloading"/>
            </Col>
            <Col md={4} >
              <DateComp register={register} name="date" label="Date" control={control} width={"100%"} />
            </Col>
            </Row>
          </Col>
        </Row>
        <button type="button" className="btn-custom mb-3" style={{width:"110px", float:'right'}}
          onClick={()=>append({visible:false})}
        >Add
        </button>
        <div className="table-sm-1 col-12" style={{ maxHeight: 300, overflowY: "auto" }} >
          <Table className="tableFixHead" bordered>
            <thead>
              <tr>
                <th className="col-1">AWB</th>
                <th>No of Pcs</th>
                <th>Nature of Goods</th>
                <th>G - Weight</th>
                <th>Destination</th>
                <th>Office Use</th>
                <th className="">Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {fields.map((field, index) => {
              // const isModalVisible = visibleModalIndex === index;
              return (
              <tr className="f table-row-center-singleLine" key={field.id}>
                <td style={{padding:3}}>
                <SelectSearchComp className="form-select" name={`Manifest_Jobs.${index}.awb`} register={register} 
                control={control} width={"100%"} disabled={Manifest_Jobs?.length > 0 && Manifest_Jobs[index]?.job_type == "external"}
                options={awbNo.result.length>0?awbNo.result.map((x) => { return {id: x.jobNo + "," + x.id, name: x.jobNo }}):[]}/>
                </td>
                <td style={{padding:3}}>
                <InputComp control={control} register={register} 
                label={""} name={`Manifest_Jobs.${index}.no_of_pc`}/>
                </td>
                <td style={{padding:3}}>
                <InputComp control={control} register={register} 
                label={""} name={`Manifest_Jobs.${index}.nature_of_good`}/>
                </td>
                <td style={{padding:3}}>
                <InputComp control={control} register={register} 
                label={""} name={`Manifest_Jobs.${index}.goross_wt`}/>
                </td>
                <td style={{padding:3}}>
                <InputComp control={control} register={register} 
                label={""} name={`Manifest_Jobs.${index}.destination`}/>
                </td>
                <td style={{padding:3}}>
                <InputComp control={control} register={register} 
                label={""} name={`Manifest_Jobs.${index}.office_use`}/>
                </td>
                <td style={{padding:3, minWidth:220}}>
                <SelectComp register={register} name={`Manifest_Jobs.${index}.job_type`} 
                  width={Manifest_Jobs?.length > 0 && Manifest_Jobs[index]?.job_type == "external" ? "40%" :"100%"}
                  control={control} label='' options={[{id:"external", value:"external"}, {id:"internal", value:"internal"}]}
                />
                {Manifest_Jobs?.length > 0 && Manifest_Jobs[index]?.job_type == "external" &&
                <>
                <button className="btn-custom mx-1" type="button" onClick={() => 
                  {
                    let tempState = [...Manifest_Jobs];
                    tempState[index].visible = true;
                    reset({ Manifest_Jobs: tempState });
                }}>
                  Add Fields
                </button>
                <Modal
                  centered
                  open={Manifest_Jobs[index].visible}
                  width={"50%"}
                  onOk={() => {
                    let tempState = [...Manifest_Jobs];
                    tempState[index].visible = false;
                    reset({ Manifest_Jobs: tempState });
                  }}
                  onCancel={() => {
                    let tempState = [...Manifest_Jobs];
                    tempState[index].visible = false;
                    reset({ Manifest_Jobs: tempState });
                  }}
                  maskClosable={false} 
                  title={`BL Fields`}
                >
                  <ModalTable index={index} control={control} register={register}/>
                </Modal>
                </> 
                }                
                </td>
                <td className="text-center" >
                <CloseCircleOutlined className="cross-icon" onClick={()=>remove(index)} />
                </td>
              </tr>
              );
            })}
            </tbody>
          </Table>
        </div>
  
        <button className="btn-custom" disabled={load ? true : false} type="submit"
        >{load ? <Spinner size="sm" className="mx-3" /> : "Save"}
        </button>
      </form>


    </div>
    </>
  );
};

export default Index;