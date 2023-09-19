import SelectSearchComp from "/Components/Shared/Form/SelectSearchComp";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import InputComp from "/Components/Shared/Form/InputComp";
import { useFieldArray, useWatch } from "react-hook-form";
import { CloseCircleOutlined } from "@ant-design/icons";
import DateComp from "/Components/Shared/Form/DateComp";
import { Spinner, Table } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import React, { useEffect } from "react";
import { InputNumber } from "antd";
import moment from "moment";
import axios from "axios";

const Vouchers=({
  handleSubmit, onSubmit, register, control, errors,
  CompanyId, child, settlement, reset, load,
  voucherData, setSettlement, setChild, id
}) => {

  const { fields, append, remove } = useFieldArray({
    name: "Voucher_Heads",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });

  const allValues = useWatch({ control });
  const Voucher_Heads = useWatch({ control, name:'Voucher_Heads' });

  useEffect(() => { getValues(); }, []);
  useEffect(() => { getAccounts(); }, [allValues.vType]);

  async function getValues(){
    const { chequeNo,  payTo, vType, type, exRate, currency } = voucherData;
    let id="";
    let settleId="";
    let ChildAccountId = "";
    let chequeDate = voucherData.chequeDate?moment(voucherData.chequeDate):"";
    let Voucher_Heads = voucherData.Voucher_Heads?.filter((x)=>x.settlement!=="1");
    voucherData?.Voucher_Heads?.filter((voucher) => {
      if(voucher.settlement === "1") {
        ChildAccountId = voucher.ChildAccountId;
        settleId = voucher.id;
        id = voucherData.id;
      }
    });
    reset({ 
      CompanyId, vType, chequeDate, chequeNo, payTo, type,
      Voucher_Heads, exRate, currency:currency==undefined?"PKR":currency,
      ChildAccountId, settleId, id 
    });
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {headers:{CompanyId:CompanyId}})
    .then((x)=>{
      setChild(x.data.result);
    })
  }

  const getAccounts = async () => {
    if(allValues.vType!="" && CompanyId!=NaN){
      let x = "";
      switch (allValues.vType) {
        case "BPV":
        case "BRV":
          x = "Bank";
          break;
        case "CPV":
        case "CRV":
          x = "Cash";
          break;
        default:
          break;
      }
      if(x!=""){
        await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION,{headers: { companyid:CompanyId, type:x }})
        .then((x)=>{
          setSettlement(x.data.result);
          // after getting accounts data below the voucher_heads debit/credit is settled according to voucher type selected
          let tempHeads = allValues.Voucher_Heads;
          //tempHeads?.forEach((x)=> x.type=(allValues.vType=="BRV"|| allValues.vType=="CRV")?"credit":"debit");
          tempHeads.forEach((x)=>{
            x.amount = parseFloat(x.amount).toFixed(2)
          })
          reset({
            ...allValues, 
            type:allValues.vType === "BPV" || allValues.vType === "CPV" ? "Payble" :"Recievable", 
            Voucher_Heads:tempHeads
          });
        })
      }
    }
  };

  const box = {border:'1px solid silver', paddingLeft:10, paddingTop:5, paddingBottom:3, minHeight:31}
  return (
  <div className="base-page-layout fs-11">
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={7}>
          <Row>
          <Col md={6}>
            <div>Voucher No.</div>
            <div style={box}>{voucherData?.voucher_Id||""}</div>
          </Col>
          <Col md={3}>
            <div>Date</div>
            <div style={box}>{moment().format("YYYY-MM-DD")}</div>
          </Col>
          <Col md={3}>
            <SelectSearchComp label="Type" name="vType" register={register} control={control} width={"100%"}
              options={[
                { id: "CPV", name: "CPV" },
                { id: "CRV", name: "CRV" },
                { id: "BRV", name: "BRV" },
                { id: "BPV", name: "BPV" },
                // { id: "CR", name: "CR" },
                { id: "TV", name: "TV" },
                { id: "JV", name: "JV" },
              ]}
              disabled={id=="new"?false:true}
            />
            <p className="error-line">{errors?.vType?.message}</p>
          </Col>
          <Col md={12} className="mb-2">
            <div>Company</div>
            <div style={box}>{ CompanyId==1?"SEANET SHIPPING & LOGISTICS":CompanyId==2?"CARGO LINKERS":"AIR CARGO SERVICES" }</div>
          </Col>
          <Col md={12}>
            <SelectSearchComp className="form-select" name="ChildAccountId" label="Settlement Account" register={register} control={control} width={"100%"}
              options={
                settlement.length>0?settlement.map((x)=>{
                  return { id: x?.id, name: x?.title };
                }):[]
              }
              disabled={
                (
                  allValues.vType=="CPV"||allValues.vType=="CRV"||
                  allValues.vType=="BRV"||allValues.vType=="BPV"||
                  allValues.vType=="TV"
                )?false:true
              }
            />
            {/* <p className="error-line">{errors?.ChildAccountId?.message}</p> */}
          </Col>
          <Col md={5} className="my-2">
            <InputComp className="form-control" name={"chequeNo"} label="Cheque No" placeholder="Cheque No" register={register} control={control} />
          </Col>
          <Col md={2}></Col>
          <Col md={5} className="my-2">
            <DateComp register={register} name="chequeDate" label="Cheque Date" control={control} width={"100%"} />
          </Col>
          <Col md={5}>
            <SelectComp className="form-select" name={`currency`} label="Currency" register={register} control={control} 
              width={"100%"}
              options={[
                { id:"USD", name: "USD" },
                { id:"PKR", name: "PKR" },
                { id:"GBP", name: "GBP" },
              ]}
            />
          </Col>
          <Col md={2}></Col>
          <Col md={5}>
            <InputNumComp name="exRate" label="Ex.Rate" register={register} control={control} width={"100%"}  />
          </Col>
          <Col md={12} className="mt-2">
            <InputComp name="payTo" label="Pay/Recieve To" register={register} control={control} width={"100%"} />
            <p className="error-line">{errors?.payTo?.message}</p>
          </Col>
          </Row>
        </Col>
      </Row>
      <button type="button" className="btn-custom mb-3" style={{width:"110px", float:'right'}}
        onClick={()=>append({
          type:allValues.vType==("BRV"||"CRV")?"credit":"debit",
          ChildAccountId:"",
          narration:"",
          amount:0,
          defaultAmount:0
        })}
      >Add
      </button>
      <div className="table-sm-1 col-12" style={{ maxHeight: 300, overflowY: "auto" }} >
      <Table className="tableFixHead" bordered>
        <thead>
          <tr>
            <th className="col-3">Account</th>
            <th>Type</th>
            {allValues.currency!="PKR" && <th>{allValues.currency}</th>}
            <th>Amount</th>
            <th>Narration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {fields.map((field, index) => {
        return (
          <tr className="f table-row-center-singleLine" key={index}>
            <td style={{padding:3, minWidth:500}}>
              <SelectSearchComp className="form-select" name={`Voucher_Heads.${index}.ChildAccountId`} register={register} 
                control={control} width={"100%"} 
                options={ child.length>0?child.map((x) => { return{ id: x?.id, name: x?.title }}):[]}
              />
            </td>
            <td style={{padding:3, width:90}}>
              <SelectComp className="form-select" name={`Voucher_Heads.${index}.type`} register={register} control={control} 
                width={"100%"}
                options={[
                  { id: "debit", name: "Debit" },
                  { id: "credit", name: "Credit" },
                ]}
              />
            </td>
            {allValues.currency!="PKR" &&
            <td style={{padding:3, width:90}}>
              {/* <InputNumComp name={`Voucher_Heads.${index}.defaultAmount`} register={register} control={control} width={"100%"} /> */}
                <InputNumber value={field.defaultAmount} style={{width:'100%'}} 
                  onChange={(e)=>{
                    let tempRecords = [...Voucher_Heads];
                    tempRecords[index].defaultAmount = e;
                    tempRecords[index].amount =e? (parseFloat(e)*parseFloat(allValues.exRate)).toFixed(2):tempRecords[index].amount;
                    reset({...allValues, Voucher_Heads:tempRecords})
                  }}
                />
            </td>}
            <td style={{padding:3, width:90}}>
              <InputNumComp name={`Voucher_Heads.${index}.amount`} register={register} control={control} width={"100%"} />
            </td>
            <td style={{padding:3}}>
              <InputComp type="text" name={`Voucher_Heads.${index}.narration`} placeholder="Narration" control={control} register={register} />
            </td>
            <td className="text-center" style={{padding:3, paddingTop:6}}>
              <CloseCircleOutlined className="cross-icon" onClick={()=>remove(index)} />
            </td>
          </tr>
        )})}
        </tbody>
      </Table>
      </div>
      <button className="btn-custom" disabled={load ? true : false} onClick={handleSubmit}
      >{load ? <Spinner size="sm" className="mx-3" /> : "Save"}
      </button>
    </form>
  </div>
  );
};

export default Vouchers;