import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';
import moment from 'moment';
import { delay } from "/functions/delay"
import InvoicedUploader from "./InvoicedUploader";
import AgentInvoice from "./AgentInvoice";
import PartiesUploader from "./PartiesUploader";
import invoices from "../../../jsonData/invoices.json"
import AgentInvoiceAdv from './AgentInvoiceAdvance';

const Uploader = () => {

  const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleCA = async(data) => {
    let Assets = [];
    let Liability = [];
    let Expense = [];
    let Capital = [];
    let income = [];

    await data.forEach(async(x, i) => {
      if(i<data.length-1 && x.account_no!="Account No" && x.account_no!=null){
        let record  = {
          ...x, 
          account_title:x.account_title.trimStart(), 
          account_no:`${x.account_no}`.trimStart(),
          title:x.account_title.trimStart(),
          editable:'0',
          subCategory:x.sub_category
        }
        if(record.catogary=="Asset"){
          if(record.type=="Group" ){
            Assets.push({...record, AccountId:3,childAccounts:[]})
          } else if(record.type!="Group"){
            Assets[Assets.length-1].childAccounts.push(record)
          }
        }
        if(record.catogary=="Liability"){
          if(record.type=="Group" ){
            Liability.push({...record, AccountId:4, childAccounts:[]})
          } else if(record.type!="Group"){
            Liability[Liability.length-1]?
              Liability[Liability.length-1].childAccounts.push(record):
              Liability.push({title:'OTHER LIABILITY ACCOUNTS', account_no:'ACC-3', AccountId:4, type:'Group', childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Expense"){
          if(record.type=="Group" ){
            Expense.push({...record, AccountId:1, childAccounts:[]})
          } else if(record.type!="Group"){
            Expense[Expense.length-1]?
              Expense[Expense.length-1].childAccounts.push(record):
              Expense.push({title:'OTHER EXPENSE ACCOUNTS', account_no:'ACC-3', type:'Group', AccountId:1, childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Income"){
          if(record.type=="Group" ){
            income.push({...record, AccountId:2, childAccounts:[]})
          } else if(record.type!="Group"){
            income[income.length-1]?
              income[income.length-1].childAccounts.push(record):
              income.push({title:'OTHER INCOME ACCOUNTS', account_no:'ACC-2', type:'Group', AccountId:2, childAccounts:[{...record}]})
          }
        }
        if(record.catogary=="Capital"){
          if(record.type=="Group" ){
            Capital.push({...record, AccountId:5, childAccounts:[]});
          } else if(record.type!="Group"){
            Capital[Capital.length-1]?
            Capital[Capital.length-1].childAccounts.push(record):
            Capital.push({title:'OTHER CAPITAL ACCOUNTS', account_no:'ACC-1', type:'Group', AccountId:5, childAccounts:[{...record}]})
          }
        }
      }
    });

    console.log({
        Assets,
        Liability,
        Expense,
        income,
        Capital
    })

    // axios.post('http://localhost:8081/accounts/accountCreate',[
    //   ...Assets,
    //   ...Liability,
    //   ...Expense,
    //   ...income,
    //   ...Capital
    // ]).then((x)=>{
    //   console.log(x.data)
    // })
  }

  const handleOpeningBalances = (data) => {
    let list = [];
    data.forEach(async(x, i) => {
      if(i<data.length) {
        let title = x.particular.slice(x.particular.indexOf("(")).slice(1).slice(0, -1)
        await list.push({title:title, amount:x.balance, type:x.type=="Dr"?"credit":'debit'})
      }
    });
    let newItem = [...list];
    // Company Id Must to be set in backend API also !!!
    // PKR USD EUR GBP AED BDT OMR CHF
    axios.post("http://localhost:8081/voucher/getChildAccountIds", {
        list:newItem, company:3, currency:"EUR"
    }).then((x)=>{
        console.log(x.data.result.newList);
        let total = 0
        x.data.result.newList.forEach((x)=>{
            total = total + x.Voucher_Heads[0].amount;
        })
        console.log(total)
    })
  }

  const uploadVouchers = async() => {
    await vouchersList.forEach(async(x, i)=>{
        await axios.post("http://localhost:8081/voucher/voucherCreation",x)
        .then((y)=>{
            console.log(y.data)
            console.log(i)
        })
    })
  }

  const uploadInvoices = async() => {
    let values = [];
    await invoices.forEach((x)=>{
        values.push({
            ...x,
            total:`${x.total}`,
            recieved:`${x.received}`,
            paid:`${x.paid}`,
            roundOff:`${x.roundOff}`,
            approved:`${x.approved}`,
            ex_rate:`${x.ex_rate}`,
            companyId:`${x.companyId}`,
        })
    })
    console.log(values)
    axios.post("http://localhost:8081/invoice/createBulkInvoices", values)
    .then((x)=>{
        console.log(x.data)
    })
  }

  return (
  <>
    {false!=true && <>
    {/* <div className='mt-4'>
      <b>Chart Of Account Loader</b>
    </div>
    <CSVReader cssClass="csv-reader-input" onFileLoaded={handleCA} parserOptions={parserOptions} 
      inputId="ObiWan" inputName="ObiWan"
    /> */}
    {/* <div className='mt-4'>
      <b>Opening Balances Upload</b>
    </div>
    <CSVReader cssClass="csv-reader-input" onFileLoaded={handleOpeningBalances} parserOptions={parserOptions} 
      inputId="ObiWan" inputName="ObiWan"
    /> */}

    {/* <button onClick={uploadVouchers} className='btn-custom mt-5'>Upload Opening Balances</button> */}

    {/* <button onClick={uploadInvoices} className='btn-custom mt-5'>Upload Invoices</button> */}

    </>
    }
    {/* <PartiesUploader/> */}
    {/* <InvoicedUploader /> */}
    {/* <AgentInvoice /> */}
    {/* <AgentInvoiceAdv/> */}
  </>
  )
}

export default Uploader

let accountsList = {
  "Assets": [
      {
          "account_no": "11",
          "account_title": "FIXED ASSETS",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1101001",
                  "account_title": "FURNITURE & FIXTURE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101008",
                  "account_title": "VEHICLE  ACCOUNT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1103",
                  "account_title": "TELEPHONE & FAX MACHINE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1104",
                  "account_title": "COMPUTER & ELECTRIC EQUIPMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1105",
                  "account_title": "SPLIT & WINDOW A.C",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1107",
                  "account_title": "LAND & BUILDING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1108",
                  "account_title": "COPY RIGHT & PATENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1109",
                  "account_title": "TRADE MARK & FRANCHISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1110",
                  "account_title": "BANK GUARANTEE SECURITY DEPOSIT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1111",
                  "account_title": "MIRA (DAIHATSU) M:2012",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1112",
                  "account_title": "PROPERTY PLANT & EQUIPMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101003",
                  "account_title": "REFRIGERATOR & AIR CONDITIONER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101004",
                  "account_title": "OFFICE EQUIPMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1101",
          "account_title": "ASSET LIST",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1101002",
                  "account_title": "COMPUTER ACCESSORIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101005",
                  "account_title": "FAX MACHINE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101006",
                  "account_title": "MOBILE PHONE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1101007",
                  "account_title": "MOTOR CYCLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1102",
          "account_title": "ACCUMULATED DEPRICIATION",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1102001",
                  "account_title": "ACCU. FURNITURE & FIXTURE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102002",
                  "account_title": "ACCU. COMPUTER & PRINTERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102003",
                  "account_title": "ACCU. AIR CONDITIONERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102004",
                  "account_title": "ACCU. OFFICE EQUIPMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102005",
                  "account_title": "ACCU. FAX MACHINE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102006",
                  "account_title": "ACCU. MOBILE PHONE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1102007",
                  "account_title": "ACCU. MOTOR CYCLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1102008",
          "account_title": "ACCU. VEHICLE ACCOUNT",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "12",
          "account_title": "CURRENT ASSETS",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1203",
                  "account_title": "RECEIVABLE FROM COMPANIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1224",
                  "account_title": "RECEIVABLES IMPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1225",
                  "account_title": "WITHHOLDING TAX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1236",
                  "account_title": "STANDARD CHARTERD USD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1242",
                  "account_title": "ACS RECEIVABLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "P97",
                  "account_title": "MASOOD TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P21",
                  "account_title": "ARSHAD CORPORATION (PVT)LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P701",
                  "account_title": "AFINO TEXTILE MILLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "1227",
                  "account_title": "RECEIVABLES CLEARING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1234",
                  "account_title": "A/C BAD DEBT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "P883",
                  "account_title": "JAGUAR (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1028",
                  "account_title": "SADAQAT LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              }
          ]
      },
      {
          "account_no": "1201",
          "account_title": "CASH & BANK",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1201001",
                  "account_title": "PETTY CASH",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Cash"
              },
              {
                  "account_no": "1201002",
                  "account_title": "CASH IN HAND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Cash"
              },
              {
                  "account_no": "1201003",
                  "account_title": "CASH IN DOLLARS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Cash"
              },
              {
                  "account_no": "1201004",
                  "account_title": "CHEQUE IN HAND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201005",
                  "account_title": "BAH EUR LOG",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201006",
                  "account_title": "UNITED BANK LIMITED KHI",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201007",
                  "account_title": "HMB SNSL NEW BANK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201008",
                  "account_title": "ASKARI COMMERCIAL BANK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201009",
                  "account_title": "HABIB METRO BANK (SNSL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201010",
                  "account_title": "ASKARI FOREIGN A/C",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201011",
                  "account_title": "STANDARD CHARTERED BANK (NEW)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201012",
                  "account_title": "STANDARD CHARTERED USD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201014",
                  "account_title": "BANK AL-HABIB SNSL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201015",
                  "account_title": "SAMBA BANK LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201016",
                  "account_title": "HABIB BANK LTD (HBL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201017",
                  "account_title": "CASH BOOK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Cash"
              },
              {
                  "account_no": "1201018",
                  "account_title": "ASKARI BANK LTD (BOSS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201019",
                  "account_title": "BANK AL HABIB ACS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201020",
                  "account_title": "AL FALAH BANK ACS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201021",
                  "account_title": "BANK AL HABIB ACS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201022",
                  "account_title": "MEEZAN BANK (SNSL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201023",
                  "account_title": "HABIB METRO BANK (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201024",
                  "account_title": "HABIB BANK LTD (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201025",
                  "account_title": "SUMMIT BANK TARIQ ROAD BRANCH",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201026",
                  "account_title": "BANK AL HABIB IFA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201027",
                  "account_title": "ASKARI BANK NEW TARIQ RD BR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201028",
                  "account_title": "HMB ACS NEW BANK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201029",
                  "account_title": "BANK AL FALAH  USD  (BOSS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201032",
                  "account_title": "ASKARI  (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201033",
                  "account_title": "SONERI BANK LIMITED (SNSL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201034",
                  "account_title": "SONERI BANK LIMITED (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201035",
                  "account_title": "SONERI BANK LTD. I.F.A",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201036",
                  "account_title": "BANK AL HABIB SNSL NEW",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201037",
                  "account_title": "AL BARAKA BANK (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201038",
                  "account_title": "AL BARAKA BANK (SNSL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              },
              {
                  "account_no": "1201039",
                  "account_title": "CASH RESERVE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Cash"
              },
              {
                  "account_no": "1201040",
                  "account_title": "HBL-FD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Bank"
              }
          ]
      },
      {
          "account_no": "1202",
          "account_title": "ACCOUNT RECEIVABLE",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "P22",
                  "account_title": "ARTISTIC DENIM MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P23",
                  "account_title": "ARTISTIC FABRIC MILLS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P24",
                  "account_title": "ARTISTIC GARMENTS INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P25",
                  "account_title": "AYOOB TEX.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P26",
                  "account_title": "AYOOB TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P27",
                  "account_title": "AZ APPAREL CHAK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P28",
                  "account_title": "AZGARD NINE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P29",
                  "account_title": "BARAKA TEXTILES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P30",
                  "account_title": "BARI TEXTILE MILLS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P31",
                  "account_title": "BATLASONS,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P33",
                  "account_title": "BESTWAY CEMENT LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P34",
                  "account_title": "BHANERO TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P37",
                  "account_title": "CAMBRIDGE GARMENT INDUSTRIES(PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P38",
                  "account_title": "CARE LOGISTICS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P40",
                  "account_title": "CENTURY ENGINEERING INDUSTRIES (PVT)LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P41",
                  "account_title": "CHAWALA ENTERPRISES TEXTILES MANUFA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P42",
                  "account_title": "CONVENIENCE FOOD INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P43",
                  "account_title": "CRESCENT COTTON MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P44",
                  "account_title": "D.K INDUSTRIES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P47",
                  "account_title": "DIAMOND FABRICS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P48",
                  "account_title": "DOUBLE \"A\" INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P49",
                  "account_title": "DYNAMIC PACKAGING PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P50",
                  "account_title": "EMBASSY OF DENMARK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P51",
                  "account_title": "EUR LOGISTICS SERVICES PAKISTAN PRIVATE LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P53",
                  "account_title": "FAZAL & CO.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P54",
                  "account_title": "FEROZE1888 MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P55",
                  "account_title": "FINE GROUP INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P56",
                  "account_title": "FIRST AMERICAN CORPORATION (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P57",
                  "account_title": "FOURTEX APPARELS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P58",
                  "account_title": "FULLMOON ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P59",
                  "account_title": "G.I.ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P60",
                  "account_title": "GLOBAL TECHNOLOGIES & SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P61",
                  "account_title": "GUJRANWAL FOOD INDUSTRIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P62",
                  "account_title": "H & H MARINE PRODUCTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P63",
                  "account_title": "HAMID LEATHER (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P64",
                  "account_title": "HAYAT KIMYA PAKISTAN (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P65",
                  "account_title": "HEALTHY SALT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P66",
                  "account_title": "HERBION PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P67",
                  "account_title": "HOM QUALITY FOODS (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P68",
                  "account_title": "HUB-PAK SALT REFINERY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P69",
                  "account_title": "HUSSAIN LEATHER CRAFT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P70",
                  "account_title": "INDUS HOME LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P72",
                  "account_title": "INTERNATIONAL BUSINESS HUB.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P73",
                  "account_title": "INTERNATIONAL TEXTILE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P75",
                  "account_title": "J.B CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P76",
                  "account_title": "JAFFSON ENTERPRISES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P77",
                  "account_title": "JAWA INDUSTRY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P78",
                  "account_title": "JB INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P79",
                  "account_title": "JK SPINNING MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P81",
                  "account_title": "JUBILEE KNITWEAR INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P82",
                  "account_title": "KARSAZ TEXTILE INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P83",
                  "account_title": "KHADIJA INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P84",
                  "account_title": "KOHINOOR MILLS LIMITED (DYING DIV)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P85",
                  "account_title": "KZ HOSIERY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P87",
                  "account_title": "LEATHER FIELD (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P88",
                  "account_title": "LIBERMANN INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P89",
                  "account_title": "LONGVIEW (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P90",
                  "account_title": "LOTTE KOLSON (PVT.) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P91",
                  "account_title": "LUCKY TEXTILE MILLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P92",
                  "account_title": "M. MAQSOOD CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P93",
                  "account_title": "M.K KNITS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P94",
                  "account_title": "MAGNACRETE PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P96",
                  "account_title": "MARVA EXPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P98",
                  "account_title": "MASS APPARELS & FABRICS (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P99",
                  "account_title": "MASTER MOTORS CORP (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P100",
                  "account_title": "MEHRAN MARBLE INDUSTRIES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P101",
                  "account_title": "MEHRAN MARMI INDUSTRIES PVT.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P102",
                  "account_title": "MEHRAN SPICE & INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P103",
                  "account_title": "METALLOGEN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P104",
                  "account_title": "METROTEX INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P105",
                  "account_title": "MILESTONE TEXTILES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P106",
                  "account_title": "MN TEXTILES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P107",
                  "account_title": "MUSTAQIM DYEING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P109",
                  "account_title": "NATIONAL REFINERY LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P110",
                  "account_title": "NAVEENA INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P111",
                  "account_title": "NAZEER APPARELS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P112",
                  "account_title": "NETWORK ASIA LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P113",
                  "account_title": "NEW MALIK & ASSOCIATES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P115",
                  "account_title": "NISHAT MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P116",
                  "account_title": "NIZAMIA APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P117",
                  "account_title": "NUTRALFA AGRICOLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P120",
                  "account_title": "OOCL LOGISTICS PAKISTAN (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P121",
                  "account_title": "PAK ARAB PIPELINE COMPANY LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P122",
                  "account_title": "PAK SUZUKI MOTOR CO LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P123",
                  "account_title": "PAKISTAN ONYX MARBLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P124",
                  "account_title": "PAXAR PAKISTAN (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P125",
                  "account_title": "PELIKAN KNITWEAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P127",
                  "account_title": "PROCESS INDUSTRY PROCUREMENT CONSULTANTS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P128",
                  "account_title": "RAUF UNIVERSAL SHIPPING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P129",
                  "account_title": "REEMAXE GROUP OF INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P130",
                  "account_title": "REVEL INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P132",
                  "account_title": "ROYAL TREND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P134",
                  "account_title": "S.AHMED GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P135",
                  "account_title": "S.M. TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P136",
                  "account_title": "SAMI RAGS ENTERPRISES 74",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P137",
                  "account_title": "SANALI SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P138",
                  "account_title": "SAPPHIRE FIBRES LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P139",
                  "account_title": "SAPPHIRE FINISHING MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P140",
                  "account_title": "SARENA INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P141",
                  "account_title": "SCANZA ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P142",
                  "account_title": "SCS EXPRESS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P143",
                  "account_title": "SEA BLUE LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P144",
                  "account_title": "SESIL PVT LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P145",
                  "account_title": "SHADDAN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P146",
                  "account_title": "SHAFI GLUCOCHEM (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P147",
                  "account_title": "SHAFI TEXCEL LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P148",
                  "account_title": "SHIP THROUGH LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P149",
                  "account_title": "SK STONES (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P150",
                  "account_title": "SOLEHRE BROTHERS INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P151",
                  "account_title": "SONIC TEXTILE INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P153",
                  "account_title": "STELLA SPORTS,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P154",
                  "account_title": "STUDIO MARK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P155",
                  "account_title": "SULTAN C/O MR. FAISAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P156",
                  "account_title": "SULTEX INDUSTRIES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P157",
                  "account_title": "SUNTEX APPAREL INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P158",
                  "account_title": "SUPREME RICE MILLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P159",
                  "account_title": "SURGICON LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P160",
                  "account_title": "SYNERGY LOGISTICS PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P161",
                  "account_title": "TAJ INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P162",
                  "account_title": "TALON SPORTS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P163",
                  "account_title": "TRANDS APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P164",
                  "account_title": "Thread Experts",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P165",
                  "account_title": "UNITED TOWEL EXPORTERS(PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P166",
                  "account_title": "URWA INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P167",
                  "account_title": "USMAN & SONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P168",
                  "account_title": "USSK TEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P169",
                  "account_title": "UTOPIA INDUSTRIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P170",
                  "account_title": "UZAIR INTERNAITONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P171",
                  "account_title": "Universal Logistics Services (Pvt.) Ltd.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P172",
                  "account_title": "VISION TECHNOLOGIES CORPORATION PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P173",
                  "account_title": "YASHA TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P174",
                  "account_title": "Z.R SPORTS COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P176",
                  "account_title": "ZAHABIYA CHEMICAL INDUSTRIES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P178",
                  "account_title": "ZENITH TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P179",
                  "account_title": "ZEPHYR TEXTILES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P180",
                  "account_title": "ZUBISMA APPARLE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1029",
                  "account_title": "SAEED KHAN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1030",
                  "account_title": "SAFAI INTERNATIONAL.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1031",
                  "account_title": "SAFINA LOGISTICS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1032",
                  "account_title": "SAIM MOBEEN FOOD INDUSTRIES LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1034",
                  "account_title": "SAJJAN S/O IBRAHIM.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1035",
                  "account_title": "SALIMUSA SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1036",
                  "account_title": "SALMIS FURNISHERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1039",
                  "account_title": "SAPPHIRE FINISHING MILLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1040",
                  "account_title": "SARENA TEXTILE INDUSTRIES (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1041",
                  "account_title": "SAUDI PAK LIVE STOCK (KHURSHEED)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1042",
                  "account_title": "SAUDI PAK LIVE STOCK (POTATO)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1043",
                  "account_title": "SAUDI PAK LIVE STOCK MEAT CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1044",
                  "account_title": "SAVILLE WHITTLE INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1045",
                  "account_title": "SAZ INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1046",
                  "account_title": "SCHAZOO PHARMACEUTICAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1047",
                  "account_title": "SEA GOLD (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1048",
                  "account_title": "SEA WAY LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1049",
                  "account_title": "SEAGULL SHIPPING & LOGISTICS  (PVT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1050",
                  "account_title": "SERENE AIR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1051",
                  "account_title": "SERVICE INDUSTRIES LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1052",
                  "account_title": "SERVOPAK SHIPPING AGENCY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1053",
                  "account_title": "SERVOTECH PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1054",
                  "account_title": "SEVEN STAR INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1055",
                  "account_title": "SG MANUFACTURER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1056",
                  "account_title": "SHADAB CORP",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1058",
                  "account_title": "SHAHAB GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1059",
                  "account_title": "SHAHEEN AIR INT'L LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1060",
                  "account_title": "SHAHEEN AIR INTL LTD (2)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1061",
                  "account_title": "SHAHID & SONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1062",
                  "account_title": "SHAHZAD APPARELS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1063",
                  "account_title": "SHANCO SPORTS CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1064",
                  "account_title": "SHANGRILA FOODS (PRIVATE) LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1065",
                  "account_title": "SHEKHANI INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1067",
                  "account_title": "SINE INTERNATIONAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1068",
                  "account_title": "SITARA CHEMICAL INDS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1069",
                  "account_title": "SKY LINKERS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1070",
                  "account_title": "SMA ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1071",
                  "account_title": "SMS CHEMICAL INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1072",
                  "account_title": "SNS IMPEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1074",
                  "account_title": "SPORTS CHANNEL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1075",
                  "account_title": "SQ COMMODITIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1076",
                  "account_title": "STAR SHIPPING (PVT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1077",
                  "account_title": "STARPAK MARTIAL ARTS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1078",
                  "account_title": "STITCH LINE APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1079",
                  "account_title": "STYLO SHOES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1081",
                  "account_title": "SUN INDUSTRIAL EQUIPMENT PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1083",
                  "account_title": "SUNNY ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1085",
                  "account_title": "SUNNY INT'L",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1086",
                  "account_title": "SURYA SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1087",
                  "account_title": "SWIFT SHIPPING (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1089",
                  "account_title": "T S MARBLE INDUSTRY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1090",
                  "account_title": "TABO GUGOO INDUSTRIES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1091",
                  "account_title": "TAJ ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1092",
                  "account_title": "TEAM FREIGHT MANAGEMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1093",
                  "account_title": "TETRA PAK PAKISTAN LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1094",
                  "account_title": "TEX KNIT INT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1095",
                  "account_title": "TEX-KNIT INT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1096",
                  "account_title": "TEXTILE CHANNEL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1097",
                  "account_title": "TEXTILE VISION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1098",
                  "account_title": "THE CRESCENT TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1099",
                  "account_title": "THE INDUS HOSPITAL & HEALTH NETWORK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1100",
                  "account_title": "THE LEATHER COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1101",
                  "account_title": "THE ORGANIC MEAT COMPANY (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1102",
                  "account_title": "THE SPORT STORE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1103",
                  "account_title": "THE TREASURER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1104",
                  "account_title": "TNG  LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1106",
                  "account_title": "TRADE INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1107",
                  "account_title": "U & I GARMENTS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1108",
                  "account_title": "U.K MARTIAL ARTS INTERNATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1109",
                  "account_title": "UNI CRAFT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1110",
                  "account_title": "UNIBIS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1111",
                  "account_title": "UNIBRO INDUSTRIES LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1112",
                  "account_title": "UNICORP INSTRUMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1113",
                  "account_title": "UNION CARGO (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1114",
                  "account_title": "UNION FABRICS PRIVATE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1115",
                  "account_title": "UNIQUE ENTERPRISES (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1116",
                  "account_title": "UNIQUE MARITIME",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1117",
                  "account_title": "UNISHIP GLOBAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1118",
                  "account_title": "UNISHIP GLOBAL SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1119",
                  "account_title": "UNISHIP PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1120",
                  "account_title": "UNITED TOWEL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1121",
                  "account_title": "UNIVERSAL FREIGHT SYSTEMS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1122",
                  "account_title": "UNIVERSAL SHIPPING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1123",
                  "account_title": "VENUS GLOBAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1125",
                  "account_title": "VISION AIR INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1127",
                  "account_title": "VISION TECHNOLOGIES CORPORATION (PRIVATE) L",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1130",
                  "account_title": "WATER REGIME (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1131",
                  "account_title": "WELCOME SHIPPING AIDS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1132",
                  "account_title": "WELDON INSTRUMENTS.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1133",
                  "account_title": "WILD ORCHARD (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1134",
                  "account_title": "WINGS EXPRESS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1135",
                  "account_title": "WORLD LINK SHIPPING AGENCY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1137",
                  "account_title": "WUSQA INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P623",
                  "account_title": "XPRESS AVIATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1138",
                  "account_title": "XPRESS LOGISTICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1142",
                  "account_title": "ZADAF ( PVT ) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P884",
                  "account_title": "JAHANZAIB MISBAH",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P885",
                  "account_title": "JAMAL DIN LEATHER IMPEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P887",
                  "account_title": "JAUN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P888",
                  "account_title": "JEHANGIR KHAN INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P889",
                  "account_title": "JEHANZEB MUHMAND & CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P890",
                  "account_title": "JOONAID CO.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P891",
                  "account_title": "K-ELECTRIC LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P892",
                  "account_title": "K.A. ENTERPRISES PRIVATE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P893",
                  "account_title": "K.B. ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P894",
                  "account_title": "K.P INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P895",
                  "account_title": "KAMAL TEXTILE MILLS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P896",
                  "account_title": "KAMRAN C/O GERRY'S",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P899",
                  "account_title": "KARACHI CARGO SERVICES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P900",
                  "account_title": "KAYSONS INTERNATIONAL (PVT.) L",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P901",
                  "account_title": "KHATTAK TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P902",
                  "account_title": "KIMPEX SPORTS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P903",
                  "account_title": "KOHAT CEMENT COMPANY LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P904",
                  "account_title": "KOHINOOR TEXTILES MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P905",
                  "account_title": "KRISHNA SPORTS CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P906",
                  "account_title": "LAKHANAY SILK MILLS (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P907",
                  "account_title": "LASER SPORTS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P908",
                  "account_title": "LIBERTY MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P909",
                  "account_title": "LOGWAYS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P910",
                  "account_title": "LOJISTICA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P911",
                  "account_title": "M. A. ARAIN & BROTHERS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P912",
                  "account_title": "M.R. INDUSTRIES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P913",
                  "account_title": "M.T TECHNIQUES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P914",
                  "account_title": "M.TAYYAB M.SHOAIB TRADING CORP.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P915",
                  "account_title": "M/S BOX RING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P916",
                  "account_title": "MACHTRADE CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P917",
                  "account_title": "MACRO EXPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P918",
                  "account_title": "MAHAD SPORTS WEAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P919",
                  "account_title": "MAHMOOD BROTHERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P920",
                  "account_title": "MALIK SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P921",
                  "account_title": "MAMA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P922",
                  "account_title": "MAP ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P924",
                  "account_title": "MAQSOOD TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P925",
                  "account_title": "MAROOF INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P926",
                  "account_title": "MASHRIQ GEMS.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P927",
                  "account_title": "MASTER TEXTILE MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P929",
                  "account_title": "MAVRK JEANS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P930",
                  "account_title": "MAXPEED SHIPPING & LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P932",
                  "account_title": "MEDISPOREX (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P933",
                  "account_title": "MEHAR CARGO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P934",
                  "account_title": "MEHER AND CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P936",
                  "account_title": "METAL MASTERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P937",
                  "account_title": "MINZI INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P938",
                  "account_title": "MISC. (PERSONAL BAGG/EFECT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P939",
                  "account_title": "MISL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P941",
                  "account_title": "MISTIQUBE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P942",
                  "account_title": "MOHSIN TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P944",
                  "account_title": "MRS RAFIKA ABDUL KHALIQ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P945",
                  "account_title": "MRS. AZRA ASIF SATTAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P946",
                  "account_title": "MS HINA SHARIQ / C/O SHAHID SAHAB",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P947",
                  "account_title": "MUEED ESTABLISHMENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P948",
                  "account_title": "MUHAMMAD NAWAZ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P950",
                  "account_title": "MUSHKO PRINTING SOLUTIONS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P951",
                  "account_title": "MUSHTAQ INTERNATIONAL TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P952",
                  "account_title": "MUSTAFA & COMPANY (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P953",
                  "account_title": "MUSTAQIM DYING & PRINTING INDUSTRIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P954",
                  "account_title": "MUTABAL FOOD LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P955",
                  "account_title": "MY CARGO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P956",
                  "account_title": "MY LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P959",
                  "account_title": "NABIQASIM INDUSTRIES PVT LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P960",
                  "account_title": "NAIZMH ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P961",
                  "account_title": "NASARUN EXPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P962",
                  "account_title": "NAUTILUS GLOBAL MARINE SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P963",
                  "account_title": "NAVEENA EXPORTS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P966",
                  "account_title": "NFK EXPORTS ( PVT ) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P967",
                  "account_title": "NIAZ GARMENTS INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P969",
                  "account_title": "NOOR SONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P970",
                  "account_title": "NOSH FOOD INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P971",
                  "account_title": "NOVA INTERNATIONAL PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P972",
                  "account_title": "NOVA LEATHER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P974",
                  "account_title": "OHRENMANN CARPET PALACE.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P976",
                  "account_title": "ORGANO BOTANICA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P977",
                  "account_title": "ORIENT CARGO SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P978",
                  "account_title": "ORIENT TEXTILE MILLS LIMTED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P979",
                  "account_title": "PACIFIC FREIGHT SYSTEM(PVT)LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P980",
                  "account_title": "PAK APPARELS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P981",
                  "account_title": "PAK AVIATION ENGINEERING SRVS (2)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P982",
                  "account_title": "PAK HYDRAULIC & TRADING CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P983",
                  "account_title": "PAK MINES INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P986",
                  "account_title": "PAK VEGETABLES & FRUITS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P988",
                  "account_title": "PAKISTAN AIR FORCE ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P989",
                  "account_title": "PAKISTAN INTERNATIONAL AIRLINE CORP",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P990",
                  "account_title": "PARAMOUNT TRADING CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P991",
                  "account_title": "PCS LOGISTICS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P992",
                  "account_title": "PEARL SCAFFOLD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P993",
                  "account_title": "PELLE CLASSICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P994",
                  "account_title": "PENNA OVERSEAS CORP",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P995",
                  "account_title": "PERFECT ASSOCIATES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P997",
                  "account_title": "PREMIER TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P999",
                  "account_title": "PRIME COAT PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1000",
                  "account_title": "PROHAND INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1001",
                  "account_title": "PROLINE (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1002",
                  "account_title": "PUNJAB THERMAL POWER PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1003",
                  "account_title": "QUALITY DYEING & FINISHING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1004",
                  "account_title": "QUALITY EXPORT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1005",
                  "account_title": "QUICE FOOD INDUSTRIES LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1007",
                  "account_title": "R.J INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1008",
                  "account_title": "RABI ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1009",
                  "account_title": "RAJA BROTHERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1010",
                  "account_title": "RAJWANI APPAREL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1011",
                  "account_title": "RAJWANI DENIM MILLS (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1012",
                  "account_title": "RANI & COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1013",
                  "account_title": "REAL STAR SURGICAL INSTRUMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1014",
                  "account_title": "REHMAT E SHEREEN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1015",
                  "account_title": "RELIANCE COTTON SPINNING MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1016",
                  "account_title": "RIMMER INDUSTRIES (REGD)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1017",
                  "account_title": "RISHAD MATEEN & CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1018",
                  "account_title": "RISING SPORTSWEAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1019",
                  "account_title": "ROSHAN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1020",
                  "account_title": "ROWER SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1021",
                  "account_title": "RUBY COLLECTION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1022",
                  "account_title": "S M DENIM MILLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1024",
                  "account_title": "S.SAQLAINIA ENTERPRISE (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1025",
                  "account_title": "SAARUNG SHIPPING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1026",
                  "account_title": "SACHIN SPORTS INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P5",
                  "account_title": "A. L. GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P6",
                  "account_title": "A.H TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P7",
                  "account_title": "A.I.R INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P8",
                  "account_title": "A.J WORLDWIDE SERVICE PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P9",
                  "account_title": "A.O ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P10",
                  "account_title": "AFRAZ KNIT & STITCH PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P11",
                  "account_title": "AGRO HUB INTERNATIONAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12",
                  "account_title": "AL AMIN EXPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P13",
                  "account_title": "AL KARAM TOWEL INDUSTRIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P14",
                  "account_title": "AL-HAMDOLILLAH EXPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P15",
                  "account_title": "ALI TRADING COMPANY (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P17",
                  "account_title": "AMANIA SUPPORT SERVICES SMC (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P20",
                  "account_title": "ARMS SNACKS FOODS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P703",
                  "account_title": "AFROZE TEXTILE IND (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P704",
                  "account_title": "AIR BLUE LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P706",
                  "account_title": "AIRSIAL ENGINEERING & MAINTENANCE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P712",
                  "account_title": "AL HUSNAIN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P714",
                  "account_title": "AL HUSSAIN TRADRES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P715",
                  "account_title": "AL MASAOOD OIL INDUSTRY SUPPLIES & SERVICES CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P717",
                  "account_title": "AL REHMAN GLOBAL TEX (PVT) LIMITED,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P718",
                  "account_title": "AL SUBUK ENGINEERING ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P721",
                  "account_title": "AL-AZEEM ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P722",
                  "account_title": "AL-FALAH IMPEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P723",
                  "account_title": "AL-MEENA MARINE ENGINEERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P724",
                  "account_title": "AL-SIDDIQ CONSOLIDATOR (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P725",
                  "account_title": "AL-TAYYIBA APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P726",
                  "account_title": "ALAM INTERNATIONAL TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P727",
                  "account_title": "ALI TRADING Co (Pvt) Ltd.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P728",
                  "account_title": "AM LOGISTIC",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P729",
                  "account_title": "AM TECHNOLOGIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P730",
                  "account_title": "AMANULLAH ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P731",
                  "account_title": "AMBALA EXPORT TRADING CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P733",
                  "account_title": "ANAS TROPICAL PRU & VEG EXPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P734",
                  "account_title": "ANDREW PAINTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P736",
                  "account_title": "AQSA INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P737",
                  "account_title": "ARABIAN ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P738",
                  "account_title": "ARIES LOGISTICS (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P739",
                  "account_title": "ARSAM SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P740",
                  "account_title": "ART LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P741",
                  "account_title": "ARTISAN TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P742",
                  "account_title": "ARZOO TEXTILES MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P743",
                  "account_title": "ASIA POULTRY FEEDS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P744",
                  "account_title": "ASSAC CARPETS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P745",
                  "account_title": "ASTUTE SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P746",
                  "account_title": "ATROX INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P747",
                  "account_title": "ATTOCK REFINERY LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P749",
                  "account_title": "AWAN SPORTS INDUSTRIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P750",
                  "account_title": "BACO INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P751",
                  "account_title": "BALMEERA INTERTRADE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P752",
                  "account_title": "BARKET FIRTILIZERS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P754",
                  "account_title": "BILAL & COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P755",
                  "account_title": "BOLA GEMA- PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P756",
                  "account_title": "BOX RING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P757",
                  "account_title": "BRIGHT SAIL PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P758",
                  "account_title": "BROTHERS PRODUCTION PVT LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P759",
                  "account_title": "BUKSH CARPET",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P760",
                  "account_title": "BUREAU VERITAS PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P761",
                  "account_title": "CAPITAL SPORTS CORPORATION (PVT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P762",
                  "account_title": "CARGO AND COMMODITIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P763",
                  "account_title": "CARGO CRYSTAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P765",
                  "account_title": "CARGO TRACK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P767",
                  "account_title": "CASUAL CLOTHING CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P768",
                  "account_title": "CELERITY SUPPLY CHAIN (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P769",
                  "account_title": "CENTRAL ORDINANCE AVIATION DEPOT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P770",
                  "account_title": "CHADHARY IJAZ AHMAD & SONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P771",
                  "account_title": "CHEEMA BROTHERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P772",
                  "account_title": "CHENAB APPAREL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P773",
                  "account_title": "CHT PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P774",
                  "account_title": "CIVIL AVIATION AUTHORITY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P775",
                  "account_title": "COMBINED LOGISTICS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P776",
                  "account_title": "COMET SPORTS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P777",
                  "account_title": "COMMANDING OFFICER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P778",
                  "account_title": "COMPANION SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P779",
                  "account_title": "CONSOLIDATION SHIPPING &",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P780",
                  "account_title": "CONTINENTAL TEXTILES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P781",
                  "account_title": "CORAL ENTERPRISES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P782",
                  "account_title": "COTTON CLUB",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P783",
                  "account_title": "CROSS WEAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P784",
                  "account_title": "D.G. Khan Cement Co. Ltd",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P785",
                  "account_title": "DANISH TRADERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P786",
                  "account_title": "DAWOOD MEAT COMPANY (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P787",
                  "account_title": "DEEPSEA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P788",
                  "account_title": "DELTEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P791",
                  "account_title": "DIGITAL APPAREL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P792",
                  "account_title": "DIGRACIA KNITS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P793",
                  "account_title": "DISTRICT CONTROLLER OF STORES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P794",
                  "account_title": "DIVINE LOGISTICS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P796",
                  "account_title": "DYNAMIC TOOLING SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P797",
                  "account_title": "E2E SUPPLY CHAIN MANAGMENT (PVT) LT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P798",
                  "account_title": "EASTWAY GLOBAL FORWARDING LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P799",
                  "account_title": "ECU LINE PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P801",
                  "account_title": "EESHOO TOYS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P802",
                  "account_title": "ELEGANT Co",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P803",
                  "account_title": "ENGINEERING SOLUTIONS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P804",
                  "account_title": "ENGRO POWERGEN QADIRPUR LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P805",
                  "account_title": "EURO SUPPLY CHAIN & LOGISTICS SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P806",
                  "account_title": "EUROTEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P808",
                  "account_title": "F.E.B INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P809",
                  "account_title": "FAHAD INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P810",
                  "account_title": "FAIRDEAL MILLS (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P811",
                  "account_title": "FAISAL FABRICS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P812",
                  "account_title": "FAISAL SPINNING MILLS LTD FINISHING UNIT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P814",
                  "account_title": "FAST & FINE CARGO SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P815",
                  "account_title": "FAST FLY IMPEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P816",
                  "account_title": "FATIMA WEAVING MILLS (PVT)LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P817",
                  "account_title": "FAUJI FRESH N FREEZE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P818",
                  "account_title": "FAZAL CLOTH MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P819",
                  "account_title": "FAZAL REHMAN FABRICS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P821",
                  "account_title": "FILTRADER PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P822",
                  "account_title": "FINE COTTON TEXTILES.,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P823",
                  "account_title": "FOODEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P824",
                  "account_title": "FORCE FIVE PVT LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P825",
                  "account_title": "FORTE LOGISTICS SOLUTIONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P826",
                  "account_title": "G.M FASHION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P827",
                  "account_title": "GARATEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P831",
                  "account_title": "GETZ PHARMA (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P832",
                  "account_title": "GLOBAL CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P833",
                  "account_title": "GLOBAL LOGISTICS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P834",
                  "account_title": "GLOBE X LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P835",
                  "account_title": "GLOBELINK PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P836",
                  "account_title": "GLOW PAK INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P837",
                  "account_title": "GOLD & SILVER TITANIUM IND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P838",
                  "account_title": "GREEN BRIDGE ENTERPRISE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P840",
                  "account_title": "GUL AHMED TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P841",
                  "account_title": "GULF CHEMICALS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P843",
                  "account_title": "HADI RASHEED SAIYID",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P844",
                  "account_title": "HAFIZ TANNERY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P845",
                  "account_title": "HAFIZ TANNERY (IMPORT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P847",
                  "account_title": "HAMZA ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P848",
                  "account_title": "HANA CARPETS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P849",
                  "account_title": "HANZ TILES & CERAMICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P850",
                  "account_title": "HASHI CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P851",
                  "account_title": "HASNAIN CARGO SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P852",
                  "account_title": "HASSAN INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P855",
                  "account_title": "HI JEANS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P856",
                  "account_title": "HIGHWAY LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P858",
                  "account_title": "HONEST FOOD PRODUCTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P860",
                  "account_title": "HORIZAN MFG CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P861",
                  "account_title": "IBRAHIM ASSOCIATES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P862",
                  "account_title": "IDREES (CARGO LINKERS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P863",
                  "account_title": "IEDGE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P864",
                  "account_title": "IMRAN BROTHERS.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P865",
                  "account_title": "IMTCO PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P866",
                  "account_title": "INDEPENDENT OIL TOOLS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P868",
                  "account_title": "INT'L AIR & SEA CARGO SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P869",
                  "account_title": "INT'L TEXTILE DISTRIBUTORS INC",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P870",
                  "account_title": "INTER FREIGHT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P871",
                  "account_title": "INTER FREIGHT - SAJID",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P872",
                  "account_title": "INTERNATIONAL BUSINESS CENTRE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P873",
                  "account_title": "INTERNATIONAL BUSINESS CENTRE.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P874",
                  "account_title": "INTERNATIONAL CARGO MANAGEMENT (ICM)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P876",
                  "account_title": "IRAN & BUKHARA PALACE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P877",
                  "account_title": "IRON FIST IMPEX (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P879",
                  "account_title": "ISMAIL SPORTS GARMENTS IND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P880",
                  "account_title": "ITD TEXTILES (PVT.) LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P881",
                  "account_title": "JAFFER AGRO SERVICES (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P882",
                  "account_title": "JAGTEX (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1812",
                  "account_title": "KAYSONS INTERNATIONAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010118",
                  "account_title": "AL-GHOSIA IND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010151",
                  "account_title": "ITTEFAQ TRADING CO.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCU-00647",
                  "account_title": "PAKISTAN INTERNATIONAL AIRLINES CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCU-00013",
                  "account_title": "PROLINE (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCU-00721",
                  "account_title": "SAAR INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCU-00902",
                  "account_title": "Sadaf Enterprises",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCU-00146",
                  "account_title": "SOORTY ENTERPRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "PCC-11914",
                  "account_title": "IMRAN BROTHERS TEXTILE (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010139",
                  "account_title": "REPSTER WEARS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010144",
                  "account_title": "RAJCO INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1802",
                  "account_title": "NUTEX INTERNATIONAL ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1804",
                  "account_title": "FAISAL FABRICS LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1805",
                  "account_title": "A.L. GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1806",
                  "account_title": "SIDDIQSONS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1807",
                  "account_title": "THE DESIGNER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1808",
                  "account_title": "EASTERN SPINNING MILLS LILMITED ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P964",
                  "account_title": "NAWAZ FABRICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1809",
                  "account_title": "B A TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1810",
                  "account_title": "TULIP TOWEL IND (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010122",
                  "account_title": "PERFECT FOOD INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010124",
                  "account_title": "THREAD CONNECT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "PCU-00633",
                  "account_title": "DURRANI ASSOCIATES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "PCC-00884",
                  "account_title": "HANA CARPET",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010128",
                  "account_title": "SUNRISE ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010130",
                  "account_title": "BLUEJET ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010131",
                  "account_title": "SUBLI MASTER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P36",
                  "account_title": "CAAV GROUP",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010132",
                  "account_title": "STITCHWELL GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P691",
                  "account_title": "A.K ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P692",
                  "account_title": "A.Y LEATHER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P694",
                  "account_title": "AAS MOVING",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P695",
                  "account_title": "ABDUR RAHMAN CORPORATION (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P696",
                  "account_title": "ABID TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P698",
                  "account_title": "ADNAN APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P699",
                  "account_title": "AERO EXPRESS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P700",
                  "account_title": "AERTEX ENTERPRISES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1755",
                  "account_title": "SHARIF & ELAHI CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1769",
                  "account_title": "M.N. TEXTILES (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1773",
                  "account_title": "SONIC TEXTILE INDUSTRIES (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1774",
                  "account_title": "DANIYAL ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1790",
                  "account_title": "LEATHER COORDINATOR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1791",
                  "account_title": "MAHEEN TEXTILE MILLS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P1797",
                  "account_title": "LANAM INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010163",
                  "account_title": "CREST ARTCRAFT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010170",
                  "account_title": "AIR & SEA LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010174",
                  "account_title": "ENGLISH FASHION.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010176",
                  "account_title": "Hilal Foods (Pvt.) Ltd.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010179",
                  "account_title": "GLS INTL.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010188",
                  "account_title": "A.R. HOSIERY WORKS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010194",
                  "account_title": "HERMAIN ENTERPRISE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010198",
                  "account_title": "ALLIED TRADING CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010200",
                  "account_title": "LUCERNA TRADING DMCC C/OF: ABM INFO TECH (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P764",
                  "account_title": "CARGO SOLUTION SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010215",
                  "account_title": "WORLD G CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010217",
                  "account_title": "H.NIZAM DIN AND SONS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010231",
                  "account_title": "ANSA INDUSTRIES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010232",
                  "account_title": "SCS EXPRESS PVT LTD CUSTOMER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010234",
                  "account_title": "SPONA SPORTS.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010238",
                  "account_title": "AHMED FINE WEAVING LTD.,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010239",
                  "account_title": "COLONY TEXTILE MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010240",
                  "account_title": "NISHAT (CHUNIAN) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010242",
                  "account_title": "ROBIQA ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010251",
                  "account_title": "FIRST STONE CORPORATION PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010257",
                  "account_title": "MARK ONE SURGICAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010260",
                  "account_title": "SAMZ APPAREL ( PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010273",
                  "account_title": "SUNRISE EXPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010278",
                  "account_title": "FULLMOON ENTERPRISES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010294",
                  "account_title": "PAKISTAN NAVY C/O COMMANDING OFFICER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010297",
                  "account_title": "SHAFI LIFESTYLE (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010299",
                  "account_title": "Raheel Amanullah ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010281",
                  "account_title": "ABDUL WASI ULFAT S/O ABDUL HADI ULFAT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010302",
                  "account_title": "DARSON INDUSTRIES (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010307",
                  "account_title": "WITTVOLK EUROPE INTERNATIONAL GENERAL TRADING LLC",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010317",
                  "account_title": "GE HYDRO FRANCE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010339",
                  "account_title": "AL TAYYIBA APPAREL.,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010340",
                  "account_title": "JAGUAR APPAREL (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010346",
                  "account_title": "SULTANIA GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010351",
                  "account_title": "DANCO FRESH",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P118",
                  "account_title": "NUTRALFA PRIVATE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010356",
                  "account_title": "EMBASSY OF DENMARK.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010333",
                  "account_title": "F.B. INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010388",
                  "account_title": "AL-MADINAH ISLAMIC RESEARCH CENTRE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010398",
                  "account_title": "TAHIR CARPETS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010400",
                  "account_title": "AERTEX SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010405",
                  "account_title": "ARRIZA GROUP",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010391",
                  "account_title": "THE ORGANIC MEAT COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010394",
                  "account_title": "RANS INTL FREIGHT FOWARDING CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010415",
                  "account_title": "QST INTERNATIONAL.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010419",
                  "account_title": "JAGUAR APPAREL (PRIVATE) LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010421",
                  "account_title": "TROUT APPAREL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010424",
                  "account_title": "TRIMCO PAKISTAN (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010433",
                  "account_title": "NLC MARINE & AIR SERVICES.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010439",
                  "account_title": "DALDA FOODS LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010441",
                  "account_title": "MEZAN TEA (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010442",
                  "account_title": "THE PARACHA TEXTILE MILLS LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010444",
                  "account_title": "JAVED AHMED KAIMKHANI",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010446",
                  "account_title": "JAY + ENN SAFETY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010454",
                  "account_title": "THAR COAL BLOCK-1 POWER GENERATION COMPANY (PVT) L",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010469",
                  "account_title": "SNA TRADERS.CO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010477",
                  "account_title": "HUGO SPORT PAK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010479",
                  "account_title": "STITCHWELL GARMENTS.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010481",
                  "account_title": "ROOMI FABRICS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010482",
                  "account_title": "MASOOD FABRICS LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010484",
                  "account_title": "UNIVERSAL CABLES INDUSTRIES LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010514",
                  "account_title": "KHALID OVERSEAS CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010497",
                  "account_title": "NAZ TEXTILES (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010518",
                  "account_title": "CENTRAL SURGICAL CO. (PVT) LTD.,",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010523",
                  "account_title": "GOHAR TEXTILE MILLS PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010525",
                  "account_title": "PERFECT GLOVES MANUFACTURER CO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010527",
                  "account_title": "ABRAR ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010530",
                  "account_title": "ECO GREEN / UK COURIER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010537",
                  "account_title": "CRETESOL (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010539",
                  "account_title": "AOL APPAREL PRIVATE LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P958",
                  "account_title": "Muhammad Jahangir Enterprises",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010551",
                  "account_title": "RANA IMPEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010557",
                  "account_title": "Blow Plast (Pvt) Limited",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010561",
                  "account_title": "PAK FASHEO CLOTHING COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010564",
                  "account_title": "IMRAN @ ALLIED LOG",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010565",
                  "account_title": "ANABIA GARMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010567",
                  "account_title": "ASK SHIPPING AND LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010570",
                  "account_title": "PIK PAK INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010572",
                  "account_title": "QASIM INTERNATIONAL CONTAINER TERMINAL PAKISTAN LT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010589",
                  "account_title": "Jilani Shipping International",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010597",
                  "account_title": "SHEIKH MUHAMMAD SAEED & SONS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010608",
                  "account_title": "ADAMJEE ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010628",
                  "account_title": "SHAN CARGO",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010629",
                  "account_title": "MASUM LOGISTICS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010631",
                  "account_title": "CASUAL CLOTHING CO. ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010633",
                  "account_title": "KITARIYA BROTHERS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010639",
                  "account_title": "VELOCITY SOLUTIONS ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010642",
                  "account_title": "GLOBEX SAFETY (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010622",
                  "account_title": "SUNSHINE GLOVES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010650",
                  "account_title": "AK GROUP ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010662",
                  "account_title": "PERFORMANCE SURGICAL INSTRUMENTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010665",
                  "account_title": "ZIL LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010672",
                  "account_title": "TEKNOKRAT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010678",
                  "account_title": "ECOM LOGISTIX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010681",
                  "account_title": "REMO SPORTS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010688",
                  "account_title": "CONTINENTAL TOWELS  (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010700",
                  "account_title": "KUMAIL GLOVES INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010703",
                  "account_title": "CMYK SERVICES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010718",
                  "account_title": "GILLANI INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010731",
                  "account_title": "MUSTHAFA IMRAN AHMED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010759",
                  "account_title": "PETRO SOURCING (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010761",
                  "account_title": "CARE MEDICAL SUPPLIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010765",
                  "account_title": "ALPINE INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010776",
                  "account_title": "MDS COMPANY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010781",
                  "account_title": "KARIMA TEXTILE RECYCLER (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010782",
                  "account_title": "RAVI ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010801",
                  "account_title": "FAISAL SPINNING MILLS TLD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010804",
                  "account_title": "GHANI GLASS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010812",
                  "account_title": "CP PAKISTAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010815",
                  "account_title": "LIGHT PAK GLOBAL INDUSTRIES (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010816",
                  "account_title": "ARTISTIC MILLINERS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010826",
                  "account_title": "SSD TRADING INC",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010830",
                  "account_title": "DUKE TEXTILES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010841",
                  "account_title": "HAMMAD TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010842",
                  "account_title": "BABRI IMP.,EXP & DIST",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010844",
                  "account_title": "TRANSACT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010847",
                  "account_title": "ENGRO POLYMERAND CHEMICALS LIMITED.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010849",
                  "account_title": "YUNUS TEXTILE MILLS LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010851",
                  "account_title": "PAK HUA INDUSTRIAL CO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010855",
                  "account_title": "BABRI IMP.,EXP. & DIST",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010858",
                  "account_title": "AQSA INDUSTRIES (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010859",
                  "account_title": "LEATHER ENGINEER CO.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010875",
                  "account_title": "A.U. TEXTILE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010882",
                  "account_title": "LAKHANI INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010866",
                  "account_title": "KERRY FREIGHT PAKISTAN (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010909",
                  "account_title": "FINE GRIP IMPORT EXPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010918",
                  "account_title": "AL KAREEM TEXTILES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010920",
                  "account_title": "Q.N.ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010926",
                  "account_title": "ZEPHYR TEXTILES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010928",
                  "account_title": "Transways Supply chain Management ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010930",
                  "account_title": "TECHNICARE CORPORATION",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010932",
                  "account_title": "PANTHER TYRES LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010935",
                  "account_title": "HIGH SAFETY INDUSTRY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010939",
                  "account_title": "THAPUR PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010945",
                  "account_title": "DOWELL SCHLUMBERGER (WESTERN) ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010969",
                  "account_title": "KPDC FOOD & SPECIALTY CHEMICALS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010971",
                  "account_title": "SHABBIR INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010972",
                  "account_title": "I.Q KNITWEAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010973",
                  "account_title": "AMFSH INDUSTRY",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010976",
                  "account_title": "Askari Chartered Services (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010981",
                  "account_title": "CITROPAK LIMITED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010952",
                  "account_title": "SAMARTEX",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010957",
                  "account_title": "TUF PAK SPORTS WORKS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010962",
                  "account_title": "S.S. MEDIDENT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              },
              {
                  "account_no": "P12010990",
                  "account_title": "KAREEM QUALITY RAGS (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer"
              }
          ]
      },
      {
          "account_no": "1205",
          "account_title": "ADVANCES TO DIRECTORS",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1205001",
                  "account_title": "DIRECTOR 1",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1205002",
                  "account_title": "DIRECTOR 2",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1206",
          "account_title": "ADVANCES TO BRANCHES",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "1207",
          "account_title": "ADVANCES & PREPAYMENTS",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1207001",
                  "account_title": "SECURITY DEPOSIT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207002",
                  "account_title": "ADVANCE OFFICE RENT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207003",
                  "account_title": "MULTINATE   (INTERNET)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207004",
                  "account_title": "LEASE DEPOSITS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207005",
                  "account_title": "PTC",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207006",
                  "account_title": "STANDARD SERVICE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207007",
                  "account_title": "FUEL DEPOSIT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207008",
                  "account_title": "CONTAINER DEPOSITS",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207009",
                  "account_title": "Sea Net Shipping (LLC)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207011",
                  "account_title": "PIA Advance A/C",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207013",
                  "account_title": "P.I.A BID / TENDER ADVANCE A/C",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207014",
                  "account_title": "SAUDI ARABIA AIRLINE ADVANCE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207015",
                  "account_title": "ADVACE TO INTER-FRET CONSOLIDATOR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207016",
                  "account_title": "ADVANCE TO MEHR CARGO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1207017",
                  "account_title": "FARAZ IOU",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1226",
          "account_title": "ADVANCES TO STAFF",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1226001",
                  "account_title": "STAFF A",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226050",
                  "account_title": "SHAFIULLAH (ACCOUNTS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226051",
                  "account_title": "RASHID EHSAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226052",
                  "account_title": "IKRAM LOADER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226053",
                  "account_title": "SALMAN AZIZ STAFF",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226054",
                  "account_title": "AZHAR HUSSAIN (O/D)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226055",
                  "account_title": "IFTIKHAR AHMED (O/D)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226056",
                  "account_title": "MUHAMMAD SAAD",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226057",
                  "account_title": "MUBASHIR HUSSAIN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226059",
                  "account_title": "AKHTAR A. HAQUE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226060",
                  "account_title": "ATHAR A. HAQUE",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226061",
                  "account_title": "SUNIL (SUNNY ENTERPRISES)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226062",
                  "account_title": "SHAHID SIDDIQUI (ADV)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226063",
                  "account_title": "BILAL AHMED (LHE STAFF) SNSL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226064",
                  "account_title": "MUHAMMAD HANIF (CARGO LINKERS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226065",
                  "account_title": "GHAZANFER (AIRPORT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226066",
                  "account_title": "M. MURSALEEN IBRAHIM",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226067",
                  "account_title": "FARAH SALEEM (ADVANCE)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226068",
                  "account_title": "SHURUQ ANJUM (ADVANCE)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226069",
                  "account_title": "ZUBAIR O/D (ADVANCE)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226070",
                  "account_title": "BABOO SWEEPER (ADVANCE)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226071",
                  "account_title": "ZAIN UL ABDIN O/D",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226072",
                  "account_title": "M.SALMAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226073",
                  "account_title": "MUHAMMAD IRFAN (SEA)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226074",
                  "account_title": "ALI NAEEM",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226075",
                  "account_title": "GHULAM HUSSAIN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226076",
                  "account_title": "IMRAN SB TURKISH AIRLLINES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226077",
                  "account_title": "FAISAL YAMIN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226078",
                  "account_title": "IRSA KAMRAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226079",
                  "account_title": "OFFICE DRIVER  (ARSHAD)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226080",
                  "account_title": "SAAD ALI BUTT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226081",
                  "account_title": "WAQAS ( AIR DEPT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226082",
                  "account_title": "MUHAMMAD ARSALAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226083",
                  "account_title": "REHAN AHMED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226084",
                  "account_title": "NASIR DRIVER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226085",
                  "account_title": "NAZNEEN SYED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226086",
                  "account_title": "FIZA SYED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226087",
                  "account_title": "SADIA KHAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226088",
                  "account_title": "RENEE MITCHEL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226003",
                  "account_title": "SYED KHURSHEED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226004",
                  "account_title": "M. HAMID",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226005",
                  "account_title": "ZAFAR SB CL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226006",
                  "account_title": "ABDUL RASHID",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226007",
                  "account_title": "ASAD ALI",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226008",
                  "account_title": "IMRAN MUSTAFA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226009",
                  "account_title": "SHERYAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226010",
                  "account_title": "KASHIF MALIK",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226011",
                  "account_title": "FARAZ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226012",
                  "account_title": "ABDUL GHAFFAR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226013",
                  "account_title": "MUHAMMAD SABIR",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226014",
                  "account_title": "IBRAHEEM",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226015",
                  "account_title": "OWAIS RAZA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226016",
                  "account_title": "ZEESHAN UL HAQ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226017",
                  "account_title": "ANAS SIDDIQUI",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226018",
                  "account_title": "EJAZ HASHMI",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226019",
                  "account_title": "MUSTAFA (Watchman)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226020",
                  "account_title": "ALI AKBER (Office Boy)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226021",
                  "account_title": "SHAREEF (Office Boy)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226022",
                  "account_title": "SHAKIL UR REHMAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226023",
                  "account_title": "ASIF (PEON)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226024",
                  "account_title": "NASIR (AIRPORT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226025",
                  "account_title": "HAIDER (SEA DEPT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226026",
                  "account_title": "ABDUL REHMAN",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226027",
                  "account_title": "MOHSIN BAIG (BOSS FRND)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226028",
                  "account_title": "NOMAN (AIR DEPT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226029",
                  "account_title": "Hafeez",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226030",
                  "account_title": "Ali Sabir Shah",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226031",
                  "account_title": "ZAHID BHAI (PEARL SCAFFOLD)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226032",
                  "account_title": "MUHAMMAD HASSAN MOOSA",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226033",
                  "account_title": "SUMAIR FAREED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226034",
                  "account_title": "Saeed Ullah Khan",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226035",
                  "account_title": "Waqas Zia",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226036",
                  "account_title": "Asif Shaikh",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226037",
                  "account_title": "Faraz Shair",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226038",
                  "account_title": "Farhan Ali",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226039",
                  "account_title": "Talha Khan",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226040",
                  "account_title": "ZAHID (FEILD)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226041",
                  "account_title": "Shahid (Watch Man)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226042",
                  "account_title": "Raza Ahmed",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226043",
                  "account_title": "Imran Khemani",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226044",
                  "account_title": "HAFEEZ (RIEDER)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226045",
                  "account_title": "FARHAN (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226046",
                  "account_title": "SHEIKH TANVEER KAMAL",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226047",
                  "account_title": "SYED IQBAL AHMED",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1226048",
                  "account_title": "MUHAMMAD ASIF (IMPORT)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "1226002",
          "account_title": "EXECUTIVE STAFF",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "1226049",
          "account_title": "SHAFI ULLAH SHAH",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "1226058",
          "account_title": "SHAHZAIB TAHHIR CLOSED",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "1235",
          "account_title": "SCB USD A/C",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "1249",
          "account_title": "I.O.U",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "1249001",
                  "account_title": "MR.NADEEM AIRPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "1249002",
                  "account_title": "TAIMOOR AIRPORT",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "13",
          "account_title": "OTHER RECEIVABLES",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "13001",
                  "account_title": "RECEIVABLE FROM CARGO LINKER",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "13002",
                  "account_title": "NAIZMAH ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "13003",
                  "account_title": "RENT (AMBER TOWER)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "13005",
                  "account_title": "Air Cargo Services (ACS)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "13006",
                  "account_title": "Sea Net Shipping & Logistics (SNSL)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "13007",
                  "account_title": "SALEEM QAZI (CNEE SALMIS FURNISHER)",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              },
              {
                  "account_no": "P12010432",
                  "account_title": "GARATEX IND",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "120207001",
                  "account_title": "FREIGHT SAVERS SHIPPING CO.LTD  ",
                  "type": "Detail",
                  "catogary": "Asset",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "13004",
          "account_title": "INTERNATIONALFREIGHT AVIATION",
          "type": "Group",
          "catogary": "Asset",
          "sub_category": null,
          "childAccounts": []
      }
  ],
  "Liability": [
      {
          "account_title": "OTHER LIABILITY ACCOUNTS",
          "account_no": "ACC-3",
          "type": "Group",
          "childAccounts": [
              {
                  "account_no": "32",
                  "account_title": "LONG TERM LIABILITIES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "33",
                  "account_title": "LAHORE OFFICE C/A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "34",
                  "account_title": "ACCRUED RECEIVABLE & PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "35",
                  "account_title": "QAMAR ALAM",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "P538",
                  "account_title": "PEGASUS AIRLINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P599",
                  "account_title": "TURKISH AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              }
          ]
      },
      {
          "account_no": "31",
          "account_title": "CURRENT LIABILITIES",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "3116",
                  "account_title": "PAYABLES IMPORT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3117",
                  "account_title": "LEAVE DEDUCTIONS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3118",
                  "account_title": "PAYABLES CLEARING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3119",
                  "account_title": "SEANET SHIPPING L.L.C DXB",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3120",
                  "account_title": "Mr Hamid Payable",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3121",
                  "account_title": "Prepaid Premium",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3122",
                  "account_title": "Telenor Bill Payable",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3123",
                  "account_title": "ACS Payable",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3124",
                  "account_title": "MOBILE BILL PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3125",
                  "account_title": "SESSI & EOBI PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3126",
                  "account_title": "COMPUTERS BILL PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "3103",
          "account_title": "FOREIGN PRINCIPALS PAYABLE",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "P238",
                  "account_title": "3L-LEEMARK LOGISTICS LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P239",
                  "account_title": "A.I. LOGISTICS (M) SDN BHD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P240",
                  "account_title": "ACE BANGLADESH LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P241",
                  "account_title": "ALLPOINTS UNLIMITED, INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P242",
                  "account_title": "AMARINE SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P243",
                  "account_title": "BORUSAN LOJISTIK",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P244",
                  "account_title": "CANWORLD LOGISTICS INC.,",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P245",
                  "account_title": "CARGO LINKERS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P246",
                  "account_title": "CCL LOGISTICS LTD,",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P247",
                  "account_title": "CHINA GLOBAL LINES LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P248",
                  "account_title": "CIMC GOLD WIDE TECHNOLOGY LOGISTICS GROUP CO.,LIMI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P249",
                  "account_title": "CMA CS REFUND",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P250",
                  "account_title": "COLE INTERNATIONAL INC.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P251",
                  "account_title": "COMPASS SEA & AIR CARGO LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P252",
                  "account_title": "CONTAINER FREIGHT STATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P253",
                  "account_title": "EDGE WORLDWIDE LOGISTICS LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P254",
                  "account_title": "ELS PAKISTAN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P255",
                  "account_title": "EUR SERVICES (BD) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P256",
                  "account_title": "EVERTRANS LOGISTICS CO., LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P257",
                  "account_title": "EXIM CARGO URUGUAY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P258",
                  "account_title": "FMG SHIPPING AND FORWARDING LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P259",
                  "account_title": "FREIGHT MANAGEMENT LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P260",
                  "account_title": "FREIGHT OPTIONS LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P261",
                  "account_title": "GONDRAND ANTWERPEN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P262",
                  "account_title": "HEAD SUL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P263",
                  "account_title": "HERMES GERMANY GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P264",
                  "account_title": "KARL HEINZ DIETRICH PRAHA S.R.O.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P265",
                  "account_title": "LAM GLOBAL TASIMACILIK COZUMLERI AS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P266",
                  "account_title": "MAURICE WARD GROUP",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P267",
                  "account_title": "MERCATOR CARGO SYSTEMS LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P268",
                  "account_title": "NETLOG GLOBAL FORWARDING A.S",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P269",
                  "account_title": "NNR GLOBAL LOGISTICS UK LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P270",
                  "account_title": "NOATUM LOGISTICS USA LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P271",
                  "account_title": "NTZ TRANSPORT LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P272",
                  "account_title": "PANDA AIR EXPRESS CO.,LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P273",
                  "account_title": "PANDA LOGISTICS CO., LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P274",
                  "account_title": "PARISI GRAND SMOOTH LOGISTICS LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P275",
                  "account_title": "SCAN GLOBAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P276",
                  "account_title": "SHANGHAI AOWEI INT'L LOGISTICS CO.,LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P277",
                  "account_title": "SHENZHEN GOLD WIDE IMP AND EXP CO LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P278",
                  "account_title": "SKY LOGISTICS (BD) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P279",
                  "account_title": "SPEEDMARK TRANSPORTATION, INC / LAX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P280",
                  "account_title": "TAIWAN EXPRESS CO., LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P281",
                  "account_title": "TEU S.A SHIPPING & FORWARDING .CO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P282",
                  "account_title": "TRAMAR ATI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P283",
                  "account_title": "TRANSMODAL LOGISTICS INT'L (USA)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P284",
                  "account_title": "TRANSWING LOGISTICS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P285",
                  "account_title": "UNISERVE LTD LONDON MEGA TERMINAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P286",
                  "account_title": "UNITED CARGO MANAGEMENT, INC.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1212",
                  "account_title": "ACA INTERNATIONAL (HONG KONG) LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1213",
                  "account_title": "ACE  FREIGHT LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1214",
                  "account_title": "AF EXPORTS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1215",
                  "account_title": "ALBA WHEELS UP INTERNATIONAL INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1216",
                  "account_title": "ALL POINTS UNLIMITED INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1217",
                  "account_title": "ALL-WAYS LOGISTICS (NORTH) PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1218",
                  "account_title": "ALPHA FORWARDING COMPANY LIMITED KOREA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1219",
                  "account_title": "APT SHWOFREIGHT (THAILAND) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1220",
                  "account_title": "ASCO INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1221",
                  "account_title": "ATEE APPAREL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1222",
                  "account_title": "BILAL GARMENTS IND. (LOCAL)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1223",
                  "account_title": "CARGO JOBS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1224",
                  "account_title": "CARGO S.A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1225",
                  "account_title": "CERTIFIED TRANSPORTATION GROUP INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1226",
                  "account_title": "CGL FLYING FISH LOGISTICS (SHANGHAI) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1227",
                  "account_title": "COMATRAM SFAX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1228",
                  "account_title": "CONTROLO CARGO SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1229",
                  "account_title": "CTT DENIZCILIK ANONIM SIRKETI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P789",
                  "account_title": "DENIM CRAFTS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1230",
                  "account_title": "DYNAMIC SHIPPING AGENCIES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1231",
                  "account_title": "ENVIO GLOBAL LOGISTICS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1232",
                  "account_title": "EPSP ROISSY CDG",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1233",
                  "account_title": "EXPOLANKA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1234",
                  "account_title": "FM GLOBAL LOGISTICS (KUL) SDN BHD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1235",
                  "account_title": "FREIGHTERS LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1236",
                  "account_title": "GAM SUPPLY CHAIN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1237",
                  "account_title": "GBS (FREIGHT SERVICES)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1238",
                  "account_title": "GEMS FREIGHT FORWARDING CO., LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1239",
                  "account_title": "GEX LOGISTICS - SRI LANKA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1240",
                  "account_title": "GLOBAL AGENCIES MANAGEMENT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1241",
                  "account_title": "GOLDAIR CARGO S.A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1242",
                  "account_title": "GREEN WORLDWIDE SHIPPING, LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1243",
                  "account_title": "GREENWICH HIGHLAND",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1244",
                  "account_title": "HAKULL AIR & SEA AS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1245",
                  "account_title": "HERMES INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1246",
                  "account_title": "INDEPENDENT OIL TOOLS (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1247",
                  "account_title": "ITSA SPA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1248",
                  "account_title": "JC ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P80",
                  "account_title": "JUBILEE APPAREL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1249",
                  "account_title": "KAYS WORLDWIDE LOGISTICS LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1250",
                  "account_title": "KERRY LOGISTICS (GERMANY) FRANKFURT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1251",
                  "account_title": "KERRY LOGISTICS (GERMANY) GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1252",
                  "account_title": "KERRY LOGISTICS (POLAND) SP Z.O.O,",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1253",
                  "account_title": "KERRY LOGISTICS (UK) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1254",
                  "account_title": "LOGISTICS PLUS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1255",
                  "account_title": "M.R INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1256",
                  "account_title": "MAURICE WARD NETWORKS UK LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1257",
                  "account_title": "MERCHANT SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1258",
                  "account_title": "METROTEX IND",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1259",
                  "account_title": "MILESTONE TEXTILES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1260",
                  "account_title": "MULTIMODAL OPERADOR LOGISTICO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1261",
                  "account_title": "NATCO SA INTERNATIONAL TRANSPORTS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1262",
                  "account_title": "NAZ TEXTILE PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1263",
                  "account_title": "NEDLLOYD LOGISTICS INDIA PVT. LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1264",
                  "account_title": "NIAZ GARMENTS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1265",
                  "account_title": "NTA SP. Z.O.O",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1266",
                  "account_title": "NTZ TRANSPORT LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1267",
                  "account_title": "OFF PRICE IMPORT INC.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1268",
                  "account_title": "ONE PLUS LOGISTICS GMBH & CO.KG",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1269",
                  "account_title": "OPULENT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1270",
                  "account_title": "ORIONCO SHIPPING B.V.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1271",
                  "account_title": "PAKLINK SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1272",
                  "account_title": "PELLE CLASSIC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1273",
                  "account_title": "PETER RATHMANN & CO. GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1274",
                  "account_title": "POPULAR FABRICS LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1275",
                  "account_title": "PRO-MARINE EXPRESS CO.,LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1276",
                  "account_title": "PT TAJ LOGISTIK INDONESIA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1277",
                  "account_title": "PT. TIGA  BINTANG  JAYA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1278",
                  "account_title": "SAFA INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1279",
                  "account_title": "SALOTA INTERNATIONAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1280",
                  "account_title": "SCANWELL LOGITICS SPAIN SL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1281",
                  "account_title": "SEA NET TRADING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1282",
                  "account_title": "SEA TRADE SERVICES (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1283",
                  "account_title": "SEKO GLOBAL LOGISTICS JAPAN CO. LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1284",
                  "account_title": "SEKO INT'L FREIGHT FORWARDING ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1285",
                  "account_title": "SEKO LOGISTICS (CAPE TOWN) S.A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1286",
                  "account_title": "SEKO LOGISTICS (FELIXSTOWE)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1287",
                  "account_title": "SEKO LOGISTICS (LONDON) LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1288",
                  "account_title": "SEKO LOGISTICS (NY)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1289",
                  "account_title": "SEKO LOGISTICS - ATLANTA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1290",
                  "account_title": "SEKO LOGISTICS - MIAMI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1291",
                  "account_title": "SEKO LOGISTICS - NORWAY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1292",
                  "account_title": "SEKO LOGISTICS LOS ANGELES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1293",
                  "account_title": "SEKO LOGISTICS SOUTHAMPTON LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1294",
                  "account_title": "SEKO OMNI-CHANNEL LOGISTICS - NZ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1295",
                  "account_title": "SEKO WORLDWIDE - SAN DIEGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1296",
                  "account_title": "SEKO WORLDWIDE LLC - BALTIMORE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1297",
                  "account_title": "SEKO WORLDWIDE LLC - CHICAGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1298",
                  "account_title": "SEKO WORLDWIDE LLC - ORLANDO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P571",
                  "account_title": "SERVOTECH SHIPPING (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1299",
                  "account_title": "SES INDUSTRIES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1300",
                  "account_title": "SHANGAI SENTING INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1301",
                  "account_title": "SHANGHAI SUNBOOM INT'L TRANSPORTATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1302",
                  "account_title": "SHANGHAI WIZWAY INTERNATIONAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1303",
                  "account_title": "SIKKAS KWICK HANDLING SERVICES PVT LID",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1304",
                  "account_title": "SKYWAYS AIR SERVICES (P) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1305",
                  "account_title": "SKYWAYS SLS CARGO SERVICES LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1306",
                  "account_title": "SPEDYCARGO SA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1307",
                  "account_title": "SPEEDMARK TRANSPORTATION, INC / ATL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1308",
                  "account_title": "STS LOGISTICS BENELUX BV",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1309",
                  "account_title": "TAIWAN EXPRESS CO., LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1310",
                  "account_title": "TRANS AIR SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1311",
                  "account_title": "TRANS GLOBAL (PTE )LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1312",
                  "account_title": "UNIBIS LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1313",
                  "account_title": "UNIPAC SHIPPING INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1314",
                  "account_title": "VISA GLOBAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1315",
                  "account_title": "WATERLINK PAKISTAN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1316",
                  "account_title": "WATSON GLOBAL LOGISTICS BVBA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1317",
                  "account_title": "ZIYA FREIGHT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010182",
                  "account_title": "GLS INTERNETIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010213",
                  "account_title": "SONIC TEXTILE INDUSTRIES-AGENT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010214",
                  "account_title": "FACILITIES SHIPPING AGENCY-AGENT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010610",
                  "account_title": "MARVA EXPORTS.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010611",
                  "account_title": "SHIP-LOG A/S",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010471",
                  "account_title": "SKYWAYS SLS LOGISTIK GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010697",
                  "account_title": "GENEL TRANSPORT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              }
          ]
      },
      {
          "account_no": "31030011",
          "account_title": "Legerhauser Aarau",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "3104",
          "account_title": "CL. AGENT PAYABLE",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "P305",
                  "account_title": "CARGO CORPORATION.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P309",
                  "account_title": "CLEAR AIDS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P313",
                  "account_title": "F. K. ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P315",
                  "account_title": "H. A & SONS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P318",
                  "account_title": "MARFANI BROTHERS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P321",
                  "account_title": "PAK EXPRESS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P325",
                  "account_title": "RAAZIQ INTERNATIONAL PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P326",
                  "account_title": "RABI ENTERPREISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P328",
                  "account_title": "REGENT SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P331",
                  "account_title": "S.M. ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P335",
                  "account_title": "SELF",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P336",
                  "account_title": "SHARWANI TRADERS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P340",
                  "account_title": "UNION ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010702",
                  "account_title": "JAN CONTAINER LINES LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010683",
                  "account_title": "VDH NEXT BV",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010783",
                  "account_title": "Noatum Logistics Japan Limited",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010936",
                  "account_title": "ARABIAN CARGO LEBANON",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010896",
                  "account_title": "NOWAKOWSKI TRANSPORT SP Z O O",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010853",
                  "account_title": "SURGEPORT LOGISTICS PRIVATE LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010846",
                  "account_title": "LAMAIGNERE CARGO ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010559",
                  "account_title": "Blue Whale Shipping Services Co",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010552",
                  "account_title": "PRO AG CHB MIAMI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010556",
                  "account_title": "SIKKAS KWICK HANDLING SERVICES PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010547",
                  "account_title": "SPEEDMARK Transportation (BD) Ltd",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010376",
                  "account_title": "DOUANE LOGISTICS ET SERVICES (DLS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010436",
                  "account_title": "SPEEDMARK TRANSPORTATION, INC.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010426",
                  "account_title": "Arnaud Logis SA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010429",
                  "account_title": "NEDLLOYD LOGISTICS CANADA INC. ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010418",
                  "account_title": "Fast Logistics Cargo FZCO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010520",
                  "account_title": "PRIME TRANSPORT NY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010457",
                  "account_title": "SPEEDMARK TRANSPORTATOIN, INC / HOU",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010460",
                  "account_title": "BEE LOGISTICS CORPORATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010466",
                  "account_title": "SPEEDMARK TRANSPORTATION, INC / NYK",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010406",
                  "account_title": "SKYLINE FORWARDING FIRM CO., LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010486",
                  "account_title": "FOCUS LINKS CORP",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010219",
                  "account_title": "PLANEX LOGISTICS PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010244",
                  "account_title": "ACITO LOGISTICS GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010203",
                  "account_title": "MARE LOJISTIK HIZMETLERI TIC.A.S",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010161",
                  "account_title": "TAM LOGISTICS LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010334",
                  "account_title": "GRAVITAS INTERNATIONAL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010358",
                  "account_title": "GOFORWARD APS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010355",
                  "account_title": "LDP LOGISTICS.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010313",
                  "account_title": "CENTRAL GLOBAL CARGO GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010324",
                  "account_title": "CM FREIGHT & SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010301",
                  "account_title": "EASTWAY GLOBAL FORWARDING LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010332",
                  "account_title": "FEAG INTERNATIONAL FREIGHT FORWARDERS LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010304",
                  "account_title": "SUREFREIGHT INTERNATIONAL LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010293",
                  "account_title": "O F S CARGO SERVICES LLC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1793",
                  "account_title": "WORLD TRANSPORT OVERSEAS HELLAS S.A.GREECE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1794",
                  "account_title": "BLU LOGISTICS COLOMBIA SAS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1776",
                  "account_title": "TRADE EXPEDITORS USA / TEU GLOBAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1779",
                  "account_title": "TRANSMODAL CORPORATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1785",
                  "account_title": "MAURICE WARD LOGISTICS GMBH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1772",
                  "account_title": "CARGOWAYS OCEAN SERVICES INC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1761",
                  "account_title": "TRANZACTION TRADE FACILITATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1375",
                  "account_title": "EXPRESS FREIGHT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1382",
                  "account_title": "HUSSAIN SONS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1383",
                  "account_title": "IFK ENTERPRICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1391",
                  "account_title": "S.A. REHMAT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1396",
                  "account_title": "TRADE LINKER.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010965",
                  "account_title": "TRANSFERA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010983",
                  "account_title": "INDO TRANS LOGISTICS CORPORATION ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              }
          ]
      },
      {
          "account_no": "3105",
          "account_title": "LOAN FROM DIRECTORS",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "3107",
          "account_title": "OTHER PAYABLE",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "3107001",
                  "account_title": "SALARY PAYABLE (ACS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107002",
                  "account_title": "ELECTRICITY PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107003",
                  "account_title": "TELEPHONE BILL PAYABLE  (SNSL)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107029",
                  "account_title": "INT'L DAILING PHONE A/C",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107030",
                  "account_title": "ACCRUED HANDLING +SCANNING EXP.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107031",
                  "account_title": "ACCRUED TRANSPORT A/C",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107032",
                  "account_title": "ACCRUED CIVIL AVIATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107033",
                  "account_title": "WASIQ SHAB PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107034",
                  "account_title": "TELEPHONE BILL PAYABLE (ACS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107035",
                  "account_title": "SALARY PAYABLE (SNSL)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107037",
                  "account_title": "UFONE BILL PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107038",
                  "account_title": "ACCAP PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107039",
                  "account_title": "IATA CASS ADJUSTMENT PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107040",
                  "account_title": "INTEREST PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107041",
                  "account_title": "ANNUAL FEE PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107042",
                  "account_title": "PROVISION FOR BED DEBTS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107007",
                  "account_title": "GAS BILLS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107008",
                  "account_title": "WATER BILL PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107009",
                  "account_title": "STAFF LUNCH PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107010",
                  "account_title": "ACCRUED AIR PORT EXPENSES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107011",
                  "account_title": "cash received",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107012",
                  "account_title": "DRAWING BABAR SB",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107013",
                  "account_title": "D/O CHARGES PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107014",
                  "account_title": "INTERNET BILL PAYABLE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107015",
                  "account_title": "ADVANCE A/C",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107016",
                  "account_title": "ACCRUED DOC.EXP",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107017",
                  "account_title": "ACCRUED CONVAYNCE  EXPENSES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107018",
                  "account_title": "ACCRUED DISPATCH EXPENSES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107019",
                  "account_title": "ACCRUED REFUND A/C",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107020",
                  "account_title": "FREIGHT CHARGES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107021",
                  "account_title": "ACCRUED FUEL EXP",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107022",
                  "account_title": "ACCRUED MAINTENANCE EXPENSES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107023",
                  "account_title": "ACCRUED UTILITIES EXPENSES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107024",
                  "account_title": "ACCRUED SALES TAX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107025",
                  "account_title": "CONTAINER CHARGES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107026",
                  "account_title": "PETTY CASH DEPOSIT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "3107027",
                  "account_title": "ICM ( NEW )",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "P12010181",
                  "account_title": "GLS INT'L",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010247",
                  "account_title": "ARSLANI CLEARING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010941",
                  "account_title": "TAQ ENTERPRISES SERVICES CARGO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              }
          ]
      },
      {
          "account_no": "3107004",
          "account_title": "VEY - FLUID TECHNOLOGY INT.",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "3107005",
          "account_title": "MMS - SECURITIES",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "3107006",
          "account_title": "LOTUS FOODS",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "3107028",
          "account_title": "INT'L DAILING PHONE EXP.",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "31001",
          "account_title": "ACCOUNT PAYABLE ",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "P1796",
                  "account_title": "QASIM INTERNATIONAL FREIGHT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1798",
                  "account_title": "QICT WHARFAGE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1799",
                  "account_title": "PICT WHARFAGE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1800",
                  "account_title": "BAY WEST PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P441",
                  "account_title": "ETIHAD AIR CARGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P427",
                  "account_title": "DYNAMIC SHIPPING AGNECIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P409",
                  "account_title": "COPA AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010119",
                  "account_title": "ADVANCE KICT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010120",
                  "account_title": "SEA NET TRANSPORT ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010121",
                  "account_title": "AL-AWAN TRANSPORT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010134",
                  "account_title": "INTERASIA LINE SINGAPORE.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1811",
                  "account_title": "WEBOC TOKEN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010248",
                  "account_title": "ARSLANI CLEARING A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010228",
                  "account_title": "CARGO LINKERS.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010237",
                  "account_title": "Acumen Freight Solutions",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010186",
                  "account_title": "MUHAMMAD BILAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010195",
                  "account_title": "MERCHANT SHIPPING (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P566",
                  "account_title": "SEA HAWK SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010165",
                  "account_title": "TransNet Shipping (Pvt) Ltd.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P446",
                  "account_title": "FACILITIES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010180",
                  "account_title": "GLS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010325",
                  "account_title": "Syed Muhammad Ali Jillani",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010326",
                  "account_title": "MAK LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010315",
                  "account_title": "ORION SHIPPING AGENCY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010319",
                  "account_title": "OOCL LOG (ZIA)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010359",
                  "account_title": "FAST LOGISTICS ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010368",
                  "account_title": "NLC MARINE & AIR SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010336",
                  "account_title": "CAA NOC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010411",
                  "account_title": "NEXT AVIATION SYSTEMS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010949",
                  "account_title": "VILDEN ASSOCIATES INC.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010900",
                  "account_title": "JAFFAR - TK - LHE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010869",
                  "account_title": "MERIDIAN SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010929",
                  "account_title": "Transways Supply chain ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010888",
                  "account_title": "Mr. Masood (PIA)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010894",
                  "account_title": "TAP AIR ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010860",
                  "account_title": "ECOM LOGISTIX PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "310010001",
                  "account_title": "INTERNATIONAL FREIGHT AVIATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "General"
              },
              {
                  "account_no": "P12010769",
                  "account_title": "MURTAZA-PIA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010834",
                  "account_title": "INSHIPPING (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010838",
                  "account_title": "MEGATECH PVT LTD - YML",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010664",
                  "account_title": "SEAFREIGHT ADVISOR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P563",
                  "account_title": "SAUDI ARABIAN AIRLINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010743",
                  "account_title": "ZAHID-(DO)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1403",
                  "account_title": "FLYNAS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010749",
                  "account_title": "FLY NAS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010508",
                  "account_title": "MAFHH AVIATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010397",
                  "account_title": "GREEN BOX PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010456",
                  "account_title": "Jawed All Steady Enterprises",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010541",
                  "account_title": "CLIPPERS FREIGHT SERVICES.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010563",
                  "account_title": "LOGISTICA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010574",
                  "account_title": "ALTRON SHIPPING PTE LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010587",
                  "account_title": "ABID @ YAASEEN SHIPPING LINES ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010599",
                  "account_title": "CENTRAL CARGO S.R.L.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010596",
                  "account_title": "H & FRIENDS GTL (MALAYSIA) SDN BHD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010648",
                  "account_title": "FREIGHT SHIPPING AND LOGISTICS GLOBAL (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P615",
                  "account_title": "VIRGIN ATLANTIC CARGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P12010989",
                  "account_title": "TROY CONTAINER LINE, LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P181",
                  "account_title": "ACUMEN FREIGHT SYSTEM",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P182",
                  "account_title": "AIR ARABIA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P183",
                  "account_title": "AIR CHINA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P184",
                  "account_title": "ALLIED LOGISTICS PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P185",
                  "account_title": "ANCHORAGE SHIPPING LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P186",
                  "account_title": "BRITISH AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P187",
                  "account_title": "CMA CGM PAKISTAN (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P188",
                  "account_title": "COMBINED FREIGHT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P189",
                  "account_title": "COSCO-SAEED KARACHI (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P190",
                  "account_title": "COURIER - MR. INTERSAR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P191",
                  "account_title": "CP WORLD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P192",
                  "account_title": "DHL AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P193",
                  "account_title": "DIAMOND SHIPPING SERVICES (PVT.) LT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P194",
                  "account_title": "DYNAMIC SHIPPING AGENCIES (PVT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P195",
                  "account_title": "ECU LINE PAKISTAN (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P196",
                  "account_title": "EITHAD AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P197",
                  "account_title": "EMIRATES AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P198",
                  "account_title": "EMIRATES SHIPPING LINE DMCEST",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P199",
                  "account_title": "ETHIOPIAN AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P200",
                  "account_title": "ETIHAD AIRLINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P201",
                  "account_title": "FACILITIES SHIPPING AGENCY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P202",
                  "account_title": "FITS AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P203",
                  "account_title": "Fly-dubai",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P204",
                  "account_title": "GAM Supply Chain (Pvt) Ltd",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P205",
                  "account_title": "GLOBAL CONSOLIDATOR PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P206",
                  "account_title": "GREENPAK SHIPPING (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P207",
                  "account_title": "GULF AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P208",
                  "account_title": "HAPAG-LLOYD CONTAINER LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P209",
                  "account_title": "IDEA LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P210",
                  "account_title": "INTER-FREIGHT CONSOLIDATORS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P211",
                  "account_title": "LAUREL NAVIGATION LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P212",
                  "account_title": "MAERSK LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P213",
                  "account_title": "MSC PAKISTAN (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P214",
                  "account_title": "NEWS LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P215",
                  "account_title": "OMAN AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P216",
                  "account_title": "ONE LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P217",
                  "account_title": "OOCL PAKISTAN (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P218",
                  "account_title": "PEGASUS AIR LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P219",
                  "account_title": "QATAR AIR WAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P220",
                  "account_title": "Ranks Logistics Pakistan (Pvt) Ltd",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P221",
                  "account_title": "SAUDI ARABIAN AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P222",
                  "account_title": "SEA HAWK SHIPPING LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P223",
                  "account_title": "SEA SHORE LOGISTICS.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P224",
                  "account_title": "SHARAF SHIPPING AGENCY (PVT.)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P225",
                  "account_title": "SHIPCO TRANSPORT PAKISTAN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P226",
                  "account_title": "SRILANKA AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P227",
                  "account_title": "Silk Way Airlines",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P228",
                  "account_title": "THAI AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P229",
                  "account_title": "TURKISH AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P230",
                  "account_title": "UNITED ARAB SHIPPING AGENCY COMPANY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P231",
                  "account_title": "UNITED MARINE AGENCIES (PVT) L",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P232",
                  "account_title": "UNITED MARINE AGENCIES PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P233",
                  "account_title": "UNIVERSAL SHIPPING (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P234",
                  "account_title": "UPS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P235",
                  "account_title": "WATERLINK PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P236",
                  "account_title": "YANG MING LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P237",
                  "account_title": "YTO CARGO AIRLINES CO.,LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P3",
                  "account_title": "QATAR AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P350",
                  "account_title": "ACE Airline",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1144",
                  "account_title": "ACTIVE FREIGHT SERVICES (PVT) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1145",
                  "account_title": "ACUMEN FREIGHT SOLUTIONS BUSINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1146",
                  "account_title": "ADAM SHIPPING (PVT) LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1147",
                  "account_title": "AERO EXPRESS INT'L",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P354",
                  "account_title": "AIR ASTANA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P355",
                  "account_title": "AIR BERLIN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1148",
                  "account_title": "AIR BLUE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P357",
                  "account_title": "AIR CANADA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1149",
                  "account_title": "AIR EUROPA CARGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1150",
                  "account_title": "AJ WORLD WIDE SERVICES PAKISTAN PVT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1151",
                  "account_title": "AL JAZEERA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P367",
                  "account_title": "ALLIED LOGISTIC (SMC-PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P369",
                  "account_title": "AMERICAN AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1152",
                  "account_title": "APL LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1153",
                  "account_title": "APL PAKISTAN (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P381",
                  "account_title": "AZTEC AIRWAYS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1154",
                  "account_title": "Aas Moving Sergvices",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1155",
                  "account_title": "Air Serbia",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1156",
                  "account_title": "CAPITAL SHIPPING AGENCY",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1157",
                  "account_title": "CARGO CARE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P391",
                  "account_title": "CARGO LUX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1158",
                  "account_title": "CARGO SHIPPING & LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P395",
                  "account_title": "CATHAY PACIFIC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1159",
                  "account_title": "CHAM WINGS AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1160",
                  "account_title": "CHINA CONTAINER LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P398",
                  "account_title": "CHINA SOUTHERN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1161",
                  "account_title": "CIM SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1162",
                  "account_title": "CLEAR FREIGHT INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1163",
                  "account_title": "CONCORD LOGISTICS INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P415",
                  "account_title": "CSS LINE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1164",
                  "account_title": "CSS PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1165",
                  "account_title": "DELTA TRANSPORT PVT. LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P423",
                  "account_title": "DHL EXPRESS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P425",
                  "account_title": "DOLPHIN AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1166",
                  "account_title": "DYNAMIC SHIPPING AGENCIES PVT. LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1167",
                  "account_title": "Delta Cargo",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1168",
                  "account_title": "E2E SUPPLY CHAIN MANAGEMENT (PVT.)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1169",
                  "account_title": "ERITREAN AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P448",
                  "account_title": "FEDEX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1170",
                  "account_title": "GLOBAL FREIGHT SOLUTION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P458",
                  "account_title": "GLOBAL FREIGHT SOLUTIONS FZE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1171",
                  "account_title": "Globelink Pakistan (Pvt.) Ltd.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1172",
                  "account_title": "HANJIN SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1173",
                  "account_title": "INFINITY SHIPPING SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1174",
                  "account_title": "INSERVEY PAKISTAN (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1175",
                  "account_title": "INTERNATIONAL AIR & SEA (SALEEM)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1176",
                  "account_title": "INTERNATIONAL FREIGHT & AVIATION",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1177",
                  "account_title": "K L M",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1178",
                  "account_title": "KL SHIPPING & LOGISTIC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1179",
                  "account_title": "KLM CARGO",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1180",
                  "account_title": "LUFTHANSA AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1181",
                  "account_title": "MAERSK LOGISTICS PAKISTAN (PVT",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1182",
                  "account_title": "MALAYSIAN AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1183",
                  "account_title": "MARINE SERVICES PVT. LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1184",
                  "account_title": "MEGA IMPEX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1185",
                  "account_title": "MEHR CARGO (PVT) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P513",
                  "account_title": "Middle East Airlines",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P506",
                  "account_title": "MIDEX AIRLINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1186",
                  "account_title": "MITSUI O.S.K. LINES PAKISTAN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1187",
                  "account_title": "NEW WORLD LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1188",
                  "account_title": "NYK LINE PAKISTAN (PVT.) LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P530",
                  "account_title": "P & S CARGO SERVICES PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1189",
                  "account_title": "P I A",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1190",
                  "account_title": "PACIFIC DELTA SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1191",
                  "account_title": "PACIFIC FREIGHT SYSTEM",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1192",
                  "account_title": "PACIFIC SHIPPING LINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1193",
                  "account_title": "PAKLINK SHIPPING SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1194",
                  "account_title": "PIA INTERNATIONAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1195",
                  "account_title": "QUICK FREIGHT MANAGEMENT PAKISTAN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1196",
                  "account_title": "RIAZEDA PVT. LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1197",
                  "account_title": "RWAYS CONTAINER LINE L.L.C",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P559",
                  "account_title": "SAFMARINE PAKISTAN PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P560",
                  "account_title": "SALAM AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1198",
                  "account_title": "SAMUDERA SHIPPING LINE LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1199",
                  "account_title": "SEA EXPERT SHIPPING & LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1200",
                  "account_title": "SEA SQUAD LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P1201",
                  "account_title": "SEAGOLD (PRIVATE) LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1202",
                  "account_title": "SEALOG PVT. LIMITED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1203",
                  "account_title": "SEAWAYS LOGISTICS SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1204",
                  "account_title": "SERVOTECH SHIPPING (PVT.) LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1205",
                  "account_title": "SIS LOGISTICAL SYSTEMS LTD.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P578",
                  "account_title": "SKY NET",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1206",
                  "account_title": "SOFTWARE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P586",
                  "account_title": "SWISS AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1207",
                  "account_title": "TRADESIA SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P612",
                  "account_title": "United Airline",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1208",
                  "account_title": "VALUE LOGISTICS PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1209",
                  "account_title": "VERTEX CONTAINER LINE PVT LTD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P616",
                  "account_title": "VISION AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1210",
                  "account_title": "WORLD SHIPPING & CONSOLIDATORS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1211",
                  "account_title": "YASEEN SHIPPING LINES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              }
          ]
      },
      {
          "account_no": "31002",
          "account_title": "REBATE PAYABLE",
          "type": "Group",
          "catogary": "Liability",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "P12010300",
                  "account_title": "Raheel @ Amanullah ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Customer/Vendor"
              },
              {
                  "account_no": "P12010984",
                  "account_title": "AMIR KHAN DHL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1318",
                  "account_title": "AHAD UNITEX",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1319",
                  "account_title": "ARIF (NOVA LEATHER)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1320",
                  "account_title": "ARSHAD HAFEEZ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1321",
                  "account_title": "CLI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1322",
                  "account_title": "CMA CGM",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1323",
                  "account_title": "CMA-CS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1324",
                  "account_title": "DALER",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1325",
                  "account_title": "DARYL T JOHN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1326",
                  "account_title": "DELTA IMRAN JAMEEL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1327",
                  "account_title": "ERRY-PIA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1328",
                  "account_title": "FARHAN CONTINENTAL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1329",
                  "account_title": "FAROOQ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1330",
                  "account_title": "HAIDER BHAI",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1331",
                  "account_title": "HAMID",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1332",
                  "account_title": "HAMID (LOJISTICA)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1333",
                  "account_title": "I.A.K",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1334",
                  "account_title": "IMRAN JAMIL (HAPAG)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1335",
                  "account_title": "JOONAID CO - SOHAIL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1336",
                  "account_title": "KAMRAN OMAN AIR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1337",
                  "account_title": "LUTUF ULLAH (PIA)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1338",
                  "account_title": "MAMUN BHAI (UASC)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1339",
                  "account_title": "ASIF SB (MN TEXTILE)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1340",
                  "account_title": "FAWAD QR",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1341",
                  "account_title": "NADEEM (AIR PORT)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1342",
                  "account_title": "NADEEM - COMPAINION SERVICES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1343",
                  "account_title": "NAEEM SHAH (BNI INKS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1344",
                  "account_title": "NASEER (HAFIZ TANNERY)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1345",
                  "account_title": "NASIR  (IMRAN BROS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1346",
                  "account_title": "ORIENT CARGO SER.",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1347",
                  "account_title": "QASIM (ASS MOVING)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1348",
                  "account_title": "QAZI (UNIVERSAL SHIPPING)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1349",
                  "account_title": "RAFIQ ROOPANI (HBL)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1350",
                  "account_title": "SALEEM SB (SMSCHEMICAL)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1351",
                  "account_title": "SHAHID BHAI (ACS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1352",
                  "account_title": "SHAHZAD APP RIAZ",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1353",
                  "account_title": "SHAHZAIB UNISHIP",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1354",
                  "account_title": "STAR ONE SHIPPING",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1355",
                  "account_title": "SUNNY ENT (OLD A/C)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1356",
                  "account_title": "TAIMOR (WIEGHT DIFF CARGES)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1357",
                  "account_title": "TARIQ NOVA",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1358",
                  "account_title": "TARIQ PIAC",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1359",
                  "account_title": "TEX LINE BUYING HOUSE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1360",
                  "account_title": "UNIQUE ENTERPRISES",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1361",
                  "account_title": "VAKIL @ HONEST FOOD",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1362",
                  "account_title": "WAJID NIZAM (FAIZ CARGO)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1363",
                  "account_title": "FARAZ SHER",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1364",
                  "account_title": "WASIM COSCO SAEED",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P1365",
                  "account_title": "ZEESHAN (PELLE)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P287",
                  "account_title": "AMIR BHAI / CARGO LINKERS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P288",
                  "account_title": "ANIS @ EVERGREEN",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P289",
                  "account_title": "ANJUM - TAJ IND",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P290",
                  "account_title": "AQEEL AGRO HUB",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P291",
                  "account_title": "ARJUN - UNITED TOWEL",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P292",
                  "account_title": "CMA - CS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P293",
                  "account_title": "EUR LOGISTICS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P294",
                  "account_title": "FARHAN YML",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P295",
                  "account_title": "IRFAN TURKISH",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P296",
                  "account_title": "JAMAL UZAIR INT'L",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P297",
                  "account_title": "MAHSIM (SOUTHERN AGENCIES)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P298",
                  "account_title": "NADEEM (SULTEX IND)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P299",
                  "account_title": "NIAZ @ AL KARAM TOWEL IND",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P300",
                  "account_title": "NOMAN MILESTONE",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P301",
                  "account_title": "SALEEM SB (C/O.ELS)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P302",
                  "account_title": "SALMAN ELS",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              },
              {
                  "account_no": "P303",
                  "account_title": "SHAHID (HUSSAIN LEATHER)",
                  "type": "Detail",
                  "catogary": "Liability",
                  "sub_category": "Vendor"
              }
          ]
      }
  ],
  "Expense": [
      {
          "account_title": "OTHER EXPENSE ACCOUNTS",
          "account_no": "ACC-3",
          "type": "Group",
          "childAccounts": [
              {
                  "account_no": "50",
                  "account_title": "SCS COURIER EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5112",
                  "account_title": "SALES TAX EXP (SRB)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202019",
                  "account_title": "SOFTWARE & DEVELOPMENT EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "53",
                  "account_title": "COUNTERA ENTRY",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "54",
                  "account_title": "CONSTRUCTION A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "55",
                  "account_title": "CIVIL AVIATION RENT",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "56",
                  "account_title": "COMMISSION EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "57",
                  "account_title": "SALES TAX SNSL",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "58",
                  "account_title": "REFUND EXPENSES (HAROON)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "59",
                  "account_title": "INTEREST EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "51",
          "account_title": "SELLING EXPENSES",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5109",
                  "account_title": "CLEARING EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5110",
                  "account_title": "BAD DEBTS",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5111",
                  "account_title": "REFUND TO AIRLINE & SHIPPING LINE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5101",
          "account_title": "FCL SELLING EXP",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5101001",
                  "account_title": "FCL FREIGHT EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5101002",
                  "account_title": "FCL REBATE EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5101003",
                  "account_title": "DOCS EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5102",
          "account_title": "LCL SELLING EXP",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5102001",
                  "account_title": "LCL FREIGHT EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5102002",
                  "account_title": "LCL REBATE EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5102003",
                  "account_title": "SHORT PAYMENT EXPESNES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5103",
          "account_title": "OPEN TOP SELLING",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5103001",
                  "account_title": "OPENT TOP FREIGHT EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5103002",
                  "account_title": "OPENT TOP REBATE EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5104",
          "account_title": "IMPORT SELLING  EXP.",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5104001",
                  "account_title": "IMPORT EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5104002",
                  "account_title": "D/O CHARGES.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              }
          ]
      },
      {
          "account_no": "5106",
          "account_title": "AIR SELLING EXPENSES",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5106001",
                  "account_title": "AIR FREIGHT EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "COGS"
              },
              {
                  "account_no": "5106002",
                  "account_title": "AIR PORT EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "52",
          "account_title": "ADMIN. EXP",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5204",
                  "account_title": "ZAKAT EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5205",
                  "account_title": "Motor Vehicle Tax",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5206",
                  "account_title": "Audit Expence",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5207",
                  "account_title": "Courier Charges",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5201",
          "account_title": "OPRATING EXPENSES",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5201001",
                  "account_title": "ADVERTISEMENT EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201002",
                  "account_title": "B/L ADHESIVE CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201003",
                  "account_title": "BROKERAGE & COMMISSION",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201004",
                  "account_title": "CHARITY & DONATION",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201005",
                  "account_title": "COMPUTER EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201006",
                  "account_title": "CONVEYANCE EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201007",
                  "account_title": "DIRECTORS REMUNIRATION",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201008",
                  "account_title": "ELECTRICITY CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201009",
                  "account_title": "ENTERTAINMENT EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201010",
                  "account_title": "EQUIPMENT REPAIR",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201011",
                  "account_title": "FEES & TAXES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201012",
                  "account_title": "INTERNET/ EMAIL / FAXES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201013",
                  "account_title": "LEGAL & PROFESSIONAL",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201014",
                  "account_title": "LICENCE FEE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201015",
                  "account_title": "MISC. EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201016",
                  "account_title": "MOBILE EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201017",
                  "account_title": "NEWS PAPER & PERIODICAL",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201018",
                  "account_title": "OFFICE REPAIR & MAINTENANCE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201019",
                  "account_title": "PHOTO STAT",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201020",
                  "account_title": "POSTAGE & TELEGRAME",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201021",
                  "account_title": "PRINTING & STATIONERY",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201022",
                  "account_title": "RENT EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201023",
                  "account_title": "SALARIES & ALLOWANCES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201024",
                  "account_title": "STAFF BONUS",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201025",
                  "account_title": "TELEPHONE & FAX BILL EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201026",
                  "account_title": "WAGES EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201027",
                  "account_title": "STAFF WALFARE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201028",
                  "account_title": "GENERATOR EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201029",
                  "account_title": "SECURITY & SERVICES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201030",
                  "account_title": "CLIMAX SOFTWARE EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201031",
                  "account_title": "INSURANCE EXP (TOYOTA)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201032",
                  "account_title": "INSURANCE EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201033",
                  "account_title": "EOBI EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201034",
                  "account_title": "DONATION",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201035",
                  "account_title": "INCOME TAX (SALARY)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201036",
                  "account_title": "INCOM TAX ELECTRICITY",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201037",
                  "account_title": "GENERAL SALES TAX ELECTRICITY",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201039",
                  "account_title": "STATIONARY EXPENSE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201040",
                  "account_title": "CONVAYNCE EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201041",
                  "account_title": "DISPATCH EXPESNES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201042",
                  "account_title": "FUEL & OIL EXPESNES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201043",
                  "account_title": "INTERNET & DSL EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201044",
                  "account_title": "WATER BILL EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201045",
                  "account_title": "WATER BILL EXPESNES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201046",
                  "account_title": "UTILITIES EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201047",
                  "account_title": "INCOM TAX",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201048",
                  "account_title": "Guest House Repairing & Maintenance",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201049",
                  "account_title": "Bank Charges (Sunil)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201050",
                  "account_title": "UNITED INSURANCE  CO",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201051",
                  "account_title": "SALARIES & ALLOWANCES (ACS)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201052",
                  "account_title": "OFFICE DESIGNING",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5201053",
                  "account_title": "PORT EXPENSES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "Admin Expense"
              }
          ]
      },
      {
          "account_no": "5201038",
          "account_title": "VEHICLE REPAIR AND MAINTENANCE",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "5202",
          "account_title": "BANK & FINANCIAL CHARGES",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5202001",
                  "account_title": "BANK CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202002",
                  "account_title": "MARKUP CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202007",
                  "account_title": "COMMISSION ADV A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202008",
                  "account_title": "ENTERTRANSFER A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202009",
                  "account_title": "S.E.S.S.I",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202010",
                  "account_title": "READY LOAN A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202011",
                  "account_title": "OUT DOOR FUEL EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202012",
                  "account_title": "CUSTOM CLEARING CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202013",
                  "account_title": "PANALTY CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202014",
                  "account_title": "WATER & SAVERAGE BOARD BILL",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202015",
                  "account_title": "LABOUR CHARGES",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202016",
                  "account_title": "CAR INSTALMENT A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202017",
                  "account_title": "SUI GAS BILL",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202018",
                  "account_title": "U.B.L  BANK",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202020",
                  "account_title": "PIA (Bank Charges)",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202021",
                  "account_title": "COMMISSION AGAINST BANK GUARANTEE",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202004",
                  "account_title": "CREDIT CARDS A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5202005",
                  "account_title": "B/L STUMPPING",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "5202003",
          "account_title": "GENERAL",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "5202006",
          "account_title": "COMMISSION A/C",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "5203",
          "account_title": "MARKETING EXP.",
          "type": "Group",
          "catogary": "Expense",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "5203001",
                  "account_title": "VEHICLE & RUNNING EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203002",
                  "account_title": "RECOVERY EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203003",
                  "account_title": "TRAVELLING EXP.",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203004",
                  "account_title": "BAD DEBTS EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203005",
                  "account_title": "COMMISSION A/C SEA SHIPMENTS",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203006",
                  "account_title": "SALES PROMOTION EXP",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203007",
                  "account_title": "SOFTWARE & DEVLOPMENT A/C",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              },
              {
                  "account_no": "5203008",
                  "account_title": "COMMISSION A/C AIR SHIPMENTS",
                  "type": "Detail",
                  "catogary": "Expense",
                  "sub_category": "General"
              }
          ]
      }
  ],
  "income": [
      {
          "account_title": "OTHER INCOME ACCOUNTS",
          "account_no": "ACC-2",
          "type": "Group",
          "childAccounts": [
              {
                  "account_no": "43",
                  "account_title": "INCOME FROM CLEARING",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "44",
                  "account_title": "INCOME FROM IMPORT",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "45",
                  "account_title": "EX-CHANGE RATE GAIN / LOSS",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "401",
                  "account_title": "AIR IMPORT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "41",
          "account_title": "SELLING REVENUE",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": []
      },
      {
          "account_no": "4101",
          "account_title": "FCL SELLING INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "410101",
                  "account_title": "FCL FREIGHT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "4102",
          "account_title": "LCL SELLING INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "410201",
                  "account_title": "LCL FREIGHT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "4103",
          "account_title": "OPEN TOP SELLING INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "410301",
                  "account_title": "OPEN TOP FREIGHT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "4104",
          "account_title": "IMPORT SELLING INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "410401",
                  "account_title": "IMPORT FREIGHT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "410402",
                  "account_title": "IMPORT INSURANCE",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "410403",
          "account_title": "INCOME FROM IMPORT.",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "410403001",
                  "account_title": "D/O INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "4105",
          "account_title": "AIR SELLING INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "4105001",
                  "account_title": "AIR FREIGHT INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "4105002",
                  "account_title": "AIR SALES DISCOUNT",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "42",
          "account_title": "OTHER REVENUE",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "42001",
                  "account_title": "MISC. INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42002",
                  "account_title": "REBATE INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42003",
                  "account_title": "CNTR HANDLING INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42004",
                  "account_title": "INTEREST INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42006",
                  "account_title": "K.B INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42007",
                  "account_title": "INTEREST PAID",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              },
              {
                  "account_no": "42008",
                  "account_title": "RENTAL INCOME",
                  "type": "Detail",
                  "catogary": "Income",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "42005",
          "account_title": "DETENTION INCOME",
          "type": "Group",
          "catogary": "Income",
          "sub_category": null,
          "childAccounts": []
      }
  ],
  "Capital": [
      {
          "account_title": "OTHER CAPITAL ACCOUNTS",
          "account_no": "ACC-1",
          "type": "Group",
          "childAccounts": [
              {
                  "account_no": "25",
                  "account_title": "PAID UP CAPITAL",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "26",
                  "account_title": "IFA A/C",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "27",
                  "account_title": "MR. HUMAYUN QAMAR (PROPRIETOR)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "201",
                  "account_title": "CONTRA ACCOUNT OPENINIG",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "21",
          "account_title": "CAPITAL COMPANY",
          "type": "Group",
          "catogary": "Capital",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "21001",
                  "account_title": "DIRECTOR CAPITAL",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "22",
          "account_title": "CAPITAL DIRECTORS",
          "type": "Group",
          "catogary": "Capital",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "22001",
                  "account_title": "CAPITAL abc",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "22002",
                  "account_title": "MR. HUMAYUN QAMAR (PARTNER)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "22003",
                  "account_title": "MR. QAMAR ALAM (PARTNER)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "22004",
                  "account_title": "MRS. ZAREEN QAMAR (PARTNER)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "22005",
                  "account_title": "MRS. HINA ADNAN KHAN (PARTNER)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "22006",
                  "account_title": "MISS. SHAJIA QAMAR (PARTNER)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "23",
          "account_title": "PROFIT & LOSS SUMMARY",
          "type": "Group",
          "catogary": "Capital",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "23001",
                  "account_title": "PROFIT & LOSS B/F",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              }
          ]
      },
      {
          "account_no": "24",
          "account_title": "DIRECTORS DRAWING",
          "type": "Group",
          "catogary": "Capital",
          "sub_category": null,
          "childAccounts": [
              {
                  "account_no": "24001",
                  "account_title": "MR. HOMAYOUN QAMAR ALAM",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24002",
                  "account_title": "DRAWING",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24003",
                  "account_title": "MR. QAMAR ALAM (DRAWING)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24004",
                  "account_title": "MRS. ZAREEN QAMAR (DRAWING)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24005",
                  "account_title": "MRS. HINA ADNAN KHAN (DRAWING)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24006",
                  "account_title": "MISS. SHAJIA QAMAR (DRAWING)",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              },
              {
                  "account_no": "24007",
                  "account_title": "SEA NET TECHNOLOGIES",
                  "type": "Detail",
                  "catogary": "Capital",
                  "sub_category": "General"
              }
          ]
      }
  ]
}

let vouchersList = [
    {
        "type": "Opening Balance",
        "vType": "OP",
        "currency": "EUR",
        "exRate": "1",
        "costCenter": "KHI",
        "CompanyId": 3,
        "Voucher_Heads": [
            {
                "title": "CONTRA ACCOUNT OPENINIG",
                "ChildAccountId": "918857310742118401",
                "amount": 336,
                "type": "debit",
                "defaultAmount": 336
            },
            {
                "title": "ADVANCE A/C",
                "ChildAccountId": "918857309730668545",
                "amount": 336,
                "type": "credit",
                "defaultAmount": 336
            }
        ]
    },
    {
        "type": "Opening Balance",
        "vType": "OP",
        "currency": "EUR",
        "exRate": "1",
        "costCenter": "KHI",
        "CompanyId": 3,
        "Voucher_Heads": [
            {
                "title": "CONTRA ACCOUNT OPENINIG",
                "ChildAccountId": "918857310742118401",
                "amount": 911.55,
                "type": "credit",
                "defaultAmount": 911.55
            },
            {
                "title": "AIR FREIGHT EXPENSE",
                "ChildAccountId": "918857310154817537",
                "amount": 911.55,
                "type": "debit",
                "defaultAmount": 911.55
            }
        ]
    },
    {
        "type": "Opening Balance",
        "vType": "OP",
        "currency": "EUR",
        "exRate": "1",
        "costCenter": "KHI",
        "CompanyId": 3,
        "Voucher_Heads": [
            {
                "title": "CONTRA ACCOUNT OPENINIG",
                "ChildAccountId": "918857310742118401",
                "amount": 272.5,
                "type": "debit",
                "defaultAmount": 272.5
            },
            {
                "title": "MAURICE WARD NETWORKS UK LTD",
                "ChildAccountId": "918857309645602817",
                "amount": 272.5,
                "type": "credit",
                "defaultAmount": 272.5
            }
        ]
    },
    {
        "type": "Opening Balance",
        "vType": "OP",
        "currency": "EUR",
        "exRate": "1",
        "costCenter": "KHI",
        "CompanyId": 3,
        "Voucher_Heads": [
            {
                "title": "CONTRA ACCOUNT OPENINIG",
                "ChildAccountId": "918857310742118401",
                "amount": 303.05,
                "type": "debit",
                "defaultAmount": 303.05
            },
            {
                "title": "MAURICE WARD GROUP",
                "ChildAccountId": "918857309643407361",
                "amount": 303.05,
                "type": "credit",
                "defaultAmount": 303.05
            }
        ]
    }
]