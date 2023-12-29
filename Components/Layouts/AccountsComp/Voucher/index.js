import openNotification from "/Components/Shared/Notification";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema, defaultValues } from "./state";
import { useForm, useWatch } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import React, { useState } from "react";
import Vouchers from "./Vouchers";
import axios from "axios";
import { delay } from "/functions/delay"
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from "next/router";

const Voucher = ({ id, voucherData }) => {

  const dispatch = useDispatch();
  const CompanyId = useSelector((state) => state.company.value);
  const [child, setChild] = useState([]);
  const [settlement, setSettlement] = useState([]);
  const [load, setLoad] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (data) => {
    setLoad(true)
    console.log(data)
    let settlementAmmount = 0.00;
    let debit = 0.00, credit = 0.00;
    let voucher = { ...data }
    let newHeads = [...data.Voucher_Heads];
    if (voucher.ChildAccountId) {
      voucher.Voucher_Heads.map((x) => {
        settlementAmmount = settlementAmmount + x.amount;
        if (x.type == "debit") {
          debit = debit + x.amount;
        } else {
          credit = credit + x.amount;
        }
      })

      let difference = debit - credit
      newHeads.push({
        ChildAccountId: voucher.ChildAccountId,
        amount: difference > 0 ? difference : -1 * (difference),
        type: difference > 0 ? 'credit' : 'debit', //voucher.vType==("CRV"||"BRV")?"debit":"credit",
        settlement: "1",
        narration: voucher.payTo,
        defaultAmount: voucher.currency == "PKR" ? 0 : parseFloat(difference) / parseFloat(voucher.exRate)
      })
      voucher.Voucher_Heads = newHeads
    }
    voucher.CompanyId = CompanyId ? CompanyId : 1;
    voucher.type = (voucher.vType == "BPV" || voucher.vType == "CPV") ? "Payble" : (voucher.vType == "BRV" || voucher.vType == "CRV") ? "Recievable" : voucher.vType == "TV" ? "Trasnfer Voucher" : "General Voucher"
    //voucher.createdAt = voucherData.createdAt

    // <----- Create New Voucher ----->
    if (id == "new") {
      delete voucher.id;
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_CREATE_VOUCHER, voucher).then((x) => {
        if (x.data.status == "success") {
          openNotification("Success", `Voucher Created Successfully!`, "green");
          setLoad(false);
          dispatch(incrementTab({ "label": "Voucher", "key": "3-5", "id": `${x.data.result.id}` }));
          Router.push(`/accounts/vouchers/${x.data.result.id}`);
        } else {
          openNotification("Error", `An Error occured Please Try Again!`, "red");
          setLoad(false);
        }
      });
    }
    // <----- Update Existing Voucher ----->
    else {
      await axios.post(process.env.NEXT_PUBLIC_CLIMAX_UPDATE_VOUCEHR, { ...voucher, id: id }).then((x) => {
        x.data.status == "success"
          ? openNotification("Success", `Voucher Updated Successfully!`, "green")
          : openNotification("Error", `An Error occured Please Try Again!`, "red");
      });
    }
    await delay(1000);
    setLoad(false)
  };

  return (
    <div className="base-page-layout fs-11">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Vouchers register={register} control={control}
          child={child} voucherData={voucherData} setChild={setChild} id={id}
          reset={reset} setSettlement={setSettlement} errors={errors} settlement={settlement} CompanyId={CompanyId}
        />
        <button className="btn-custom" disabled={load ? true : false} type="submit"
        >{load ? <Spinner size="sm" className="mx-3" /> : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Voucher;