import SelectSearchComp from "/Components/Shared/Form/SelectSearchComp";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import React, { useEffect, useState, useRef } from "react";
import InputComp from "/Components/Shared/Form/InputComp";
import { useFieldArray, useWatch } from "react-hook-form";
import { CloseCircleOutlined } from "@ant-design/icons";
import DateComp from "/Components/Shared/Form/DateComp";
import { AiFillRightCircle } from "react-icons/ai";
import { Spinner, Table } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import ReactToPrint from 'react-to-print';
import VoucherPrint from "./VoucherPrint";
import { InputNumber } from "antd";
import moment from "moment";
import axios from "axios";
import Router from "next/router";

const Vouchers = ({ register, control, errors, CompanyId, child, settlement, reset, voucherData, setSettlement, setChild, id }) => {

  let inputRef = useRef(null)
  const { fields, append, remove } = useFieldArray({
    name: "Voucher_Heads",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });
  const [accountLoad, setAccountLoad] = useState(true);
  const [invoiceId, setInvoiceId] = useState("");

  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const commas = (a) => a == 0 ? '0' : parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  const box = { border: '1px solid silver', paddingLeft: 10, paddingTop: 5, paddingBottom: 3, minHeight: 31 }
  const allValues = useWatch({ control });

  useEffect(() => { getValues(); }, []);

  useEffect(() => {
    (allValues.vType != "" && CompanyId != NaN && allValues.vType) ?
      getAccounts() :
      null;
  }, [allValues.vType]);

  useEffect(() => {
    let totalDebit = 0.00;
    let totalCredit = 0.00;
    allValues.Voucher_Heads.forEach((x) => {
      if (x.type == "debit" && x.amount != 0) {
        totalDebit = totalDebit + parseFloat(x.amount);
      } else if (x.type == "credit" && x.amount != 0) {
        totalCredit = totalCredit + parseFloat(x.amount);
      }
    })
    setTotalDebit(totalDebit);
    setTotalCredit(totalCredit);
  }, [allValues.Voucher_Heads]);

  async function getValues() {
    if (id != "new") {
      voucherData.invoice_Voucher == "1" ?
        setInvoiceId(voucherData.invoice_Id) :
        setInvoiceId("");
      const { chequeNo, payTo, vType, type, exRate, currency } = voucherData;
      let iD = "";
      let settleId = "";
      let ChildAccountId = "";
      let createdAt = voucherData.createdAt ? moment(voucherData.createdAt) : "";
      let chequeDate = voucherData.chequeDate ? moment(voucherData.chequeDate) : "";
      let Voucher_Heads = voucherData.Voucher_Heads?.filter((x) => x.settlement !== "1");
      voucherData?.Voucher_Heads?.filter((voucher) => {
        if (voucher.settlement === "1") {
          ChildAccountId = voucher.ChildAccountId;
          settleId = voucher.id;
          iD = voucherData.id
        }
      });
      reset({
        CompanyId, vType, chequeDate, chequeNo, payTo, type, createdAt,
        Voucher_Heads, exRate, currency: currency == undefined ? "PKR" : currency,
        ChildAccountId, settleId, id: iD
      });
    }
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_CHILD_ACCOUNTS, {
      headers: {
        CompanyId: CompanyId
      }
    }).then((x) => {
      setChild(x.data.result);
    })
  }

  const getAccounts = async () => {
    let y = "";
    switch (allValues.vType) {
      case "BPV":
      case "BRV":
        y = "Bank";
        break;
      case "CPV":
      case "CRV":
        y = "Cash";
        break;
      default:
        break;
    }
    if (y != "") {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ACCOUNT_FOR_TRANSACTION_VOUCHER, {
        headers: { companyid: CompanyId, type: y }
      }).then((x) => {
        //console.log("settlements", x.data.result)
        setSettlement(x.data.result);
        let tempHeads = allValues.Voucher_Heads || [];
        tempHeads.forEach((x) => {
          x.amount = parseFloat(x.amount).toFixed(2);
          x.type = (allValues.vType == "BRV" || allValues.vType == "CRV") ? "credit" : "debit";
        })
        reset({
          ...allValues, type: allValues.vType === "BPV" || allValues.vType === "CPV" ? "Payble" : "Recievable",
          Voucher_Heads: tempHeads, ChildAccountId: id == "new" ? null : allValues.ChildAccountId
        });
      })
    } else {
      reset({ ...allValues, ChildAccountId: id == "new" ? null : allValues.ChildAccountId });
    }
    setAccountLoad(false)
  };

  return (
    <>
      <Row>
        <Col md={7}>
          <Row>
            <Col md={6}>
              <div>Voucher No.</div>
              <div style={box}>{voucherData?.voucher_Id || ""}</div>
            </Col>
            <Col md={3}>
              <DateComp register={register} name="createdAt" label="Date" control={control} width={"100%"} />
            </Col>
            <Col md={3}>
              <SelectSearchComp label="Type" name="vType" register={register} control={control} width={"100%"}
                options={[
                  { id: "CPV", name: "CPV" },
                  { id: "CRV", name: "CRV" },
                  { id: "BRV", name: "BRV" },
                  { id: "BPV", name: "BPV" },
                  { id: "TV", name: "TV" },
                  { id: "JV", name: "JV" },
                ]}
                disabled={id == "new" ? false : true}
              />
              <p className="error-line">{errors?.vType?.message}</p>
            </Col>
            <Col md={12} className="mb-2">
              <div>Company</div>
              <div style={box}>{CompanyId == 1 ? "SEANET SHIPPING & LOGISTICS" : CompanyId == 2 ? "CARGO LINKERS" : "AIR CARGO SERVICES"}</div>
            </Col>
            <Col md={12}>
              <SelectSearchComp className="form-select" name="ChildAccountId" label="Settlement Account" register={register} control={control} width={"100%"}
                options={settlement.length > 0 ? settlement.map((x) => { return { id: x?.id, name: x?.title } }) : []}
                disabled={(allValues.vType == "CPV" || allValues.vType == "CRV" || allValues.vType == "BRV" || allValues.vType == "BPV" || allValues.vType == "TV") ? false : true}
              />
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
                  { id: "USD", name: "USD" },
                  { id: "PKR", name: "PKR" },
                  { id: "GBP", name: "GBP" },
                ]}
              />
            </Col>
            <Col md={2}></Col>
            <Col md={5}>
              <InputNumComp name="exRate" label="Ex.Rate" register={register} control={control} width={"100%"} />
            </Col>
            <Col md={12} className="mt-2">
              <InputComp name="payTo" label="Pay/Recieve To" register={register} control={control} width={"100%"} />
              <p className="error-line">{errors?.payTo?.message}</p>
            </Col>
          </Row>
        </Col>
        <Col className="p-3" md={2}>
          <h6 className="blue-txt cur border p-2">
            <b>Go To Invoice <AiFillRightCircle style={{ position: 'relative', bottom: 1 }} /></b>
          </h6>
          <div>Debit Total</div>
          <div style={{ color: 'grey', paddingTop: 3, paddingRight: 6, border: '1px solid grey', fontSize: 16, textAlign: 'right' }}>{commas(totalDebit)}</div>
          <div className="mt-2">Credit Total</div>
          <div style={{ color: 'grey', paddingTop: 3, paddingRight: 6, border: '1px solid grey', fontSize: 16, textAlign: 'right' }}>{commas(totalCredit)}</div>
        </Col>
        <Col md={3}>
          <button type="button" className="btn-custom mb-3 fs-11" style={{ width: "110px", float: 'left' }}
            onClick={() => Router.push("/accounts/vouchers/new")}
          >
            New
          </button>
          <ReactToPrint
            content={() => inputRef}
            trigger={() => (
              <div className="btn-custom text-center p-1 px-5 fl-right">Print</div>
            )}
          />
        </Col>
      </Row>
      <button type="button" className="btn-custom mb-3" style={{ width: "110px", float: 'right' }}
        onClick={() => append({
          type: (allValues.vType == "BRV" || allValues.vType == "CRV") ? "credit" : "debit",
          ChildAccountId: "",
          narration: "",
          amount: 0,
          defaultAmount: 0
        })}>Add</button>
      <div className="table-sm-1 col-12" style={{ maxHeight: 300, overflowY: "auto" }} >
        <Table className="tableFixHead" bordered>
          <thead>
            <tr>
              <th className="col-3">Account</th>
              <th>Type</th>
              {allValues.currency != "PKR" && <th>{allValues.currency}</th>}
              <th>Amount</th>
              <th>Narration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              return (
                <tr className="f table-row-center-singleLine" key={index}>
                  <td style={{ padding: 3, minWidth: 500 }}>
                    <SelectSearchComp className="form-select" name={`Voucher_Heads.${index}.ChildAccountId`} register={register}
                      control={control} width={"100%"}
                      options={child.length > 0 ? child.map((x) => { return { id: x?.id, name: x?.title } }) : []}
                    />
                  </td>
                  <td style={{ padding: 3, width: 90 }}>
                    <SelectComp className="form-select" name={`Voucher_Heads.${index}.type`} register={register} control={control}
                      width={"100%"} options={[{ id: "debit", name: "Debit" }, { id: "credit", name: "Credit" }]}
                    />
                  </td>
                  {allValues.currency != "PKR" &&
                    <td style={{ padding: 3, width: 90 }}>
                      <InputNumber value={field.defaultAmount} style={{ width: '100%' }}
                        onChange={(e) => {
                          let tempRecords = [...allValues.Voucher_Heads];
                          tempRecords[index].defaultAmount = e;
                          tempRecords[index].amount = e ? (parseFloat(e) * parseFloat(allValues.exRate)).toFixed(2) : tempRecords[index].amount;
                          reset({ ...allValues, Voucher_Heads: tempRecords });
                        }}
                      />
                    </td>}
                  <td style={{ padding: 3, width: 90 }}>
                    <InputNumComp name={`Voucher_Heads.${index}.amount`} register={register} control={control} width={"100%"} />
                  </td>
                  <td style={{ padding: 3 }}>
                    <InputComp type="text" name={`Voucher_Heads.${index}.narration`} placeholder="Narration" control={control} register={register} />
                  </td>
                  <td className="text-center" style={{ padding: 3, paddingTop: 6 }}>
                    <CloseCircleOutlined className="cross-icon" onClick={() => remove(index)} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
      {(accountLoad && allValues.vType) && <Spinner size="sm" className="my-2" />}
      <br />
      <div style={{
        display: 'none'
      }}>
        <div ref={(response) => (inputRef = response)}>
          {
            id !== "new" ? (
              <VoucherPrint compLogo={CompanyId} voucherData={voucherData} />
            )
              :
              null
          }
        </div>
      </div>
    </>
  )
};

export default React.memo(Vouchers);