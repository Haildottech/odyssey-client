import axios from "axios"

const saveHeads = async(charges, state, dispatch, reset) => {
    console.log(charges)
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_SAVE_CHARGE_HEADS, 
      {
        charges, 
        deleteList:state.deleteList, 
        id:state.selectedRecord.id,
        exRate:state.exRate
      })
      .then((x)=>{
      reset({chargeList:[]})
    })
  
}

const generateInvoice = async(list, companyId, reset, type) => {
    let status = "";
    let tempList = list.filter((x)=>x.check);
    if(tempList.length>0){
    let invoiceTypes = { ai:[], ab:[], ji:[], jb:[] };
    let invoices = [];
    tempList.forEach((x)=>{
        if(x.invoiceType=="Job Bill"){
            invoiceTypes.jb.push(x);
        } else if (x.invoiceType=="Job Invoice"){
            invoiceTypes.ji.push(x);
        } else if(x.invoiceType=="Agent Invoice"){
            invoiceTypes.ai.push(x);
        } else if(x.invoiceType=="Agent Bill"){
            invoiceTypes.ab.push(x);
        }
    })
    console.log(invoiceTypes);
    if(invoiceTypes.ji.length>0){
        invoiceTypes.ji.forEach((x)=>{
            invoices.push({
                operation:type,
                ex_rate:x.ex_rate,
                SEJobId: x.SEJobId,
                party_Name: x.name,
                type:"Job Invoice",
                currency:x.currency,
                companyId:companyId,
                party_Id: x.partyId,
                payType:"Recievable",
                partyType:x.partyType,
            })
        })
    }
    
    //   await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_GENERATE_INVOICE,{
    //     chargeList:tempList, companyId, type:type
    //   }).then((x)=>{
    //     status = x.data.status
    //   })
    }

    let shouldBe = {
        "id": "901577330823921665",
        "invoice_No": "SNS-JI-1/23",
        "invoice_Id": "1",
        "type": "Job Invoice",
        "payType": "Recievable",
        "status": null,
        "operation": "SE",
        "currency": "USD",
        "ex_rate": "319.45",
        "party_Id": "891647483633008641",
        "party_Name": "HANGZHOU LINAN DA YANG WELDING MATERIAL CO., LTD",
        "paid": "0",
        "recieved": "0",
        "roundOff": "0",
        "total": "0",
        "approved": "0",
        "companyId": "1",
        "partyType": "client",
        "note": null,
        "createdAt": "2023-09-20T11:39:30.608Z",
        "updatedAt": "2023-09-20T11:39:30.608Z",
        "SEJobId": "893956199135150081",
        "Charge_Heads": [
            {
                "id": "901547222455255041",
                "charge": "1",
                "particular": "OCEAN FREIGHT",
                "invoice_id": "SNS-JI-1/23",
                "description": "",
                "name": "HANGZHOU LINAN DA YANG WELDING MATERIAL CO., LTD",
                "partyId": "891647483633008641",
                "invoiceType": "Job Invoice",
                "type": "Recievable",
                "basis": "Per Unit",
                "pp_cc": "PP",
                "size_type": "40HC",
                "dg_type": "non-DG",
                "qty": "0",
                "rate_charge": "1",
                "currency": "USD",
                "amount": "1",
                "discount": "0",
                "taxPerc": "1.2",
                "tax_apply": false,
                "tax_amount": "0",
                "net_amount": "0",
                "ex_rate": "319.45",
                "local_amount": "0",
                "status": "1",
                "approved_by": "",
                "approval_date": "",
                "partyType": "client",
                "InvoiceId": "901577330823921665",
                "SEJobId": "893956199135150081"
            },
            {
                "id": "901547224221384705",
                "charge": "4",
                "particular": "Refund",
                "invoice_id": "SNS-JI-1/23",
                "description": "",
                "name": "HANGZHOU LINAN DA YANG WELDING MATERIAL CO., LTD",
                "partyId": "891647483633008641",
                "invoiceType": "Job Invoice",
                "type": "Recievable",
                "basis": "Per Unit",
                "pp_cc": "PP",
                "size_type": "40HC",
                "dg_type": "non-DG",
                "qty": "0",
                "rate_charge": "1",
                "currency": "USD",
                "amount": "1",
                "discount": "0",
                "taxPerc": "0",
                "tax_apply": false,
                "tax_amount": "0",
                "net_amount": "0",
                "ex_rate": "319.45",
                "local_amount": "0",
                "status": "1",
                "approved_by": "",
                "approval_date": "",
                "partyType": "client",
                "InvoiceId": "901577330823921665",
                "SEJobId": "893956199135150081"
            }
        ]
    }

    return status
  }

export { saveHeads, generateInvoice };