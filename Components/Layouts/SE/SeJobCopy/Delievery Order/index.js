import openNotification from "/Components/Shared/Notification";
import { useForm, useWatch } from "react-hook-form";
import React,{useEffect, useState} from "react";
import LoadingForm from "./LoadingForm";
import {initialState} from "./states";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";

const DeliveryOrder = ({ state, jobData, clearingAgents }) => {

  const [load, setLoad] = useState(false);
  const companyId = useSelector((state) => state.company.value);
  const { register, control, handleSubmit, reset } = useForm({});
  const allValues = useWatch({ control });

  const onSubmit = async (data) => {
    setLoad(true);
    console.log(data)
    const SEJobId = jobData.id;
    data.operation = "SI"
    data.companyId = companyId
    data.id == "" ? delete data.id : data.id;
    data.type = data.type?.toString()
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPSERT_DELIVER_ORDER, {
        ...data,
        SEJobId,
    }).then((x) => {
      console.log(x)
      if(x.data.status=="success"){
        // if(!data.id){
        //   reset({...allValues, id:x.data.result[0].id});
        // }
        openNotification("Success", "Loading Program Saved!", "Green")
      }else{
        openNotification("Error", "Something Went Wrong, please try again", "red")
      }
    }).catch((e) => console.log(e.message))
    setLoad(false)
  };

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_DELIVER_ORDER, {
      headers: { id: jobData.id },
    })  .then((res) => {
      if (res.data.result !== null) {
        console.log(res.data.result)
        let deliveryOrder = res.data.result;
        reset({
          ...deliveryOrder,
          date:deliveryOrder.date ==""?"":moment(deliveryOrder.date),
          validDate:deliveryOrder.validDate ==""?"":moment(deliveryOrder.validDate),
          expDate:deliveryOrder.expDate ==""?"":moment(deliveryOrder.expDate),
       
        })
      }
    })
  }, []);

  return (
    <LoadingForm onSubmit={onSubmit} register={register} control={control} handleSubmit={handleSubmit}
      load={load} allValues={allValues} state={state} jobData={jobData} clearingAgents={clearingAgents}
    />
  );
};

export default DeliveryOrder