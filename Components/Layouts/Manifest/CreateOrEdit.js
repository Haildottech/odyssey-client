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
import { initialValue, validationSchema } from "./states";
import Router, { useRouter} from 'next/router'
import { yupResolver } from "@hookform/resolvers/yup";

const Index=({awbNo, manifest})=>{

  const router =  useRouter()
  const [load, setLoad] = useState(false);

  const { register, handleSubmit, control, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { fields, append, remove } = useFieldArray({
    name: "Manifest_Jobs",
    control,
    rules: { required: "Please append at least 1 item"}
  });
  const all_values = useWatch({control});


  useEffect(() => {
    if (manifest.status == "success"){
      const data = manifest.result;
      data.date = data?.date ? moment(data.date):"";
      data.Manifest_Jobs = data.Manifest_Jobs.map((x) => {
        let excludedDate = x.excluded_on_date ? moment(x.excluded_on_date) : "" 
        let requesteDate = x.requested_flight_date ? moment(x.requested_flight_date) : "" 
          return {
            ...x, excluded_on_date : excludedDate, requested_flight_date: requesteDate
          }
      });
      reset(data);
    }
  },[])

  const onSubmit = async(data) =>{
    setLoad(true);
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_MANIFEST, data)
    .then((x)=> {
      if (x.status = "success"){
        openNotification("Success", "Transaction Recorded!", "green")
        Router.push(`/manifest/${x.data.result.id}`);
      } 
      setLoad(false)
    })
  }

  const onEdit = async(data) =>{
    setLoad(true)
    data.id = router.query.id
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_EDIT_MANIFEST, data)
    .then((x)=> {
      console.log(data)
      if (x.status = "success"){
        openNotification("Success", "Transaction Recorded!", "green")
      } 
      setLoad(false)
    })
  }

  return (
    <>
    <div className="base-page-layout">
    <form onSubmit={handleSubmit(router.query.id == "new" ? onSubmit : onEdit)}>
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
              <p className="error-line">{errors?.flight_no?.message}</p>
            </Col>

            <Col md={4}>
              <InputComp control={control} register={register} 
              label={"Point Of Loading"} name="point_of_loading"/>
              <p className="error-line">{errors?.point_of_loading?.message}</p>

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
          onClick={()=>append({...initialValue})}
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
              return (
              <tr className="f table-row-center-singleLine" key={field.id}>
                <td style={{padding:3}}>
                <SelectSearchComp className="form-select" name={`Manifest_Jobs.${index}.awb`} register={register} 
                control={control} width={"100%"} disabled={all_values.Manifest_Jobs?.length > 0 && all_values.Manifest_Jobs[index]?.job_type == "external"}
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
                width={all_values.Manifest_Jobs?.length > 0 && all_values.Manifest_Jobs[index]?.job_type == "external" ? "40%" :"100%"}
                control={control} label='' options={[{id:"external", value:"external"}, {id:"internal", value:"internal"}]}
                />
                {all_values.Manifest_Jobs?.length > 0 && all_values.Manifest_Jobs[index]?.job_type == "external" &&
                <>
                <button className="btn-custom mx-1" type="button" onClick={() => 
                  {
                  let tempState = [... all_values.Manifest_Jobs];
                  tempState[index].visible = true;
                  reset({...all_values, Manifest_Jobs: tempState });
                  }}>
                  Add Fields
                  </button>
                  <Modal
                  centered
                  open={all_values.Manifest_Jobs[index].visible}
                  width={"90%"}
                  onOk={() => {
                    let tempState = [...all_values.Manifest_Jobs];
                  tempState[index].visible = false;
                  reset({...all_values, Manifest_Jobs: tempState });
                  }}
                  onCancel={() => {
                  let tempState = [...all_values.Manifest_Jobs];
                  tempState[index].visible = false;
                  reset({...all_values, Manifest_Jobs: tempState });
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