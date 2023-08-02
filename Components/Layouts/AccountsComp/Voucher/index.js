import openNotification from "/Components/Shared/Notification";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./state";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import Vouchers from "./Vouchers";
import moment from "moment";
import axios from "axios";

const Voucher = ({ id, voucherData }) => {

  const CompanyId = useSelector((state) => state.company.value);
  const [child, setChild] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [load, setLoad] = useState(false);

  const { register, handleSubmit, control, reset, formState:{ errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ComapnyId:1,
      chequeDate:"",
      chequeNo:"",
      costCenter:"KHI",
      payTo:"",
      type:"",
      vType:"",
      Voucher_Heads: [{ type: "", ChildAccountId: "", narration: "", amount: 0 }]
    }
  });

  const onSubmit = async(data) => {
    let tempData = data;
    let settlementAmmount = 0;

    tempData.Voucher_Heads.forEach((x)=>{
      settlementAmmount = settlementAmmount + x.amount
    })

    let newObj = {
      ChildAccountId:data.ChildAccountId,
      amount:settlementAmmount,
      type:data.vType==("CRV"||"BRV")?"debit":"credit",
      settlement:"1",
      narration:"1"
    }

    id=="new"?null:newObj.id=tempData.settleId;
    tempData.Voucher_Heads.push(newObj)
    tempData.chequeDate=tempData.chequeDate?moment(tempData.chequeDate).format("DD/MM/YYYY"):"";
    tempData.CompanyId=CompanyId?CompanyId:1
    if(id=="new"){
      delete tempData.id;
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER, tempData).then((x)=>{
        x.data.status == "success"
        ? openNotification("Success", `Voucher Created Successfully!`, "green")
        : openNotification( "Error", `An Error occured Please Try Again!`, "red");
      })
    } else {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_VOUCEHR, tempData).then((x)=>{
        x.data.status == "success"
        ? openNotification("Success", `Voucher Updated Successfully!`, "green")
        : openNotification( "Error", `An Error occured Please Try Again!`, "red");
      })
    }
  };

  return (
    <Vouchers handleSubmit={handleSubmit} onSubmit={onSubmit} register={register} control={control}
      reset={reset} setSettlement={setSettlement} errors={errors} settlement={settlement} CompanyId={CompanyId}
      child={child} voucherData={voucherData} setChild={setChild} 
      load={load} 
    />
  );
};

export default Voucher;