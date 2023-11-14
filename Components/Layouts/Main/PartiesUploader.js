import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CSVReader from 'react-csv-reader';

const ParitesUploader = () => {

    // for invoices only
    const [finalList, setFinalList] = useState([])
    const [failedList, setFailedList] = useState([])
    const [invoiceIndex, setInvoiceIndex] = useState(0)

  const commas = (a) => a==0?'0':parseFloat(a).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");

  const parserOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
  }

  const handleForce = (data) => {
    let clientList = [], vendorList = [], nonGlList = [], unKnownList = [];
    let clientVendor = [];
    data.forEach((x, i) => {
    if(i<data.length-1) {
      let records = {
        oldId:x.id,
        code:x.partycode,
        name:x.partyname,
        citycode:x.citycode,
        zip:x.postalcode,
        person1:x.contactperson,
        mobile1:x.mobile,
        telephone1:x.telephone1,
        telephone2:x.telephone2,
        address:null,//`${x.address1} ${x.address2==null?'':x.address2} ${x.address3==null?'':x.address3}`,
        website:x.website,
        infoMail:x.email,
        strn:x.strn,
        accountsMail:x.accountsemail,
        bankname:x.bankname,
        branchname:x.branchname,
        operations:"".concat(x.isairexport==1?'Air Export, ':'', x.isairimport==1?'Air Import, ':'', x.isseaexport==1?'Sea Export, ':'', x.isseaimport==1?'Sea Import, ':''),
        types:"".concat(
          x.isconsignee==1?'Consignee, ':''
          , x.isshipper==1?'Shipper, ':''
          , x.isnotify==1?'Notify, ':''
          , x.ispotentialcustomer==1?'Potential Customer, ':''
          , x.isnonoperationalparty==1?'Non operational Party, ':''

          , x.isforwarder==1?'Forwarder/Coloader, ':''
          , x.islocalagent==1?'Local Vendor, ':''
          , x.isoverseasagent==1?'Overseas Agent, ':''
          , x.iscommissionagent==1?'Commission Agent, ':''
          , x.isindentor==1?'Indentor, ':''
          , x.istransporter==1?'Transporter, ':''
          , x.ischachb==1?'CHA/CHB, ':''
          , x.isshippingline==1?'Shipping Line, ':''
          , x.isdeliveryagent==1?'Delivery Agent, ':''
          , x.iswarehouse==1?'Warehouse, ':''
          , x.isbuyinghouse==1?'Buying House, ':''
          , x.isairline==1?'Air Line, ':''
          , x.istrucking==1?'Trucking, ':''
          , x.isdrayman==1?'Drayman, ':''
          , x.iscartage==1?'Cartage, ':''
          , x.isstevedore==1?'Stevedore, ':''
          , x.isprincipal==1?'Principal, ':''
          , x.isdepo==1?'Depot, ':''
          , x.isterminalparty==1?'Terminal, ':''
          , x.isbuyer==1?'Buyer, ':''
          , x.isbillingparty==1?'Invoice Party, ':''
          , x.isslotoperator==1?'Slot Operator':''),
          partytypeid:x.partytypeid
        //partytype:x.partytypeid==1?'Client':x.partytypeid==2?'Vendor':x.partytypeid==2?'Customer/Vendor':'Non-Gl'
      }
      if(x.partytypeid==1) {
        clientList.push(records);
      } else if(x.partytypeid==2) {
        vendorList.push(records);
      } else if(x.partytypeid==3) {
        clientVendor.push(records);
      } else if(x.partytypeid==4) {
        nonGlList.push(records);
      } else {
        unKnownList.push(records);
      }
    }
    // if(i<data.length-1) {
    //     console.log({name:x.particular.split("(")[1].slice(0,-1), balance:x.balance, type:x.type})
    // }
    });
    clientVendor.forEach((x)=>{
      if(x.types.includes('Consignee') || x.types.includes('Shipper') || x.types.includes('Notify') || x.types.includes('Potential Customer') || x.types.includes('Non operational Party')){
        clientList.push(x);
      } else {
        vendorList.push(x);
      }
    })
    console.log({vendorList, clientList, unKnownList});
  }

  const uploadParties = async() => {

    let vendorWithAc = [];
    let vendorWithNoAc = [];

    let clientWithAc = [];
    let clientWithNoAc = [];

    let tempVendors = [...parties.vendorList];
    let tempClients = [...parties.clientList];

    await tempVendors.forEach((x, i) => {
      let name = x.name;
      let accountsTempList = [...accountsList.Liability, ...accountsList.Assets]
      accountsTempList.forEach((y, j) => {
        y.childAccounts.forEach((z, k) => {
          if(z.account_title==name){
            delete tempVendors[i]
            vendorWithAc.push({...x, account:{...z, parent:y.account_title}})
          } else {
            vendorWithNoAc.push(x)
          }
        })
      })
    });

    await tempClients.forEach((x, i) => {
      let name = x.name;
      let accountsTempList = [...accountsList.Liability, ...accountsList.Assets]
      accountsTempList.forEach((y, j) => {
        y.childAccounts.forEach((z, k) => {
          if(z.account_title==name){
            delete tempClients[i]
            clientWithAc.push({...x, account:{...z, parent:y.account_title}})
          } else {
            clientWithNoAc.push(x)
          }
        })
      })
    });

    // console.log(parties.vendorList.length, parties.clientList.length);
    console.log(clientWithAc);
    console.log("clients Left", tempClients);

    console.log(vendorWithAc);
    console.log("vendors Left", tempVendors);

    // axios.post('http://localhost:8081/accounts/createClientInBulk', clientWithAc)
    // .then((x)=>{
    //   console.log(x.data)
    // })

    // axios.post('http://localhost:8081/accounts/createVendorInBulk', vendorWithAc)
    // .then((x)=>{
    //   console.log(x.data)
    // })

  }
  
  return (
  <>
    <div>
      <b>Parties Loader</b>
    </div>
    <CSVReader cssClass="csv-reader-input" onFileLoaded={handleForce} parserOptions={parserOptions} 
      inputId="ObiWan" inputName="ObiWan"
    />
    <button onClick={uploadParties} className='btn-custom mt-3'>Upload Parties With Account</button>
  </>
  )
}

export default ParitesUploader

let parties = {
  "vendorList":[
    {
        "oldId": 123,
        "code": 3,
        "name": "QATAR AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 302,
        "code": 182,
        "name": "AIR ARABIA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 303,
        "code": 183,
        "name": "AIR CHINA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 304,
        "code": 184,
        "name": "ALLIED LOGISTICS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 305,
        "code": 185,
        "name": "ANCHORAGE SHIPPING LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 306,
        "code": 186,
        "name": "BRITISH AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 307,
        "code": 187,
        "name": "CMA CGM PAKISTAN (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 308,
        "code": 188,
        "name": "COMBINED FREIGHT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 309,
        "code": 189,
        "name": "COSCO-SAEED KARACHI (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 310,
        "code": 190,
        "name": "COURIER - MR. INTERSAR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 311,
        "code": 191,
        "name": "CP WORLD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 312,
        "code": 192,
        "name": "DHL AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 313,
        "code": 193,
        "name": "DIAMOND SHIPPING SERVICES (PVT.) LT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 314,
        "code": 194,
        "name": "DYNAMIC SHIPPING AGENCIES (PVT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 315,
        "code": 195,
        "name": "ECU LINE PAKISTAN (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 316,
        "code": 196,
        "name": "EITHAD AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 317,
        "code": 197,
        "name": "EMIRATES AIRLINES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 318,
        "code": 198,
        "name": "EMIRATES SHIPPING LINE DMCEST",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 319,
        "code": 199,
        "name": "ETHIOPIAN AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 320,
        "code": 200,
        "name": "ETIHAD AIRLINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 322,
        "code": 202,
        "name": "FITS AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 323,
        "code": 203,
        "name": "Fly-dubai",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 324,
        "code": 204,
        "name": "GAM Supply Chain (Pvt) Ltd",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 326,
        "code": 206,
        "name": "GREENPAK SHIPPING (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 327,
        "code": 207,
        "name": "GULF AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 328,
        "code": 208,
        "name": "HAPAG-LLOYD CONTAINER LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 330,
        "code": 210,
        "name": "INTER-FREIGHT CONSOLIDATORS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 331,
        "code": 211,
        "name": "LAUREL NAVIGATION LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 332,
        "code": 212,
        "name": "MAERSK LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 333,
        "code": 213,
        "name": "MSC PAKISTAN (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 335,
        "code": 215,
        "name": "OMAN AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 336,
        "code": 216,
        "name": "ONE LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 337,
        "code": 217,
        "name": "OOCL PAKISTAN (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 338,
        "code": 218,
        "name": "PEGASUS AIR LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 339,
        "code": 219,
        "name": "QATAR AIR WAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 340,
        "code": 220,
        "name": "Ranks Logistics Pakistan (Pvt) Ltd",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 341,
        "code": 221,
        "name": "SAUDI ARABIAN AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 343,
        "code": 223,
        "name": "SEA SHORE LOGISTICS.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 344,
        "code": 224,
        "name": "SHARAF SHIPPING AGENCY (PVT.)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 345,
        "code": 225,
        "name": "SHIPCO TRANSPORT PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 346,
        "code": 226,
        "name": "SRILANKA AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 347,
        "code": 227,
        "name": "Silk Way Airlines",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 348,
        "code": 228,
        "name": "THAI AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 349,
        "code": 229,
        "name": "TURKISH AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 350,
        "code": 230,
        "name": "UNITED ARAB SHIPPING AGENCY COMPANY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 351,
        "code": 231,
        "name": "UNITED MARINE AGENCIES (PVT) L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 352,
        "code": 232,
        "name": "UNITED MARINE AGENCIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 354,
        "code": 234,
        "name": "UPS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 356,
        "code": 236,
        "name": "YANG MING LINE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 357,
        "code": 237,
        "name": "YTO CARGO AIRLINES CO.,LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 407,
        "code": 287,
        "name": "AMIR BHAI / CARGO LINKERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 408,
        "code": 288,
        "name": "ANIS @ EVERGREEN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 409,
        "code": 289,
        "name": "ANJUM - TAJ IND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 410,
        "code": 290,
        "name": "AQEEL AGRO HUB",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 411,
        "code": 291,
        "name": "ARJUN - UNITED TOWEL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 412,
        "code": 292,
        "name": "CMA - CS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 413,
        "code": 293,
        "name": "EUR LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 414,
        "code": 294,
        "name": "FARHAN YML",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 415,
        "code": 295,
        "name": "IRFAN TURKISH",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 416,
        "code": 296,
        "name": "JAMAL UZAIR INT'L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 417,
        "code": 297,
        "name": "MAHSIM (SOUTHERN AGENCIES)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 418,
        "code": 298,
        "name": "NADEEM (SULTEX IND)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 419,
        "code": 299,
        "name": "NIAZ @ AL KARAM TOWEL IND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 420,
        "code": 300,
        "name": "NOMAN MILESTONE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 421,
        "code": 301,
        "name": "SALEEM SB (C/O.ELS)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 422,
        "code": 302,
        "name": "SALMAN ELS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 423,
        "code": 303,
        "name": "SHAHID (HUSSAIN LEATHER)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 425,
        "code": 305,
        "name": "CARGO CORPORATION.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 429,
        "code": 309,
        "name": "CLEAR AIDS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 433,
        "code": 313,
        "name": "F. K. ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 435,
        "code": 315,
        "name": "H. A & SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 438,
        "code": 318,
        "name": "MARFANI BROTHERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 441,
        "code": 321,
        "name": "PAK EXPRESS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 445,
        "code": 325,
        "name": "RAAZIQ INTERNATIONAL PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 446,
        "code": 326,
        "name": "RABI ENTERPREISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 448,
        "code": 328,
        "name": "REGENT SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 451,
        "code": 331,
        "name": "S.M. ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 455,
        "code": 335,
        "name": "SELF",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 456,
        "code": 336,
        "name": "SHARWANI TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 460,
        "code": 340,
        "name": "UNION ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 470,
        "code": 350,
        "name": "ACE Airline",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 474,
        "code": 354,
        "name": "AIR ASTANA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 475,
        "code": 355,
        "name": "AIR BERLIN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 477,
        "code": 357,
        "name": "AIR CANADA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 487,
        "code": 367,
        "name": "ALLIED LOGISTIC (SMC-PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 489,
        "code": 369,
        "name": "AMERICAN AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 501,
        "code": 381,
        "name": "AZTEC AIRWAYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 511,
        "code": 391,
        "name": "CARGO LUX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 515,
        "code": 395,
        "name": "CATHAY PACIFIC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 518,
        "code": 398,
        "name": "CHINA SOUTHERN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 529,
        "code": 409,
        "name": "COPA AIR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 535,
        "code": 415,
        "name": "CSS LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 543,
        "code": 423,
        "name": "DHL EXPRESS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 545,
        "code": 425,
        "name": "DOLPHIN AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 561,
        "code": 441,
        "name": "ETIHAD AIR CARGO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, CHA/CHB, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 566,
        "code": 446,
        "name": "FACILITIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 568,
        "code": 448,
        "name": "FEDEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 578,
        "code": 458,
        "name": "GLOBAL FREIGHT SOLUTIONS FZE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 626,
        "code": 506,
        "name": "MIDEX AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 633,
        "code": 513,
        "name": "Middle East Airlines",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 650,
        "code": 530,
        "name": "P & S CARGO SERVICES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 658,
        "code": 538,
        "name": "PEGASUS AIRLINE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 679,
        "code": 559,
        "name": "SAFMARINE PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 680,
        "code": 560,
        "name": "SALAM AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 683,
        "code": 563,
        "name": "SAUDI ARABIAN AIRLINE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 698,
        "code": 578,
        "name": "SKY NET",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 706,
        "code": 586,
        "name": "SWISS AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 732,
        "code": 612,
        "name": "United Airline",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 735,
        "code": 615,
        "name": "VIRGIN ATLANTIC CARGO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 736,
        "code": 616,
        "name": "VISION AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1264,
        "code": 1144,
        "name": "ACTIVE FREIGHT SERVICES (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1265,
        "code": 1145,
        "name": "ACUMEN FREIGHT SOLUTIONS BUSINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1266,
        "code": 1146,
        "name": "ADAM SHIPPING (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1267,
        "code": 1147,
        "name": "AERO EXPRESS INT'L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1268,
        "code": 1148,
        "name": "AIR BLUE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1269,
        "code": 1149,
        "name": "AIR EUROPA CARGO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1270,
        "code": 1150,
        "name": "AJ WORLD WIDE SERVICES PAKISTAN PVT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1271,
        "code": 1151,
        "name": "AL JAZEERA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1272,
        "code": 1152,
        "name": "APL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1273,
        "code": 1153,
        "name": "APL PAKISTAN (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1274,
        "code": 1154,
        "name": "Aas Moving Sergvices",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1275,
        "code": 1155,
        "name": "Air Serbia",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1276,
        "code": 1156,
        "name": "CAPITAL SHIPPING AGENCY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1277,
        "code": 1157,
        "name": "CARGO CARE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1278,
        "code": 1158,
        "name": "CARGO SHIPPING & LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1279,
        "code": 1159,
        "name": "CHAM WINGS AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 1280,
        "code": 1160,
        "name": "CHINA CONTAINER LINE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1281,
        "code": 1161,
        "name": "CIM SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1282,
        "code": 1162,
        "name": "CLEAR FREIGHT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1284,
        "code": 1164,
        "name": "CSS PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1285,
        "code": 1165,
        "name": "DELTA TRANSPORT PVT. LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1286,
        "code": 1166,
        "name": "DYNAMIC SHIPPING AGENCIES PVT. LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1287,
        "code": 1167,
        "name": "Delta Cargo",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1288,
        "code": 1168,
        "name": "E2E SUPPLY CHAIN MANAGEMENT (PVT.)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1289,
        "code": 1169,
        "name": "ERITREAN AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1290,
        "code": 1170,
        "name": "GLOBAL FREIGHT SOLUTION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1291,
        "code": 1171,
        "name": "Globelink Pakistan (Pvt.) Ltd.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1292,
        "code": 1172,
        "name": "HANJIN SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1293,
        "code": 1173,
        "name": "INFINITY SHIPPING SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1294,
        "code": 1174,
        "name": "INSERVEY PAKISTAN (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1295,
        "code": 1175,
        "name": "INTERNATIONAL AIR & SEA (SALEEM)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1296,
        "code": 1176,
        "name": "INTERNATIONAL FREIGHT & AVIATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1297,
        "code": 1177,
        "name": "K L M",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1298,
        "code": 1178,
        "name": "KL SHIPPING & LOGISTIC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1299,
        "code": 1179,
        "name": "KLM CARGO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1300,
        "code": 1180,
        "name": "LUFTHANSA AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1301,
        "code": 1181,
        "name": "MAERSK LOGISTICS PAKISTAN (PVT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1302,
        "code": 1182,
        "name": "MALAYSIAN AIRLINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1303,
        "code": 1183,
        "name": "MARINE SERVICES PVT. LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1304,
        "code": 1184,
        "name": "MEGA IMPEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1305,
        "code": 1185,
        "name": "MEHR CARGO (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1306,
        "code": 1186,
        "name": "MITSUI O.S.K. LINES PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1307,
        "code": 1187,
        "name": "NEW WORLD LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1308,
        "code": 1188,
        "name": "NYK LINE PAKISTAN (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1309,
        "code": 1189,
        "name": "P I A",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1310,
        "code": 1190,
        "name": "PACIFIC DELTA SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1311,
        "code": 1191,
        "name": "PACIFIC FREIGHT SYSTEM",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1312,
        "code": 1192,
        "name": "PACIFIC SHIPPING LINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1313,
        "code": 1193,
        "name": "PAKLINK SHIPPING SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1314,
        "code": 1194,
        "name": "PIA INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1315,
        "code": 1195,
        "name": "QUICK FREIGHT MANAGEMENT PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1316,
        "code": 1196,
        "name": "RIAZEDA PVT. LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1317,
        "code": 1197,
        "name": "RWAYS CONTAINER LINE L.L.C",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1318,
        "code": 1198,
        "name": "SAMUDERA SHIPPING LINE LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1319,
        "code": 1199,
        "name": "SEA EXPERT SHIPPING & LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1321,
        "code": 1201,
        "name": "SEAGOLD (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1322,
        "code": 1202,
        "name": "SEALOG PVT. LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1323,
        "code": 1203,
        "name": "SEAWAYS LOGISTICS SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1324,
        "code": 1204,
        "name": "SERVOTECH SHIPPING (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1325,
        "code": 1205,
        "name": "SIS LOGISTICAL SYSTEMS LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1326,
        "code": 1206,
        "name": "SOFTWARE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1327,
        "code": 1207,
        "name": "TRADESIA SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1328,
        "code": 1208,
        "name": "VALUE LOGISTICS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1329,
        "code": 1209,
        "name": "VERTEX CONTAINER LINE PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1330,
        "code": 1210,
        "name": "WORLD SHIPPING & CONSOLIDATORS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1331,
        "code": 1211,
        "name": "YASEEN SHIPPING LINES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1438,
        "code": 1318,
        "name": "AHAD UNITEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1439,
        "code": 1319,
        "name": "ARIF (NOVA LEATHER)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1440,
        "code": 1320,
        "name": "ARSHAD HAFEEZ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1441,
        "code": 1321,
        "name": "CLI",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1442,
        "code": 1322,
        "name": "CMA CGM",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1443,
        "code": 1323,
        "name": "CMA-CS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1444,
        "code": 1324,
        "name": "DALER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1445,
        "code": 1325,
        "name": "DARYL T JOHN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1446,
        "code": 1326,
        "name": "DELTA IMRAN JAMEEL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1447,
        "code": 1327,
        "name": "ERRY-PIA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1448,
        "code": 1328,
        "name": "FARHAN CONTINENTAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1449,
        "code": 1329,
        "name": "FAROOQ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1450,
        "code": 1330,
        "name": "HAIDER BHAI",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1451,
        "code": 1331,
        "name": "HAMID",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1452,
        "code": 1332,
        "name": "HAMID (LOJISTICA)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1453,
        "code": 1333,
        "name": "I.A.K",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1454,
        "code": 1334,
        "name": "IMRAN JAMIL (HAPAG)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1455,
        "code": 1335,
        "name": "JOONAID CO - SOHAIL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1456,
        "code": 1336,
        "name": "KAMRAN OMAN AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1457,
        "code": 1337,
        "name": "LUTUF ULLAH (PIA)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1458,
        "code": 1338,
        "name": "MAMUN BHAI (UASC)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1459,
        "code": 1339,
        "name": "ASIF SB (MN TEXTILE)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Consignee, Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1460,
        "code": 1340,
        "name": "FAWAD QR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1461,
        "code": 1341,
        "name": "NADEEM (AIR PORT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1462,
        "code": 1342,
        "name": "NADEEM - COMPAINION SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1463,
        "code": 1343,
        "name": "NAEEM SHAH (BNI INKS)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1464,
        "code": 1344,
        "name": "NASEER (HAFIZ TANNERY)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1465,
        "code": 1345,
        "name": "NASIR  (IMRAN BROS)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1466,
        "code": 1346,
        "name": "ORIENT CARGO SER.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1467,
        "code": 1347,
        "name": "QASIM (ASS MOVING)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1468,
        "code": 1348,
        "name": "QAZI (UNIVERSAL SHIPPING)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1469,
        "code": 1349,
        "name": "RAFIQ ROOPANI (HBL)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1470,
        "code": 1350,
        "name": "SALEEM SB (SMSCHEMICAL)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1471,
        "code": 1351,
        "name": "SHAHID BHAI (ACS)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1472,
        "code": 1352,
        "name": "SHAHZAD APP RIAZ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1473,
        "code": 1353,
        "name": "SHAHZAIB UNISHIP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1474,
        "code": 1354,
        "name": "STAR ONE SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1475,
        "code": 1355,
        "name": "SUNNY ENT (OLD A/C)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1476,
        "code": 1356,
        "name": "TAIMOR (WIEGHT DIFF CARGES)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1477,
        "code": 1357,
        "name": "TARIQ NOVA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1478,
        "code": 1358,
        "name": "TARIQ PIAC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1479,
        "code": 1359,
        "name": "TEX LINE BUYING HOUSE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1480,
        "code": 1360,
        "name": "UNIQUE ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1481,
        "code": 1361,
        "name": "VAKIL @ HONEST FOOD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1482,
        "code": 1362,
        "name": "WAJID NIZAM (FAIZ CARGO)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1483,
        "code": 1363,
        "name": "FARAZ SHER",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1484,
        "code": 1364,
        "name": "WASIM COSCO SAEED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1485,
        "code": 1365,
        "name": "ZEESHAN (PELLE)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 1495,
        "code": 1375,
        "name": "EXPRESS FREIGHT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 1502,
        "code": 1382,
        "name": "HUSSAIN SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 1503,
        "code": 1383,
        "name": "IFK ENTERPRICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 1511,
        "code": 1391,
        "name": "S.A. REHMAT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 1516,
        "code": 1396,
        "name": "TRADE LINKER.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 1916,
        "code": 1796,
        "name": "QASIM INTERNATIONAL FREIGHT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1918,
        "code": 1798,
        "name": "QICT WHARFAGE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1919,
        "code": 1799,
        "name": "PICT WHARFAGE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 1920,
        "code": 1800,
        "name": "BAY WEST PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2079,
        "code": 12010119,
        "name": "ADVANCE KICT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2080,
        "code": 12010120,
        "name": "SEA NET TRANSPORT ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2081,
        "code": 12010121,
        "name": "AL-AWAN TRANSPORT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2405,
        "code": 12010134,
        "name": "INTERASIA LINE SINGAPORE.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2840,
        "code": 12010165,
        "name": "TransNet Shipping (Pvt) Ltd.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2861,
        "code": 12010186,
        "name": "MUHAMMAD BILAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 2870,
        "code": 12010195,
        "name": "MERCHANT SHIPPING (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 2903,
        "code": 12010228,
        "name": "CARGO LINKERS.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Export, Sea Import, ",
        "types": "Local Vendor, CHA/CHB, ",
        "partytypeid": 2
    },
    {
        "oldId": 2923,
        "code": 12010248,
        "name": "ARSLANI CLEARING A",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Local Vendor, Transporter, Shipping Line, ",
        "partytypeid": 2
    },
    {
        "oldId": 2990,
        "code": 12010315,
        "name": "ORION SHIPPING AGENCY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3000,
        "code": 12010325,
        "name": "Syed Muhammad Ali Jillani",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3001,
        "code": 12010326,
        "name": "MAK LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3011,
        "code": 12010336,
        "name": "CAA NOC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3043,
        "code": 12010368,
        "name": "NLC MARINE & AIR SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Local Vendor, Transporter, CHA/CHB, Trucking, ",
        "partytypeid": 2
    },
    {
        "oldId": 3072,
        "code": 12010397,
        "name": "GREEN BOX PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3086,
        "code": 12010411,
        "name": "NEXT AVIATION SYSTEMS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3131,
        "code": 12010456,
        "name": "Jawed All Steady Enterprises",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Local Vendor, Warehouse, ",
        "partytypeid": 2
    },
    {
        "oldId": 3183,
        "code": 12010508,
        "name": "MAFHH AVIATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3216,
        "code": 12010541,
        "name": "CLIPPERS FREIGHT SERVICES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3262,
        "code": 12010587,
        "name": "ABID @ YAASEEN SHIPPING LINES ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Local Vendor, Commission Agent, ",
        "partytypeid": 2
    },
    {
        "oldId": 3424,
        "code": 12010749,
        "name": "FLY NAS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3509,
        "code": 12010834,
        "name": "INSHIPPING (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3513,
        "code": 12010838,
        "name": "MEGATECH PVT LTD - YML",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3535,
        "code": 12010860,
        "name": "ECOM LOGISTIX PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3544,
        "code": 12010869,
        "name": "MERIDIAN SHIPPING",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3563,
        "code": 12010888,
        "name": "Mr. Masood (PIA)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3569,
        "code": 12010894,
        "name": "TAP AIR ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3604,
        "code": 12010929,
        "name": "Transways Supply chain ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3659,
        "code": 12010984,
        "name": "AMIR KHAN DHL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 3664,
        "code": 12010989,
        "name": "TROY CONTAINER LINE, LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 2
    },
    {
        "oldId": 169,
        "code": 49,
        "name": "DYNAMIC PACKAGING PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 301,
        "code": 181,
        "name": "ACUMEN FREIGHT SYSTEM",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 321,
        "code": 201,
        "name": "FACILITIES SHIPPING AGENCY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 325,
        "code": 205,
        "name": "GLOBAL CONSOLIDATOR PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 329,
        "code": 209,
        "name": "IDEA LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 342,
        "code": 222,
        "name": "SEA HAWK SHIPPING LINE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 355,
        "code": 235,
        "name": "WATERLINK PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 358,
        "code": 238,
        "name": "3L-LEEMARK LOGISTICS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 359,
        "code": 239,
        "name": "A.I. LOGISTICS (M) SDN BHD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 360,
        "code": 240,
        "name": "ACE BANGLADESH LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 361,
        "code": 241,
        "name": "ALLPOINTS UNLIMITED, INC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 362,
        "code": 242,
        "name": "AMARINE SHIPPING",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 363,
        "code": 243,
        "name": "BORUSAN LOJISTIK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 364,
        "code": 244,
        "name": "CANWORLD LOGISTICS INC.,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 365,
        "code": 245,
        "name": "CARGO LINKERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Overseas Agent, CHA/CHB, ",
        "partytypeid": 3
    },
    {
        "oldId": 366,
        "code": 246,
        "name": "CCL LOGISTICS LTD,",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 367,
        "code": 247,
        "name": "CHINA GLOBAL LINES LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 368,
        "code": 248,
        "name": "CIMC GOLD WIDE TECHNOLOGY LOGISTICS GROUP CO.,LIMI",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 369,
        "code": 249,
        "name": "CMA CS REFUND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 370,
        "code": 250,
        "name": "COLE INTERNATIONAL INC.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 371,
        "code": 251,
        "name": "COMPASS SEA & AIR CARGO LLC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 372,
        "code": 252,
        "name": "CONTAINER FREIGHT STATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 373,
        "code": 253,
        "name": "EDGE WORLDWIDE LOGISTICS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 374,
        "code": 254,
        "name": "ELS PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 375,
        "code": 255,
        "name": "EUR SERVICES (BD) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 376,
        "code": 256,
        "name": "EVERTRANS LOGISTICS CO., LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 377,
        "code": 257,
        "name": "EXIM CARGO URUGUAY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 378,
        "code": 258,
        "name": "FMG SHIPPING AND FORWARDING LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 379,
        "code": 259,
        "name": "FREIGHT MANAGEMENT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 380,
        "code": 260,
        "name": "FREIGHT OPTIONS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 381,
        "code": 261,
        "name": "GONDRAND ANTWERPEN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 382,
        "code": 262,
        "name": "HEAD SUL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 383,
        "code": 263,
        "name": "HERMES GERMANY GMBH",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 384,
        "code": 264,
        "name": "KARL HEINZ DIETRICH PRAHA S.R.O.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 385,
        "code": 265,
        "name": "LAM GLOBAL TASIMACILIK COZUMLERI AS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 386,
        "code": 266,
        "name": "MAURICE WARD GROUP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 387,
        "code": 267,
        "name": "MERCATOR CARGO SYSTEMS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 388,
        "code": 268,
        "name": "NETLOG GLOBAL FORWARDING A.S",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 389,
        "code": 269,
        "name": "NNR GLOBAL LOGISTICS UK LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 390,
        "code": 270,
        "name": "NOATUM LOGISTICS USA LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 391,
        "code": 271,
        "name": "NTZ TRANSPORT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 392,
        "code": 272,
        "name": "PANDA AIR EXPRESS CO.,LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 393,
        "code": 273,
        "name": "PANDA LOGISTICS CO., LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 394,
        "code": 274,
        "name": "PARISI GRAND SMOOTH LOGISTICS LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 395,
        "code": 275,
        "name": "SCAN GLOBAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 396,
        "code": 276,
        "name": "SHANGHAI AOWEI INT'L LOGISTICS CO.,LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 397,
        "code": 277,
        "name": "SHENZHEN GOLD WIDE IMP AND EXP CO LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 398,
        "code": 278,
        "name": "SKY LOGISTICS (BD) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 399,
        "code": 279,
        "name": "SPEEDMARK TRANSPORTATION, INC / LAX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 400,
        "code": 280,
        "name": "TAIWAN EXPRESS CO., LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 401,
        "code": 281,
        "name": "TEU S.A SHIPPING & FORWARDING .CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 402,
        "code": 282,
        "name": "TRAMAR ATI",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 403,
        "code": 283,
        "name": "TRANSMODAL LOGISTICS INT'L (USA)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 404,
        "code": 284,
        "name": "TRANSWING LOGISTICS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 405,
        "code": 285,
        "name": "UNISERVE LTD LONDON MEGA TERMINAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 406,
        "code": 286,
        "name": "UNITED CARGO MANAGEMENT, INC.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 547,
        "code": 427,
        "name": "DYNAMIC SHIPPING AGNECIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 686,
        "code": 566,
        "name": "SEA HAWK SHIPPING",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 719,
        "code": 599,
        "name": "TURKISH AIR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 1283,
        "code": 1163,
        "name": "CONCORD LOGISTICS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1320,
        "code": 1200,
        "name": "SEA SQUAD LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1333,
        "code": 1213,
        "name": "ACE  FREIGHT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1334,
        "code": 1214,
        "name": "AF EXPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1335,
        "code": 1215,
        "name": "ALBA WHEELS UP INTERNATIONAL INC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1336,
        "code": 1216,
        "name": "ALL POINTS UNLIMITED INC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1337,
        "code": 1217,
        "name": "ALL-WAYS LOGISTICS (NORTH) PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1338,
        "code": 1218,
        "name": "ALPHA FORWARDING COMPANY LIMITED KOREA",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1339,
        "code": 1219,
        "name": "APT SHWOFREIGHT (THAILAND) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1340,
        "code": 1220,
        "name": "ASCO INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1341,
        "code": 1221,
        "name": "ATEE APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1342,
        "code": 1222,
        "name": "BILAL GARMENTS IND. (LOCAL)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1343,
        "code": 1223,
        "name": "CARGO JOBS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1344,
        "code": 1224,
        "name": "CARGO S.A",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1345,
        "code": 1225,
        "name": "CERTIFIED TRANSPORTATION GROUP INC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1346,
        "code": 1226,
        "name": "CGL FLYING FISH LOGISTICS (SHANGHAI) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1347,
        "code": 1227,
        "name": "COMATRAM SFAX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1348,
        "code": 1228,
        "name": "CONTROLO CARGO SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1349,
        "code": 1229,
        "name": "CTT DENIZCILIK ANONIM SIRKETI",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1350,
        "code": 1230,
        "name": "DYNAMIC SHIPPING AGENCIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1351,
        "code": 1231,
        "name": "ENVIO GLOBAL LOGISTICS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1352,
        "code": 1232,
        "name": "EPSP ROISSY CDG",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1353,
        "code": 1233,
        "name": "EXPOLANKA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1354,
        "code": 1234,
        "name": "FM GLOBAL LOGISTICS (KUL) SDN BHD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1355,
        "code": 1235,
        "name": "FREIGHTERS LLC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1356,
        "code": 1236,
        "name": "GAM SUPPLY CHAIN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1357,
        "code": 1237,
        "name": "GBS (FREIGHT SERVICES)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1358,
        "code": 1238,
        "name": "GEMS FREIGHT FORWARDING CO., LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1359,
        "code": 1239,
        "name": "GEX LOGISTICS - SRI LANKA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1360,
        "code": 1240,
        "name": "GLOBAL AGENCIES MANAGEMENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1361,
        "code": 1241,
        "name": "GOLDAIR CARGO S.A",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1362,
        "code": 1242,
        "name": "GREEN WORLDWIDE SHIPPING, LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1363,
        "code": 1243,
        "name": "GREENWICH HIGHLAND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1364,
        "code": 1244,
        "name": "HAKULL AIR & SEA AS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1365,
        "code": 1245,
        "name": "HERMES INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1366,
        "code": 1246,
        "name": "INDEPENDENT OIL TOOLS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1367,
        "code": 1247,
        "name": "ITSA SPA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1368,
        "code": 1248,
        "name": "JC ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1369,
        "code": 1249,
        "name": "KAYS WORLDWIDE LOGISTICS LLC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1370,
        "code": 1250,
        "name": "KERRY LOGISTICS (GERMANY) FRANKFURT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1371,
        "code": 1251,
        "name": "KERRY LOGISTICS (GERMANY) GMBH",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1372,
        "code": 1252,
        "name": "KERRY LOGISTICS (POLAND) SP Z.O.O,",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1373,
        "code": 1253,
        "name": "KERRY LOGISTICS (UK) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1374,
        "code": 1254,
        "name": "LOGISTICS PLUS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1375,
        "code": 1255,
        "name": "M.R INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1376,
        "code": 1256,
        "name": "MAURICE WARD NETWORKS UK LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1377,
        "code": 1257,
        "name": "MERCHANT SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1378,
        "code": 1258,
        "name": "METROTEX IND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1379,
        "code": 1259,
        "name": "MILESTONE TEXTILES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1380,
        "code": 1260,
        "name": "MULTIMODAL OPERADOR LOGISTICO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1381,
        "code": 1261,
        "name": "NATCO SA INTERNATIONAL TRANSPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1382,
        "code": 1262,
        "name": "NAZ TEXTILE PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1383,
        "code": 1263,
        "name": "NEDLLOYD LOGISTICS INDIA PVT. LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1384,
        "code": 1264,
        "name": "NIAZ GARMENTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1385,
        "code": 1265,
        "name": "NTA SP. Z.O.O",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1386,
        "code": 1266,
        "name": "NTZ TRANSPORT LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1387,
        "code": 1267,
        "name": "OFF PRICE IMPORT INC.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1388,
        "code": 1268,
        "name": "ONE PLUS LOGISTICS GMBH & CO.KG",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1389,
        "code": 1269,
        "name": "OPULENT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1390,
        "code": 1270,
        "name": "ORIONCO SHIPPING B.V.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1391,
        "code": 1271,
        "name": "PAKLINK SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1392,
        "code": 1272,
        "name": "PELLE CLASSIC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1393,
        "code": 1273,
        "name": "PETER RATHMANN & CO. GMBH",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1394,
        "code": 1274,
        "name": "POPULAR FABRICS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1395,
        "code": 1275,
        "name": "PRO-MARINE EXPRESS CO.,LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1396,
        "code": 1276,
        "name": "PT TAJ LOGISTIK INDONESIA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1397,
        "code": 1277,
        "name": "PT. TIGA  BINTANG  JAYA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1398,
        "code": 1278,
        "name": "SAFA INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1399,
        "code": 1279,
        "name": "SALOTA INTERNATIONAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1400,
        "code": 1280,
        "name": "SCANWELL LOGITICS SPAIN SL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1401,
        "code": 1281,
        "name": "SEA NET TRADING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1402,
        "code": 1282,
        "name": "SEA TRADE SERVICES (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1403,
        "code": 1283,
        "name": "SEKO GLOBAL LOGISTICS JAPAN CO. LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1404,
        "code": 1284,
        "name": "SEKO INT'L FREIGHT FORWARDING (SHANGHAI)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1405,
        "code": 1285,
        "name": "SEKO LOGISTICS (CAPE TOWN) S.A",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1406,
        "code": 1286,
        "name": "SEKO LOGISTICS (FELIXSTOWE)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1407,
        "code": 1287,
        "name": "SEKO LOGISTICS (LONDON) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1408,
        "code": 1288,
        "name": "SEKO LOGISTICS (NY)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1409,
        "code": 1289,
        "name": "SEKO LOGISTICS - ATLANTA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1410,
        "code": 1290,
        "name": "SEKO LOGISTICS - MIAMI",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1411,
        "code": 1291,
        "name": "SEKO LOGISTICS - NORWAY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1412,
        "code": 1292,
        "name": "SEKO LOGISTICS LOS ANGELES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1413,
        "code": 1293,
        "name": "SEKO LOGISTICS SOUTHAMPTON LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1414,
        "code": 1294,
        "name": "SEKO OMNI-CHANNEL LOGISTICS - NZ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1415,
        "code": 1295,
        "name": "SEKO WORLDWIDE - SAN DIEGO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1416,
        "code": 1296,
        "name": "SEKO WORLDWIDE LLC - BALTIMORE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1417,
        "code": 1297,
        "name": "SEKO WORLDWIDE LLC - CHICAGO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1418,
        "code": 1298,
        "name": "SEKO WORLDWIDE LLC - ORLANDO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1419,
        "code": 1299,
        "name": "SES INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1420,
        "code": 1300,
        "name": "SHANGAI SENTING INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1421,
        "code": 1301,
        "name": "SHANGHAI SUNBOOM INT'L TRANSPORTATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1422,
        "code": 1302,
        "name": "SHANGHAI WIZWAY INTERNATIONAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1423,
        "code": 1303,
        "name": "SIKKAS KWICK HANDLING SERVICES PVT LID",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1424,
        "code": 1304,
        "name": "SKYWAYS AIR SERVICES (P) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1425,
        "code": 1305,
        "name": "SKYWAYS SLS CARGO SERVICES LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1426,
        "code": 1306,
        "name": "SPEDYCARGO SA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1427,
        "code": 1307,
        "name": "SPEEDMARK TRANSPORTATION, INC / ATL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1428,
        "code": 1308,
        "name": "STS LOGISTICS BENELUX BV",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1429,
        "code": 1309,
        "name": "TAIWAN EXPRESS CO., LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1430,
        "code": 1310,
        "name": "TRANS AIR SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1431,
        "code": 1311,
        "name": "TRANS GLOBAL (PTE )LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1432,
        "code": 1312,
        "name": "UNIBIS LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1433,
        "code": 1313,
        "name": "UNIPAC SHIPPING INC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1434,
        "code": 1314,
        "name": "VISA GLOBAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1435,
        "code": 1315,
        "name": "WATERLINK PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1436,
        "code": 1316,
        "name": "WATSON GLOBAL LOGISTICS BVBA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1437,
        "code": 1317,
        "name": "ZIYA FREIGHT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1523,
        "code": 1403,
        "name": "FLYNAS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Local Vendor, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 1881,
        "code": 1761,
        "name": "TRANZACTION TRADE FACILITATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1892,
        "code": 1772,
        "name": "CARGOWAYS OCEAN SERVICES INC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1896,
        "code": 1776,
        "name": "TRADE EXPEDITORS USA / TEU GLOBAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1899,
        "code": 1779,
        "name": "TRANSMODAL CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, Warehouse, ",
        "partytypeid": 3
    },
    {
        "oldId": 1905,
        "code": 1785,
        "name": "MAURICE WARD LOGISTICS GMBH",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1913,
        "code": 1793,
        "name": "WORLD TRANSPORT OVERSEAS HELLAS S.A.GREECE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1914,
        "code": 1794,
        "name": "BLU LOGISTICS COLOMBIA SAS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1931,
        "code": 1811,
        "name": "WEBOC TOKEN",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 2836,
        "code": 12010161,
        "name": "TAM LOGISTICS LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2857,
        "code": 12010182,
        "name": "GLS INTERNETIONAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Local Vendor, Overseas Agent, CHA/CHB, ",
        "partytypeid": 3
    },
    {
        "oldId": 2878,
        "code": 12010203,
        "name": "MARE LOJISTIK HIZMETLERI TIC.A.S",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2888,
        "code": 12010213,
        "name": "SONIC TEXTILE INDUSTRIES-AGENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2889,
        "code": 12010214,
        "name": "FACILITIES SHIPPING AGENCY-AGENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2894,
        "code": 12010219,
        "name": "PLANEX LOGISTICS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2919,
        "code": 12010244,
        "name": "ACITO LOGISTICS GMBH",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2968,
        "code": 12010293,
        "name": "O F S CARGO SERVICES LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2976,
        "code": 12010301,
        "name": "EASTWAY GLOBAL FORWARDING LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2979,
        "code": 12010304,
        "name": "SUREFREIGHT INTERNATIONAL LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2988,
        "code": 12010313,
        "name": "CENTRAL GLOBAL CARGO GMBH",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2999,
        "code": 12010324,
        "name": "CM FREIGHT & SHIPPING",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3007,
        "code": 12010332,
        "name": "FEAG INTERNATIONAL FREIGHT FORWARDERS LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3009,
        "code": 12010334,
        "name": "GRAVITAS INTERNATIONAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3030,
        "code": 12010355,
        "name": "LDP LOGISTICS.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3033,
        "code": 12010358,
        "name": "GOFORWARD APS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3034,
        "code": 12010359,
        "name": "FAST LOGISTICS ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3051,
        "code": 12010376,
        "name": "DOUANE LOGISTICS ET SERVICES (DLS)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3081,
        "code": 12010406,
        "name": "SKYLINE FORWARDING FIRM CO., LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3093,
        "code": 12010418,
        "name": "Fast Logistics Cargo FZCO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3101,
        "code": 12010426,
        "name": "Arnaud Logis SA",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3104,
        "code": 12010429,
        "name": "NEDLLOYD LOGISTICS CANADA INC. ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3111,
        "code": 12010436,
        "name": "SPEEDMARK TRANSPORTATION, INC.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3132,
        "code": 12010457,
        "name": "SPEEDMARK TRANSPORTATOIN, INC / HOU",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3135,
        "code": 12010460,
        "name": "BEE LOGISTICS CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3141,
        "code": 12010466,
        "name": "SPEEDMARK TRANSPORTATION, INC / NYK",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3146,
        "code": 12010471,
        "name": "SKYWAYS SLS LOGISTIK GMBH",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3161,
        "code": 12010486,
        "name": "FOCUS LINKS CORP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3195,
        "code": 12010520,
        "name": "PRIME TRANSPORT NY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3222,
        "code": 12010547,
        "name": "SPEEDMARK Transportation (BD) Ltd",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3227,
        "code": 12010552,
        "name": "PRO AG CHB MIAMI",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3231,
        "code": 12010556,
        "name": "SIKKAS KWICK HANDLING SERVICES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3234,
        "code": 12010559,
        "name": "Blue Whale Shipping Services Co",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3238,
        "code": 12010563,
        "name": "LOGISTICA",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Forwarder/Coloader, Local Vendor, CHA/CHB, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 3242,
        "code": 12010567,
        "name": "ASK SHIPPING AND LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3249,
        "code": 12010574,
        "name": "ALTRON SHIPPING PTE LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3271,
        "code": 12010596,
        "name": "H & FRIENDS GTL (MALAYSIA) SDN BHD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3274,
        "code": 12010599,
        "name": "CENTRAL CARGO S.R.L.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3285,
        "code": 12010610,
        "name": "MARVA EXPORTS.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3286,
        "code": 12010611,
        "name": "SHIP-LOG A/S",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3323,
        "code": 12010648,
        "name": "FREIGHT SHIPPING AND LOGISTICS GLOBAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3358,
        "code": 12010683,
        "name": "VDH NEXT BV",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3372,
        "code": 12010697,
        "name": "GENEL TRANSPORT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3377,
        "code": 12010702,
        "name": "JAN CONTAINER LINES LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3458,
        "code": 12010783,
        "name": "Noatum Logistics Japan Limited",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3521,
        "code": 12010846,
        "name": "LAMAIGNERE CARGO ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3528,
        "code": 12010853,
        "name": "SURGEPORT LOGISTICS PRIVATE LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, Warehouse, ",
        "partytypeid": 3
    },
    {
        "oldId": 3571,
        "code": 12010896,
        "name": "NOWAKOWSKI TRANSPORT SP Z O O",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3611,
        "code": 12010936,
        "name": "ARABIAN CARGO LEBANON",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3616,
        "code": 12010941,
        "name": "TAQ ENTERPRISES SERVICES CARGO (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3624,
        "code": 12010949,
        "name": "VILDEN ASSOCIATES INC.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Overseas Agent, Warehouse, ",
        "partytypeid": 3
    },
    {
        "oldId": 3640,
        "code": 12010965,
        "name": "TRANSFERA",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 3658,
        "code": 12010983,
        "name": "INDO TRANS LOGISTICS CORPORATION ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Overseas Agent, ",
        "partytypeid": 3
    }
    ],
  "clientList":[
    {
        "oldId": 121,
        "code": 1,
        "name": "BILAL AND CO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 124,
        "code": 4,
        "name": "PACIFIC FREIGHT SYSTEMS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 125,
        "code": 5,
        "name": "A. L. GARMENTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 126,
        "code": 6,
        "name": "A.H TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 127,
        "code": 7,
        "name": "A.I.R INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 128,
        "code": 8,
        "name": "A.J WORLDWIDE SERVICE PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 129,
        "code": 9,
        "name": "A.O ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 130,
        "code": 10,
        "name": "AFRAZ KNIT & STITCH PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 131,
        "code": 11,
        "name": "AGRO HUB INTERNATIONAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 132,
        "code": 12,
        "name": "AL AMIN EXPORT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 133,
        "code": 13,
        "name": "AL KARAM TOWEL INDUSTRIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 134,
        "code": 14,
        "name": "AL-HAMDOLILLAH EXPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 135,
        "code": 15,
        "name": "ALI TRADING COMPANY (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 137,
        "code": 17,
        "name": "AMANIA SUPPORT SERVICES SMC (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 140,
        "code": 20,
        "name": "ARMS SNACKS FOODS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 141,
        "code": 21,
        "name": "ARSHAD CORPORATION (PVT)LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 142,
        "code": 22,
        "name": "ARTISTIC DENIM MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 143,
        "code": 23,
        "name": "ARTISTIC FABRIC MILLS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 144,
        "code": 24,
        "name": "ARTISTIC GARMENTS INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 145,
        "code": 25,
        "name": "AYOOB TEX.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 146,
        "code": 26,
        "name": "AYOOB TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 147,
        "code": 27,
        "name": "AZ APPAREL CHAK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 148,
        "code": 28,
        "name": "AZGARD NINE LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 149,
        "code": 29,
        "name": "BARAKA TEXTILES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 150,
        "code": 30,
        "name": "BARI TEXTILE MILLS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 151,
        "code": 31,
        "name": "BATLASONS,",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 153,
        "code": 33,
        "name": "BESTWAY CEMENT LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 154,
        "code": 34,
        "name": "BHANERO TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 156,
        "code": 36,
        "name": "CAAV GROUP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 157,
        "code": 37,
        "name": "CAMBRIDGE GARMENT INDUSTRIES(PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 158,
        "code": 38,
        "name": "CARE LOGISTICS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 160,
        "code": 40,
        "name": "CENTURY ENGINEERING INDUSTRIES (PVT)LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 161,
        "code": 41,
        "name": "CHAWALA ENTERPRISES TEXTILES MANUFA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 162,
        "code": 42,
        "name": "CONVENIENCE FOOD INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 163,
        "code": 43,
        "name": "CRESCENT COTTON MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 164,
        "code": 44,
        "name": "D.K INDUSTRIES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 167,
        "code": 47,
        "name": "DIAMOND FABRICS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 168,
        "code": 48,
        "name": "DOUBLE \"A\" INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 170,
        "code": 50,
        "name": "EMBASSY OF DENMARK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 171,
        "code": 51,
        "name": "EUR LOGISTICS SERVICES PAKISTAN PRIVATE LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 173,
        "code": 53,
        "name": "FAZAL & CO.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 174,
        "code": 54,
        "name": "FEROZE1888 MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 175,
        "code": 55,
        "name": "FINE GROUP INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 176,
        "code": 56,
        "name": "FIRST AMERICAN CORPORATION (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 177,
        "code": 57,
        "name": "FOURTEX APPARELS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 179,
        "code": 59,
        "name": "G.I.ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 180,
        "code": 60,
        "name": "GLOBAL TECHNOLOGIES & SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 181,
        "code": 61,
        "name": "GUJRANWAL FOOD INDUSTRIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 182,
        "code": 62,
        "name": "H & H MARINE PRODUCTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 183,
        "code": 63,
        "name": "HAMID LEATHER (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 184,
        "code": 64,
        "name": "HAYAT KIMYA PAKISTAN (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 185,
        "code": 65,
        "name": "HEALTHY SALT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 186,
        "code": 66,
        "name": "HERBION PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 187,
        "code": 67,
        "name": "HOM QUALITY FOODS (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 188,
        "code": 68,
        "name": "HUB-PAK SALT REFINERY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 189,
        "code": 69,
        "name": "HUSSAIN LEATHER CRAFT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 190,
        "code": 70,
        "name": "INDUS HOME LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 192,
        "code": 72,
        "name": "INTERNATIONAL BUSINESS HUB.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 193,
        "code": 73,
        "name": "INTERNATIONAL TEXTILE LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 195,
        "code": 75,
        "name": "J.B CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 196,
        "code": 76,
        "name": "JAFFSON ENTERPRISES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 197,
        "code": 77,
        "name": "JAWA INDUSTRY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 198,
        "code": 78,
        "name": "JB INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 199,
        "code": 79,
        "name": "JK SPINNING MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 201,
        "code": 81,
        "name": "JUBILEE KNITWEAR INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 202,
        "code": 82,
        "name": "KARSAZ TEXTILE INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 203,
        "code": 83,
        "name": "KHADIJA INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 204,
        "code": 84,
        "name": "KOHINOOR MILLS LIMITED (DYING DIV)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 205,
        "code": 85,
        "name": "KZ HOSIERY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 207,
        "code": 87,
        "name": "LEATHER FIELD (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 208,
        "code": 88,
        "name": "LIBERMANN INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 209,
        "code": 89,
        "name": "LONGVIEW (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 210,
        "code": 90,
        "name": "LOTTE KOLSON (PVT.) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 211,
        "code": 91,
        "name": "LUCKY TEXTILE MILLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 212,
        "code": 92,
        "name": "M. MAQSOOD CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 213,
        "code": 93,
        "name": "M.K KNITS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 214,
        "code": 94,
        "name": "MAGNACRETE PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 217,
        "code": 97,
        "name": "MASOOD TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 218,
        "code": 98,
        "name": "MASS APPARELS & FABRICS (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 219,
        "code": 99,
        "name": "MASTER MOTORS CORP (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 220,
        "code": 100,
        "name": "MEHRAN MARBLE INDUSTRIES.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 221,
        "code": 101,
        "name": "MEHRAN MARMI INDUSTRIES PVT.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 222,
        "code": 102,
        "name": "MEHRAN SPICE & INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 223,
        "code": 103,
        "name": "METALLOGEN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 224,
        "code": 104,
        "name": "METROTEX INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 226,
        "code": 106,
        "name": "MN TEXTILES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 227,
        "code": 107,
        "name": "MUSTAQIM DYEING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 229,
        "code": 109,
        "name": "NATIONAL REFINERY LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 230,
        "code": 110,
        "name": "NAVEENA INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 231,
        "code": 111,
        "name": "NAZEER APPARELS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 232,
        "code": 112,
        "name": "NETWORK ASIA LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 233,
        "code": 113,
        "name": "NEW MALIK & ASSOCIATES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 235,
        "code": 115,
        "name": "NISHAT MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 236,
        "code": 116,
        "name": "NIZAMIA APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 237,
        "code": 117,
        "name": "NUTRALFA AGRICOLE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 238,
        "code": 118,
        "name": "NUTRALFA PRIVATE LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 241,
        "code": 121,
        "name": "PAK ARAB PIPELINE COMPANY LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 242,
        "code": 122,
        "name": "PAK SUZUKI MOTOR CO LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 243,
        "code": 123,
        "name": "PAKISTAN ONYX MARBLE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 244,
        "code": 124,
        "name": "PAXAR PAKISTAN (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 245,
        "code": 125,
        "name": "PELIKAN KNITWEAR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 247,
        "code": 127,
        "name": "PROCESS INDUSTRY PROCUREMENT CONSULTANTS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 248,
        "code": 128,
        "name": "RAUF UNIVERSAL SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 249,
        "code": 129,
        "name": "REEMAXE GROUP OF INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 250,
        "code": 130,
        "name": "REVEL INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 252,
        "code": 132,
        "name": "ROYAL TREND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 254,
        "code": 134,
        "name": "S.AHMED GARMENTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 255,
        "code": 135,
        "name": "S.M. TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 256,
        "code": 136,
        "name": "SAMI RAGS ENTERPRISES 74",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 257,
        "code": 137,
        "name": "SANALI SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 258,
        "code": 138,
        "name": "SAPPHIRE FIBRES LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 259,
        "code": 139,
        "name": "SAPPHIRE FINISHING MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 260,
        "code": 140,
        "name": "SARENA INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 261,
        "code": 141,
        "name": "SCANZA ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 263,
        "code": 143,
        "name": "SEA BLUE LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Shipping Line, ",
        "partytypeid": 1
    },
    {
        "oldId": 264,
        "code": 144,
        "name": "SESIL PVT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 265,
        "code": 145,
        "name": "SHADDAN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 266,
        "code": 146,
        "name": "SHAFI GLUCOCHEM (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 268,
        "code": 148,
        "name": "SHIP THROUGH LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 269,
        "code": 149,
        "name": "SK STONES (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 270,
        "code": 150,
        "name": "SOLEHRE BROTHERS INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 273,
        "code": 153,
        "name": "STELLA SPORTS,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 274,
        "code": 154,
        "name": "STUDIO MARK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 275,
        "code": 155,
        "name": "SULTAN C/O MR. FAISAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 276,
        "code": 156,
        "name": "SULTEX INDUSTRIES.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 277,
        "code": 157,
        "name": "SUNTEX APPAREL INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 278,
        "code": 158,
        "name": "SUPREME RICE MILLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 279,
        "code": 159,
        "name": "SURGICON LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 280,
        "code": 160,
        "name": "SYNERGY LOGISTICS PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 281,
        "code": 161,
        "name": "TAJ INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 282,
        "code": 162,
        "name": "TALON SPORTS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 283,
        "code": 163,
        "name": "TRANDS APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 284,
        "code": 164,
        "name": "Thread Experts",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 285,
        "code": 165,
        "name": "UNITED TOWEL EXPORTERS(PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 286,
        "code": 166,
        "name": "URWA INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 287,
        "code": 167,
        "name": "USMAN & SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 288,
        "code": 168,
        "name": "USSK TEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 289,
        "code": 169,
        "name": "UTOPIA INDUSTRIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 290,
        "code": 170,
        "name": "UZAIR INTERNAITONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 291,
        "code": 171,
        "name": "Universal Logistics Services (Pvt.) Ltd.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 292,
        "code": 172,
        "name": "VISION TECHNOLOGIES CORPORATION PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 293,
        "code": 173,
        "name": "YASHA TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 294,
        "code": 174,
        "name": "Z.R SPORTS COMPANY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 296,
        "code": 176,
        "name": "ZAHABIYA CHEMICAL INDUSTRIES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 298,
        "code": 178,
        "name": "ZENITH TEXTILE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 299,
        "code": 179,
        "name": "ZEPHYR TEXTILES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 300,
        "code": 180,
        "name": "ZUBISMA APPARLE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 811,
        "code": 691,
        "name": "A.K ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 812,
        "code": 692,
        "name": "A.Y LEATHER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 814,
        "code": 694,
        "name": "AAS MOVING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 815,
        "code": 695,
        "name": "ABDUR RAHMAN CORPORATION (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 816,
        "code": 696,
        "name": "ABID TEXTILE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 818,
        "code": 698,
        "name": "ADNAN APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 819,
        "code": 699,
        "name": "AERO EXPRESS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 820,
        "code": 700,
        "name": "AERTEX ENTERPRISES.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 821,
        "code": 701,
        "name": "AFINO TEXTILE MILLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 823,
        "code": 703,
        "name": "AFROZE TEXTILE IND (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 824,
        "code": 704,
        "name": "AIR BLUE LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 826,
        "code": 706,
        "name": "AIRSIAL ENGINEERING & MAINTENANCE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 832,
        "code": 712,
        "name": "AL HUSNAIN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 834,
        "code": 714,
        "name": "AL HUSSAIN TRADRES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 835,
        "code": 715,
        "name": "AL MASAOOD OIL INDUSTRY SUPPLIES & SERVICES CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 837,
        "code": 717,
        "name": "AL REHMAN GLOBAL TEX (PVT) LIMITED,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 838,
        "code": 718,
        "name": "AL SUBUK ENGINEERING ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 841,
        "code": 721,
        "name": "AL-AZEEM ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 842,
        "code": 722,
        "name": "AL-FALAH IMPEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 843,
        "code": 723,
        "name": "AL-MEENA MARINE ENGINEERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 844,
        "code": 724,
        "name": "AL-SIDDIQ CONSOLIDATOR (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 845,
        "code": 725,
        "name": "AL-TAYYIBA APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 846,
        "code": 726,
        "name": "ALAM INTERNATIONAL TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 847,
        "code": 727,
        "name": "ALI TRADING Co (Pvt) Ltd.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 848,
        "code": 728,
        "name": "AM LOGISTIC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 849,
        "code": 729,
        "name": "AM TECHNOLOGIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 850,
        "code": 730,
        "name": "AMANULLAH ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 851,
        "code": 731,
        "name": "AMBALA EXPORT TRADING CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 853,
        "code": 733,
        "name": "ANAS TROPICAL PRU & VEG EXPORT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 854,
        "code": 734,
        "name": "ANDREW PAINTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 856,
        "code": 736,
        "name": "AQSA INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 857,
        "code": 737,
        "name": "ARABIAN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 858,
        "code": 738,
        "name": "ARIES LOGISTICS (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 859,
        "code": 739,
        "name": "ARSAM SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 860,
        "code": 740,
        "name": "ART LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 861,
        "code": 741,
        "name": "ARTISAN TEXTILE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 862,
        "code": 742,
        "name": "ARZOO TEXTILES MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 863,
        "code": 743,
        "name": "ASIA POULTRY FEEDS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 864,
        "code": 744,
        "name": "ASSAC CARPETS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 865,
        "code": 745,
        "name": "ASTUTE SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 866,
        "code": 746,
        "name": "ATROX INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 867,
        "code": 747,
        "name": "ATTOCK REFINERY LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 869,
        "code": 749,
        "name": "AWAN SPORTS INDUSTRIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 870,
        "code": 750,
        "name": "BACO INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 871,
        "code": 751,
        "name": "BALMEERA INTERTRADE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 872,
        "code": 752,
        "name": "BARKET FIRTILIZERS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 874,
        "code": 754,
        "name": "BILAL & COMPANY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 875,
        "code": 755,
        "name": "BOLA GEMA- PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 876,
        "code": 756,
        "name": "BOX RING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 877,
        "code": 757,
        "name": "BRIGHT SAIL PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 878,
        "code": 758,
        "name": "BROTHERS PRODUCTION PVT LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 879,
        "code": 759,
        "name": "BUKSH CARPET",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 880,
        "code": 760,
        "name": "BUREAU VERITAS PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 881,
        "code": 761,
        "name": "CAPITAL SPORTS CORPORATION (PVT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 882,
        "code": 762,
        "name": "CARGO AND COMMODITIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 883,
        "code": 763,
        "name": "CARGO CRYSTAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 884,
        "code": 764,
        "name": "CARGO SOLUTION SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 885,
        "code": 765,
        "name": "CARGO TRACK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 887,
        "code": 767,
        "name": "CASUAL CLOTHING CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 888,
        "code": 768,
        "name": "CELERITY SUPPLY CHAIN (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 889,
        "code": 769,
        "name": "CENTRAL ORDINANCE AVIATION DEPOT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 890,
        "code": 770,
        "name": "CHADHARY IJAZ AHMAD & SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 891,
        "code": 771,
        "name": "CHEEMA BROTHERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 892,
        "code": 772,
        "name": "CHENAB APPAREL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 893,
        "code": 773,
        "name": "CHT PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 894,
        "code": 774,
        "name": "CIVIL AVIATION AUTHORITY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 895,
        "code": 775,
        "name": "COMBINED LOGISTICS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 896,
        "code": 776,
        "name": "COMET SPORTS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 897,
        "code": 777,
        "name": "COMMANDING OFFICER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 898,
        "code": 778,
        "name": "COMPANION SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 899,
        "code": 779,
        "name": "CONSOLIDATION SHIPPING &",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 900,
        "code": 780,
        "name": "CONTINENTAL TEXTILES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 901,
        "code": 781,
        "name": "CORAL ENTERPRISES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 902,
        "code": 782,
        "name": "COTTON CLUB",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 903,
        "code": 783,
        "name": "CROSS WEAR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 904,
        "code": 784,
        "name": "D.G. Khan Cement Co. Ltd",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 905,
        "code": 785,
        "name": "DANISH TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 906,
        "code": 786,
        "name": "DAWOOD MEAT COMPANY (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 907,
        "code": 787,
        "name": "DEEPSEA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 908,
        "code": 788,
        "name": "DELTEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 912,
        "code": 792,
        "name": "DIGRACIA KNITS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 913,
        "code": 793,
        "name": "DISTRICT CONTROLLER OF STORES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 914,
        "code": 794,
        "name": "DIVINE LOGISTICS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 916,
        "code": 796,
        "name": "DYNAMIC TOOLING SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 917,
        "code": 797,
        "name": "E2E SUPPLY CHAIN MANAGMENT (PVT) LT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 919,
        "code": 799,
        "name": "ECU LINE PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 921,
        "code": 801,
        "name": "EESHOO TOYS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 922,
        "code": 802,
        "name": "ELEGANT Co",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 923,
        "code": 803,
        "name": "ENGINEERING SOLUTIONS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 924,
        "code": 804,
        "name": "ENGRO POWERGEN QADIRPUR LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 925,
        "code": 805,
        "name": "EURO SUPPLY CHAIN & LOGISTICS SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 926,
        "code": 806,
        "name": "EUROTEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 928,
        "code": 808,
        "name": "F.E.B INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 929,
        "code": 809,
        "name": "FAHAD INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 930,
        "code": 810,
        "name": "FAIRDEAL MILLS (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 931,
        "code": 811,
        "name": "FAISAL FABRICS LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 932,
        "code": 812,
        "name": "FAISAL SPINNING MILLS LTD FINISHING UNIT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 935,
        "code": 815,
        "name": "FAST FLY IMPEX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 936,
        "code": 816,
        "name": "FATIMA WEAVING MILLS (PVT)LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 937,
        "code": 817,
        "name": "FAUJI FRESH N FREEZE LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 938,
        "code": 818,
        "name": "FAZAL CLOTH MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 939,
        "code": 819,
        "name": "FAZAL REHMAN FABRICS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 941,
        "code": 821,
        "name": "FILTRADER PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 942,
        "code": 822,
        "name": "FINE COTTON TEXTILES.,",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 943,
        "code": 823,
        "name": "FOODEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 944,
        "code": 824,
        "name": "FORCE FIVE PVT LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 945,
        "code": 825,
        "name": "FORTE LOGISTICS SOLUTIONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 946,
        "code": 826,
        "name": "G.M FASHION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 951,
        "code": 831,
        "name": "GETZ PHARMA (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 952,
        "code": 832,
        "name": "GLOBAL CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 953,
        "code": 833,
        "name": "GLOBAL LOGISTICS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 954,
        "code": 834,
        "name": "GLOBE X LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 955,
        "code": 835,
        "name": "GLOBELINK PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 956,
        "code": 836,
        "name": "GLOW PAK INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 957,
        "code": 837,
        "name": "GOLD & SILVER TITANIUM IND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 958,
        "code": 838,
        "name": "GREEN BRIDGE ENTERPRISE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 960,
        "code": 840,
        "name": "GUL AHMED TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 961,
        "code": 841,
        "name": "GULF CHEMICALS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 963,
        "code": 843,
        "name": "HADI RASHEED SAIYID",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 964,
        "code": 844,
        "name": "HAFIZ TANNERY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 965,
        "code": 845,
        "name": "HAFIZ TANNERY (IMPORT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 967,
        "code": 847,
        "name": "HAMZA ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 968,
        "code": 848,
        "name": "HANA CARPETS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 969,
        "code": 849,
        "name": "HANZ TILES & CERAMICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 970,
        "code": 850,
        "name": "HASHI CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 971,
        "code": 851,
        "name": "HASNAIN CARGO SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 972,
        "code": 852,
        "name": "HASSAN INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 975,
        "code": 855,
        "name": "HI JEANS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 976,
        "code": 856,
        "name": "HIGHWAY LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 978,
        "code": 858,
        "name": "HONEST FOOD PRODUCTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 980,
        "code": 860,
        "name": "HORIZAN MFG CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 981,
        "code": 861,
        "name": "IBRAHIM ASSOCIATES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 982,
        "code": 862,
        "name": "IDREES (CARGO LINKERS)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 983,
        "code": 863,
        "name": "IEDGE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 984,
        "code": 864,
        "name": "IMRAN BROTHERS.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 985,
        "code": 865,
        "name": "IMTCO PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 986,
        "code": 866,
        "name": "INDEPENDENT OIL TOOLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 988,
        "code": 868,
        "name": "INT'L AIR & SEA CARGO SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 989,
        "code": 869,
        "name": "INT'L TEXTILE DISTRIBUTORS INC",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 990,
        "code": 870,
        "name": "INTER FREIGHT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 991,
        "code": 871,
        "name": "INTER FREIGHT - SAJID",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 992,
        "code": 872,
        "name": "INTERNATIONAL BUSINESS CENTRE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 993,
        "code": 873,
        "name": "INTERNATIONAL BUSINESS CENTRE.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 994,
        "code": 874,
        "name": "INTERNATIONAL CARGO MANAGEMENT (ICM)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 996,
        "code": 876,
        "name": "IRAN & BUKHARA PALACE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 997,
        "code": 877,
        "name": "IRON FIST IMPEX (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 999,
        "code": 879,
        "name": "ISMAIL SPORTS GARMENTS IND",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1000,
        "code": 880,
        "name": "ITD TEXTILES (PVT.) LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1001,
        "code": 881,
        "name": "JAFFER AGRO SERVICES (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1002,
        "code": 882,
        "name": "JAGTEX (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1003,
        "code": 883,
        "name": "JAGUAR (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1004,
        "code": 884,
        "name": "JAHANZAIB MISBAH",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1005,
        "code": 885,
        "name": "JAMAL DIN LEATHER IMPEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1007,
        "code": 887,
        "name": "JAUN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1008,
        "code": 888,
        "name": "JEHANGIR KHAN INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1009,
        "code": 889,
        "name": "JEHANZEB MUHMAND & CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1010,
        "code": 890,
        "name": "JOONAID CO.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1011,
        "code": 891,
        "name": "K-ELECTRIC LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1012,
        "code": 892,
        "name": "K.A. ENTERPRISES PRIVATE LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1013,
        "code": 893,
        "name": "K.B. ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1014,
        "code": 894,
        "name": "K.P INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1015,
        "code": 895,
        "name": "KAMAL TEXTILE MILLS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1016,
        "code": 896,
        "name": "KAMRAN C/O GERRY'S",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1019,
        "code": 899,
        "name": "KARACHI CARGO SERVICES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1020,
        "code": 900,
        "name": "KAYSONS INTERNATIONAL (PVT.) L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1021,
        "code": 901,
        "name": "KHATTAK TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1022,
        "code": 902,
        "name": "KIMPEX SPORTS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1023,
        "code": 903,
        "name": "KOHAT CEMENT COMPANY LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1024,
        "code": 904,
        "name": "KOHINOOR TEXTILES MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1025,
        "code": 905,
        "name": "KRISHNA SPORTS CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1026,
        "code": 906,
        "name": "LAKHANAY SILK MILLS (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1027,
        "code": 907,
        "name": "LASER SPORTS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1029,
        "code": 909,
        "name": "LOGWAYS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1030,
        "code": 910,
        "name": "LOJISTICA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1031,
        "code": 911,
        "name": "M. A. ARAIN & BROTHERS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1032,
        "code": 912,
        "name": "M.R. INDUSTRIES.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1033,
        "code": 913,
        "name": "M.T TECHNIQUES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1034,
        "code": 914,
        "name": "M.TAYYAB M.SHOAIB TRADING CORP.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1035,
        "code": 915,
        "name": "M/S BOX RING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1036,
        "code": 916,
        "name": "MACHTRADE CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1037,
        "code": 917,
        "name": "MACRO EXPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1038,
        "code": 918,
        "name": "MAHAD SPORTS WEAR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1039,
        "code": 919,
        "name": "MAHMOOD BROTHERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1040,
        "code": 920,
        "name": "MALIK SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1041,
        "code": 921,
        "name": "MAMA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1042,
        "code": 922,
        "name": "MAP ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1044,
        "code": 924,
        "name": "MAQSOOD TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1045,
        "code": 925,
        "name": "MAROOF INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1046,
        "code": 926,
        "name": "MASHRIQ GEMS.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1047,
        "code": 927,
        "name": "MASTER TEXTILE MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1049,
        "code": 929,
        "name": "MAVRK JEANS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1050,
        "code": 930,
        "name": "MAXPEED SHIPPING & LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1052,
        "code": 932,
        "name": "MEDISPOREX (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1053,
        "code": 933,
        "name": "MEHAR CARGO (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1054,
        "code": 934,
        "name": "MEHER AND CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1056,
        "code": 936,
        "name": "METAL MASTERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1057,
        "code": 937,
        "name": "MINZI INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1058,
        "code": 938,
        "name": "MISC. (PERSONAL BAGG/EFECT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1059,
        "code": 939,
        "name": "MISL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1061,
        "code": 941,
        "name": "MISTIQUBE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1062,
        "code": 942,
        "name": "MOHSIN TEXTILE",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1064,
        "code": 944,
        "name": "MRS RAFIKA ABDUL KHALIQ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1065,
        "code": 945,
        "name": "MRS. AZRA ASIF SATTAR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1066,
        "code": 946,
        "name": "MS HINA SHARIQ / C/O SHAHID SAHAB",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1067,
        "code": 947,
        "name": "MUEED ESTABLISHMENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1068,
        "code": 948,
        "name": "MUHAMMAD NAWAZ",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1070,
        "code": 950,
        "name": "MUSHKO PRINTING SOLUTIONS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1071,
        "code": 951,
        "name": "MUSHTAQ INTERNATIONAL TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1072,
        "code": 952,
        "name": "MUSTAFA & COMPANY (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1073,
        "code": 953,
        "name": "MUSTAQIM DYING & PRINTING INDUSTRIES PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1074,
        "code": 954,
        "name": "MUTABAL FOOD LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1078,
        "code": 958,
        "name": "Muhammad Jahangir Enterprises",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1079,
        "code": 959,
        "name": "NABIQASIM INDUSTRIES PVT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1080,
        "code": 960,
        "name": "NAIZMH ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1081,
        "code": 961,
        "name": "NASARUN EXPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1082,
        "code": 962,
        "name": "NAUTILUS GLOBAL MARINE SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1083,
        "code": 963,
        "name": "NAVEENA EXPORTS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1086,
        "code": 966,
        "name": "NFK EXPORTS ( PVT ) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1087,
        "code": 967,
        "name": "NIAZ GARMENTS INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1089,
        "code": 969,
        "name": "NOOR SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1090,
        "code": 970,
        "name": "NOSH FOOD INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1091,
        "code": 971,
        "name": "NOVA INTERNATIONAL PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1092,
        "code": 972,
        "name": "NOVA LEATHER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1094,
        "code": 974,
        "name": "OHRENMANN CARPET PALACE.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1096,
        "code": 976,
        "name": "ORGANO BOTANICA",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1097,
        "code": 977,
        "name": "ORIENT CARGO SERVICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1098,
        "code": 978,
        "name": "ORIENT TEXTILE MILLS LIMTED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1099,
        "code": 979,
        "name": "PACIFIC FREIGHT SYSTEM(PVT)LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1100,
        "code": 980,
        "name": "PAK APPARELS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1101,
        "code": 981,
        "name": "PAK AVIATION ENGINEERING SRVS (2)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1102,
        "code": 982,
        "name": "PAK HYDRAULIC & TRADING CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1103,
        "code": 983,
        "name": "PAK MINES INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1106,
        "code": 986,
        "name": "PAK VEGETABLES & FRUITS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1108,
        "code": 988,
        "name": "PAKISTAN AIR FORCE ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1109,
        "code": 989,
        "name": "PAKISTAN INTERNATIONAL AIRLINE CORP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1110,
        "code": 990,
        "name": "PARAMOUNT TRADING CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1111,
        "code": 991,
        "name": "PCS LOGISTICS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1112,
        "code": 992,
        "name": "PEARL SCAFFOLD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1113,
        "code": 993,
        "name": "PELLE CLASSICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1114,
        "code": 994,
        "name": "PENNA OVERSEAS CORP",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1115,
        "code": 995,
        "name": "PERFECT ASSOCIATES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1117,
        "code": 997,
        "name": "PREMIER TRADERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1119,
        "code": 999,
        "name": "PRIME COAT PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1120,
        "code": 1000,
        "name": "PROHAND INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1122,
        "code": 1002,
        "name": "PUNJAB THERMAL POWER PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1123,
        "code": 1003,
        "name": "QUALITY DYEING & FINISHING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1124,
        "code": 1004,
        "name": "QUALITY EXPORT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1125,
        "code": 1005,
        "name": "QUICE FOOD INDUSTRIES LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1127,
        "code": 1007,
        "name": "R.J INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1128,
        "code": 1008,
        "name": "RABI ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1129,
        "code": 1009,
        "name": "RAJA BROTHERS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1130,
        "code": 1010,
        "name": "RAJWANI APPAREL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1131,
        "code": 1011,
        "name": "RAJWANI DENIM MILLS (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1132,
        "code": 1012,
        "name": "RANI & COMPANY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1133,
        "code": 1013,
        "name": "REAL STAR SURGICAL INSTRUMENTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1134,
        "code": 1014,
        "name": "REHMAT E SHEREEN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1135,
        "code": 1015,
        "name": "RELIANCE COTTON SPINNING MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1136,
        "code": 1016,
        "name": "RIMMER INDUSTRIES (REGD)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1137,
        "code": 1017,
        "name": "RISHAD MATEEN & CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1138,
        "code": 1018,
        "name": "RISING SPORTSWEAR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1139,
        "code": 1019,
        "name": "ROSHAN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1140,
        "code": 1020,
        "name": "ROWER SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1141,
        "code": 1021,
        "name": "RUBY COLLECTION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1142,
        "code": 1022,
        "name": "S M DENIM MILLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1144,
        "code": 1024,
        "name": "S.SAQLAINIA ENTERPRISE (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1145,
        "code": 1025,
        "name": "SAARUNG SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1146,
        "code": 1026,
        "name": "SACHIN SPORTS INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1148,
        "code": 1028,
        "name": "SADAQAT LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1149,
        "code": 1029,
        "name": "SAEED KHAN ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1150,
        "code": 1030,
        "name": "SAFAI INTERNATIONAL.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1151,
        "code": 1031,
        "name": "SAFINA LOGISTICS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1152,
        "code": 1032,
        "name": "SAIM MOBEEN FOOD INDUSTRIES LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1154,
        "code": 1034,
        "name": "SAJJAN S/O IBRAHIM.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1155,
        "code": 1035,
        "name": "SALIMUSA SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1156,
        "code": 1036,
        "name": "SALMIS FURNISHERS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1159,
        "code": 1039,
        "name": "SAPPHIRE FINISHING MILLS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1160,
        "code": 1040,
        "name": "SARENA TEXTILE INDUSTRIES (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1161,
        "code": 1041,
        "name": "SAUDI PAK LIVE STOCK (KHURSHEED)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1162,
        "code": 1042,
        "name": "SAUDI PAK LIVE STOCK (POTATO)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1163,
        "code": 1043,
        "name": "SAUDI PAK LIVE STOCK MEAT CO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1164,
        "code": 1044,
        "name": "SAVILLE WHITTLE INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1165,
        "code": 1045,
        "name": "SAZ INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1166,
        "code": 1046,
        "name": "SCHAZOO PHARMACEUTICAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1167,
        "code": 1047,
        "name": "SEA GOLD (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1168,
        "code": 1048,
        "name": "SEA WAY LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1169,
        "code": 1049,
        "name": "SEAGULL SHIPPING & LOGISTICS  (PVT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Forwarder/Coloader, ",
        "partytypeid": 1
    },
    {
        "oldId": 1171,
        "code": 1051,
        "name": "SERVICE INDUSTRIES LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1172,
        "code": 1052,
        "name": "SERVOPAK SHIPPING AGENCY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1173,
        "code": 1053,
        "name": "SERVOTECH PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1174,
        "code": 1054,
        "name": "SEVEN STAR INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1175,
        "code": 1055,
        "name": "SG MANUFACTURER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1176,
        "code": 1056,
        "name": "SHADAB CORP",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1178,
        "code": 1058,
        "name": "SHAHAB GARMENTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1179,
        "code": 1059,
        "name": "SHAHEEN AIR INT'L LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1180,
        "code": 1060,
        "name": "SHAHEEN AIR INTL LTD (2)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1181,
        "code": 1061,
        "name": "SHAHID & SONS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1183,
        "code": 1063,
        "name": "SHANCO SPORTS CORPORATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1184,
        "code": 1064,
        "name": "SHANGRILA FOODS (PRIVATE) LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1185,
        "code": 1065,
        "name": "SHEKHANI INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1187,
        "code": 1067,
        "name": "SINE INTERNATIONAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1188,
        "code": 1068,
        "name": "SITARA CHEMICAL INDS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1189,
        "code": 1069,
        "name": "SKY LINKERS INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1190,
        "code": 1070,
        "name": "SMA ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1191,
        "code": 1071,
        "name": "SMS CHEMICAL INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1192,
        "code": 1072,
        "name": "SNS IMPEX",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1194,
        "code": 1074,
        "name": "SPORTS CHANNEL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1195,
        "code": 1075,
        "name": "SQ COMMODITIES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1196,
        "code": 1076,
        "name": "STAR SHIPPING (PVT)",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1197,
        "code": 1077,
        "name": "STARPAK MARTIAL ARTS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1198,
        "code": 1078,
        "name": "STITCH LINE APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1199,
        "code": 1079,
        "name": "STYLO SHOES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1201,
        "code": 1081,
        "name": "SUN INDUSTRIAL EQUIPMENT PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1203,
        "code": 1083,
        "name": "SUNNY ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1205,
        "code": 1085,
        "name": "SUNNY INT'L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1206,
        "code": 1086,
        "name": "SURYA SPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1207,
        "code": 1087,
        "name": "SWIFT SHIPPING (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1209,
        "code": 1089,
        "name": "T S MARBLE INDUSTRY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1210,
        "code": 1090,
        "name": "TABO GUGOO INDUSTRIES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1211,
        "code": 1091,
        "name": "TAJ ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1212,
        "code": 1092,
        "name": "TEAM FREIGHT MANAGEMENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1213,
        "code": 1093,
        "name": "TETRA PAK PAKISTAN LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1214,
        "code": 1094,
        "name": "TEX KNIT INT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1215,
        "code": 1095,
        "name": "TEX-KNIT INT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1216,
        "code": 1096,
        "name": "TEXTILE CHANNEL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1217,
        "code": 1097,
        "name": "TEXTILE VISION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1218,
        "code": 1098,
        "name": "THE CRESCENT TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1219,
        "code": 1099,
        "name": "THE INDUS HOSPITAL & HEALTH NETWORK",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1220,
        "code": 1100,
        "name": "THE LEATHER COMPANY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1221,
        "code": 1101,
        "name": "THE ORGANIC MEAT COMPANY (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1222,
        "code": 1102,
        "name": "THE SPORT STORE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1223,
        "code": 1103,
        "name": "THE TREASURER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1224,
        "code": 1104,
        "name": "TNG  LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1226,
        "code": 1106,
        "name": "TRADE INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1227,
        "code": 1107,
        "name": "U & I GARMENTS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1228,
        "code": 1108,
        "name": "U.K MARTIAL ARTS INTERNATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1229,
        "code": 1109,
        "name": "UNI CRAFT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1230,
        "code": 1110,
        "name": "UNIBIS LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1231,
        "code": 1111,
        "name": "UNIBRO INDUSTRIES LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1232,
        "code": 1112,
        "name": "UNICORP INSTRUMENT",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1233,
        "code": 1113,
        "name": "UNION CARGO (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1234,
        "code": 1114,
        "name": "UNION FABRICS PRIVATE LIMITED",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1235,
        "code": 1115,
        "name": "UNIQUE ENTERPRISES (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1236,
        "code": 1116,
        "name": "UNIQUE MARITIME",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1237,
        "code": 1117,
        "name": "UNISHIP GLOBAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1238,
        "code": 1118,
        "name": "UNISHIP GLOBAL SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1240,
        "code": 1120,
        "name": "UNITED TOWEL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1241,
        "code": 1121,
        "name": "UNIVERSAL FREIGHT SYSTEMS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1242,
        "code": 1122,
        "name": "UNIVERSAL SHIPPING",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1243,
        "code": 1123,
        "name": "VENUS GLOBAL LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1245,
        "code": 1125,
        "name": "VISION AIR INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1247,
        "code": 1127,
        "name": "VISION TECHNOLOGIES CORPORATION (PRIVATE) L",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1250,
        "code": 1130,
        "name": "WATER REGIME (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1251,
        "code": 1131,
        "name": "WELCOME SHIPPING AIDS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1252,
        "code": 1132,
        "name": "WELDON INSTRUMENTS.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1253,
        "code": 1133,
        "name": "WILD ORCHARD (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1254,
        "code": 1134,
        "name": "WINGS EXPRESS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1255,
        "code": 1135,
        "name": "WORLD LINK SHIPPING AGENCY",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1257,
        "code": 1137,
        "name": "WUSQA INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1258,
        "code": 1138,
        "name": "XPRESS LOGISTICES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1262,
        "code": 1142,
        "name": "ZADAF ( PVT ) LTD.",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1875,
        "code": 1755,
        "name": "SHARIF & ELAHI CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1889,
        "code": 1769,
        "name": "M.N. TEXTILES (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1893,
        "code": 1773,
        "name": "SONIC TEXTILE INDUSTRIES (PVT) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1894,
        "code": 1774,
        "name": "DANIYAL ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1911,
        "code": 1791,
        "name": "MAHEEN TEXTILE MILLS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1922,
        "code": 1802,
        "name": "NUTEX INTERNATIONAL ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 1924,
        "code": 1804,
        "name": "FAISAL FABRICS LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2001,
        "code": 12010118,
        "name": "AL-GHOSIA IND",
        "address": null,
        "strn": "NULL",
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2082,
        "code": 12010122,
        "name": "PERFECT FOOD INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2245,
        "code": "CC-00884",
        "name": "HANA CARPET",
        "address": null,
        "strn": "NULL",
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2399,
        "code": 12010128,
        "name": "SUNRISE ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2401,
        "code": 12010130,
        "name": "BLUEJET ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, ",
        "partytypeid": 1
    },
    {
        "oldId": 2402,
        "code": 12010131,
        "name": "SUBLI MASTER",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, ",
        "partytypeid": 1
    },
    {
        "oldId": 2403,
        "code": 12010132,
        "name": "STITCHWELL GARMENTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Consignee, ",
        "partytypeid": 1
    },
    {
        "oldId": 2501,
        "code": "CU-00647",
        "name": "PAKISTAN INTERNATIONAL AIRLINES CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2536,
        "code": "CU-00013",
        "name": "PROLINE (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2600,
        "code": "CU-00721",
        "name": "SAAR INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2602,
        "code": "CU-00902",
        "name": "Sadaf Enterprises",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2675,
        "code": "CU-00146",
        "name": "SOORTY ENTERPRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2799,
        "code": "CC-11914",
        "name": "IMRAN BROTHERS TEXTILE (PRIVATE) LIMITED",
        "address": null,
        "strn": "NULL",
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2814,
        "code": 12010139,
        "name": "REPSTER WEARS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2826,
        "code": 12010151,
        "name": "ITTEFAQ TRADING CO.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2838,
        "code": 12010163,
        "name": "CREST ARTCRAFT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2849,
        "code": 12010174,
        "name": "ENGLISH FASHION.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2851,
        "code": 12010176,
        "name": "Hilal Foods (Pvt.) Ltd.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2863,
        "code": 12010188,
        "name": "A.R. HOSIERY WORKS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2869,
        "code": 12010194,
        "name": "HERMAIN ENTERPRISE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2873,
        "code": 12010198,
        "name": "ALLIED TRADING CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2875,
        "code": 12010200,
        "name": "LUCERNA TRADING DMCC C/OF: ABM INFO TECH (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2890,
        "code": 12010215,
        "name": "WORLD G CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2892,
        "code": 12010217,
        "name": "H.NIZAM DIN AND SONS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2906,
        "code": 12010231,
        "name": "ANSA INDUSTRIES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2907,
        "code": 12010232,
        "name": "SCS EXPRESS PVT LTD CUSTOMER",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2909,
        "code": 12010234,
        "name": "SPONA SPORTS.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2913,
        "code": 12010238,
        "name": "AHMED FINE WEAVING LTD.,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2914,
        "code": 12010239,
        "name": "COLONY TEXTILE MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2915,
        "code": 12010240,
        "name": "NISHAT (CHUNIAN) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2917,
        "code": 12010242,
        "name": "ROBIQA ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2926,
        "code": 12010251,
        "name": "FIRST STONE CORPORATION PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2932,
        "code": 12010257,
        "name": "MARK ONE SURGICAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2935,
        "code": 12010260,
        "name": "SAMZ APPAREL ( PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2948,
        "code": 12010273,
        "name": "SUNRISE EXPORTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2953,
        "code": 12010278,
        "name": "FULLMOON ENTERPRISES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2956,
        "code": 12010281,
        "name": "ABDUL WASI ULFAT S/O ABDUL HADI ULFAT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2969,
        "code": 12010294,
        "name": "PAKISTAN NAVY C/O COMMANDING OFFICER",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2972,
        "code": 12010297,
        "name": "SHAFI LIFESTYLE (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2974,
        "code": 12010299,
        "name": "Raheel Amanullah ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2977,
        "code": 12010302,
        "name": "DARSON INDUSTRIES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2982,
        "code": 12010307,
        "name": "WITTVOLK EUROPE INTERNATIONAL GENERAL TRADING LLC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2991,
        "code": 12010316,
        "name": "ZIA OOCL LOG",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2992,
        "code": 12010317,
        "name": "GE HYDRO FRANCE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3008,
        "code": 12010333,
        "name": "F.B. INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3014,
        "code": 12010339,
        "name": "AL TAYYIBA APPAREL.,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3015,
        "code": 12010340,
        "name": "JAGUAR APPAREL (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3021,
        "code": 12010346,
        "name": "SULTANIA GARMENTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3026,
        "code": 12010351,
        "name": "DANCO FRESH",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3031,
        "code": 12010356,
        "name": "EMBASSY OF DENMARK.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3063,
        "code": 12010388,
        "name": "AL-MADINAH ISLAMIC RESEARCH CENTRE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3066,
        "code": 12010391,
        "name": "THE ORGANIC MEAT COMPANY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3069,
        "code": 12010394,
        "name": "RANS INTL FREIGHT FOWARDING CO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3073,
        "code": 12010398,
        "name": "TAHIR CARPETS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3075,
        "code": 12010400,
        "name": "AERTEX SPORTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3080,
        "code": 12010405,
        "name": "ARRIZA GROUP",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3090,
        "code": 12010415,
        "name": "QST INTERNATIONAL.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3094,
        "code": 12010419,
        "name": "JAGUAR APPAREL (PRIVATE) LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, Notify, ",
        "partytypeid": 1
    },
    {
        "oldId": 3096,
        "code": 12010421,
        "name": "TROUT APPAREL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3099,
        "code": 12010424,
        "name": "TRIMCO PAKISTAN (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3108,
        "code": 12010433,
        "name": "NLC MARINE & AIR SERVICES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3114,
        "code": 12010439,
        "name": "DALDA FOODS LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3116,
        "code": 12010441,
        "name": "MEZAN TEA (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3117,
        "code": 12010442,
        "name": "THE PARACHA TEXTILE MILLS LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3119,
        "code": 12010444,
        "name": "JAVED AHMED KAIMKHANI",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3121,
        "code": 12010446,
        "name": "JAY + ENN SAFETY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3129,
        "code": 12010454,
        "name": "THAR COAL BLOCK-1 POWER GENERATION COMPANY (PVT) L",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3144,
        "code": 12010469,
        "name": "SNA TRADERS.CO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3152,
        "code": 12010477,
        "name": "HUGO SPORT PAK",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3154,
        "code": 12010479,
        "name": "STITCHWELL GARMENTS.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3156,
        "code": 12010481,
        "name": "ROOMI FABRICS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3157,
        "code": 12010482,
        "name": "MASOOD FABRICS LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3159,
        "code": 12010484,
        "name": "UNIVERSAL CABLES INDUSTRIES LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3172,
        "code": 12010497,
        "name": "NAZ TEXTILES (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3189,
        "code": 12010514,
        "name": "KHALID OVERSEAS CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3193,
        "code": 12010518,
        "name": "CENTRAL SURGICAL CO. (PVT) LTD.,",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3198,
        "code": 12010523,
        "name": "GOHAR TEXTILE MILLS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3200,
        "code": 12010525,
        "name": "PERFECT GLOVES MANUFACTURER CO (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3202,
        "code": 12010527,
        "name": "ABRAR ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3205,
        "code": 12010530,
        "name": "ECO GREEN / UK COURIER",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3212,
        "code": 12010537,
        "name": "CRETESOL (PRIVATE) LIMITED",
        "address": null,
        "strn": "3021956-6",
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3214,
        "code": 12010539,
        "name": "AOL APPAREL PRIVATE LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3226,
        "code": 12010551,
        "name": "RANA IMPEX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3232,
        "code": 12010557,
        "name": "Blow Plast (Pvt) Limited",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3236,
        "code": 12010561,
        "name": "PAK FASHEO CLOTHING COMPANY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3240,
        "code": 12010565,
        "name": "ANABIA GARMENTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3245,
        "code": 12010570,
        "name": "PIK PAK INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3247,
        "code": 12010572,
        "name": "QASIM INTERNATIONAL CONTAINER TERMINAL PAKISTAN LT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3264,
        "code": 12010589,
        "name": "Jilani Shipping International",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3272,
        "code": 12010597,
        "name": "SHEIKH MUHAMMAD SAEED & SONS",
        "address": null,
        "strn": 1200410501682,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, ",
        "partytypeid": 1
    },
    {
        "oldId": 3283,
        "code": 12010608,
        "name": "ADAMJEE ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3297,
        "code": 12010622,
        "name": "SUNSHINE GLOVES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3304,
        "code": 12010629,
        "name": "MASUM LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3306,
        "code": 12010631,
        "name": "CASUAL CLOTHING CO. ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3308,
        "code": 12010633,
        "name": "KITARIYA BROTHERS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3314,
        "code": 12010639,
        "name": "VELOCITY SOLUTIONS ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3317,
        "code": 12010642,
        "name": "GLOBEX SAFETY (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3325,
        "code": 12010650,
        "name": "AK GROUP ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3337,
        "code": 12010662,
        "name": "PERFORMANCE SURGICAL INSTRUMENTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3340,
        "code": 12010665,
        "name": "ZIL LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3347,
        "code": 12010672,
        "name": "TEKNOKRAT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3353,
        "code": 12010678,
        "name": "ECOM LOGISTIX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3356,
        "code": 12010681,
        "name": "REMO SPORTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3363,
        "code": 12010688,
        "name": "CONTINENTAL TOWELS  (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3375,
        "code": 12010700,
        "name": "KUMAIL GLOVES INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3378,
        "code": 12010703,
        "name": "CMYK SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3393,
        "code": 12010718,
        "name": "GILLANI INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3406,
        "code": 12010731,
        "name": "MUSTHAFA IMRAN AHMED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3434,
        "code": 12010759,
        "name": "PETRO SOURCING (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3436,
        "code": 12010761,
        "name": "CARE MEDICAL SUPPLIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3440,
        "code": 12010765,
        "name": "ALPINE INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3451,
        "code": 12010776,
        "name": "MDS COMPANY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3456,
        "code": 12010781,
        "name": "KARIMA TEXTILE RECYCLER (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3457,
        "code": 12010782,
        "name": "RAVI ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, CHA/CHB, ",
        "partytypeid": 1
    },
    {
        "oldId": 3476,
        "code": 12010801,
        "name": "FAISAL SPINNING MILLS TLD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3479,
        "code": 12010804,
        "name": "GHANI GLASS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3487,
        "code": 12010812,
        "name": "CP PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3490,
        "code": 12010815,
        "name": "LIGHT PAK GLOBAL INDUSTRIES (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3491,
        "code": 12010816,
        "name": "ARTISTIC MILLINERS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3501,
        "code": 12010826,
        "name": "SSD TRADING INC",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3505,
        "code": 12010830,
        "name": "DUKE TEXTILES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3516,
        "code": 12010841,
        "name": "HAMMAD TEXTILE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3517,
        "code": 12010842,
        "name": "BABRI IMP.,EXP & DIST",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3519,
        "code": 12010844,
        "name": "TRANSACT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3522,
        "code": 12010847,
        "name": "ENGRO POLYMERAND CHEMICALS LIMITED.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3524,
        "code": 12010849,
        "name": "YUNUS TEXTILE MILLS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3526,
        "code": 12010851,
        "name": "PAK HUA INDUSTRIAL CO (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3530,
        "code": 12010855,
        "name": "BABRI IMP.,EXP. & DIST",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3533,
        "code": 12010858,
        "name": "AQSA INDUSTRIES (PRIVATE) LIMITED",
        "address": null,
        "strn": "8307630-0",
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3534,
        "code": 12010859,
        "name": "LEATHER ENGINEER CO.",
        "address": null,
        "strn": 2656648.6,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3541,
        "code": 12010866,
        "name": "KERRY FREIGHT PAKISTAN (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3550,
        "code": 12010875,
        "name": "A.U. TEXTILE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3557,
        "code": 12010882,
        "name": "LAKHANI INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3584,
        "code": 12010909,
        "name": "FINE GRIP IMPORT EXPORT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3593,
        "code": 12010918,
        "name": "AL KAREEM TEXTILES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3595,
        "code": 12010920,
        "name": "Q.N.ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3601,
        "code": 12010926,
        "name": "ZEPHYR TEXTILES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3605,
        "code": 12010930,
        "name": "TECHNICARE CORPORATION",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3607,
        "code": 12010932,
        "name": "PANTHER TYRES LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3610,
        "code": 12010935,
        "name": "HIGH SAFETY INDUSTRY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3614,
        "code": 12010939,
        "name": "THAPUR PAKISTAN PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3620,
        "code": 12010945,
        "name": "DOWELL SCHLUMBERGER (WESTERN) ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3627,
        "code": 12010952,
        "name": "SAMARTEX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3632,
        "code": 12010957,
        "name": "TUF PAK SPORTS WORKS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3637,
        "code": 12010962,
        "name": "S.S. MEDIDENT INTERNATIONAL",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3644,
        "code": 12010969,
        "name": "KPDC FOOD & SPECIALTY CHEMICALS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3646,
        "code": 12010971,
        "name": "SHABBIR INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3647,
        "code": 12010972,
        "name": "I.Q KNITWEAR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3648,
        "code": 12010973,
        "name": "AMFSH INDUSTRY",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3651,
        "code": 12010976,
        "name": "Askari Chartered Services (ACS)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3656,
        "code": 12010981,
        "name": "CITROPAK LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3665,
        "code": 12010990,
        "name": "KAREEM QUALITY RAGS (PVT.) LTD.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3675,
        "code": 12011000,
        "name": "AKSA TEX STYLE INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3677,
        "code": 12011002,
        "name": "NEW ZEENAT TEXTILE MILLS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3678,
        "code": 12011003,
        "name": "KEYSTONE ENTERPRISES (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3681,
        "code": 12011006,
        "name": "RIZVI ASSOCIATES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 178,
        "code": 58,
        "name": "FULLMOON ENTERPRISES",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 200,
        "code": 80,
        "name": "JUBILEE APPAREL",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 216,
        "code": 96,
        "name": "MARVA EXPORTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 225,
        "code": 105,
        "name": "MILESTONE TEXTILES.",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Commission Agent, Delivery Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 240,
        "code": 120,
        "name": "OOCL LOGISTICS PAKISTAN (PRIVATE) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Forwarder/Coloader, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 262,
        "code": 142,
        "name": "SCS EXPRESS PVT LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Overseas Agent, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 267,
        "code": 147,
        "name": "SHAFI TEXCEL LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 271,
        "code": 151,
        "name": "SONIC TEXTILE INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 334,
        "code": 214,
        "name": "NEWS LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Local Vendor, Overseas Agent, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 353,
        "code": 233,
        "name": "UNIVERSAL SHIPPING (PVT.) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Local Vendor, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 691,
        "code": 571,
        "name": "SERVOTECH SHIPPING (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Overseas Agent, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 743,
        "code": 623,
        "name": "XPRESS AVIATION",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Local Vendor, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 909,
        "code": 789,
        "name": "DENIM CRAFTS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 911,
        "code": 791,
        "name": "DIGITAL APPAREL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 918,
        "code": 798,
        "name": "EASTWAY GLOBAL FORWARDING LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Shipper, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 934,
        "code": 814,
        "name": "FAST & FINE CARGO SERVICES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Shipper, Local Vendor, Transporter, ",
        "partytypeid": 3
    },
    {
        "oldId": 947,
        "code": 827,
        "name": "GARATEX",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1028,
        "code": 908,
        "name": "LIBERTY MILLS LIMITED",
        "address": null,
        "strn": 201511103746,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1075,
        "code": 955,
        "name": "MY CARGO",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Local Vendor, CHA/CHB, ",
        "partytypeid": 3
    },
    {
        "oldId": 1076,
        "code": 956,
        "name": "MY LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Local Vendor, Commission Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1084,
        "code": 964,
        "name": "NAWAZ FABRICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1121,
        "code": 1001,
        "name": "PROLINE (PVT) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1170,
        "code": 1050,
        "name": "SERENE AIR",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Shipper, Local Vendor, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 1182,
        "code": 1062,
        "name": "SHAHZAD APPARELS (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1239,
        "code": 1119,
        "name": "UNISHIP PAKISTAN",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1332,
        "code": 1212,
        "name": "ACA INTERNATIONAL (HONG KONG) LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1910,
        "code": 1790,
        "name": "LEATHER COORDINATOR",
        "address": null,
        "strn": 410420300928,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1917,
        "code": 1797,
        "name": "LANAM INTERNATIONAL",
        "address": null,
        "strn": 3277876117060,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1925,
        "code": 1805,
        "name": "A.L. GARMENTS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1926,
        "code": 1806,
        "name": "SIDDIQSONS LIMITED",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1927,
        "code": 1807,
        "name": "THE DESIGNER",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1928,
        "code": 1808,
        "name": "EASTERN SPINNING MILLS LILMITED ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1929,
        "code": 1809,
        "name": "B A TEXTILE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1930,
        "code": 1810,
        "name": "TULIP TOWEL IND (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 1932,
        "code": 1812,
        "name": "KAYSONS INTERNATIONAL (PVT) LTD",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 2115,
        "code": 12010124,
        "name": "THREAD CONNECT",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 2145,
        "code": "CU-00633",
        "name": "DURRANI ASSOCIATES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 2819,
        "code": 12010144,
        "name": "RAJCO INDUSTRIES",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 2845,
        "code": 12010170,
        "name": "AIR & SEA LOGISTICS",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 2975,
        "code": 12010300,
        "name": "Raheel @ Amanullah ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, Local Vendor, Commission Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2994,
        "code": 12010319,
        "name": "OOCL LOG (ZIA)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 3107,
        "code": 12010432,
        "name": "GARATEX IND",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Shipper, Warehouse, ",
        "partytypeid": 3
    },
    {
        "oldId": 3239,
        "code": null,
        "name": "IMRAN @ ALLIED LOG",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, ",
        "partytypeid": 3
    },
    {
        "oldId": 3303,
        "code": 12010628,
        "name": "SHAN CARGO",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, Transporter, ",
        "partytypeid": 3
    },
    {
        "oldId": 3339,
        "code": 12010664,
        "name": "SEAFREIGHT ADVISOR",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, CHA/CHB, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 3418,
        "code": 12010743,
        "name": "ZAHID-(DO)",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3444,
        "code": 12010769,
        "name": "MURTAZA-PIA",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3575,
        "code": 12010900,
        "name": "JAFFAR - TK - LHE",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Local Vendor, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 3680,
        "code": 12011005,
        "name": "ZAHID ",
        "address": null,
        "strn": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, Local Vendor, ",
        "partytypeid": 3
    }
    ],
  "unknown":[
    {
        "oldId": 3135,
        "code": 12010460,
        "name": "BEE LOGISTICS CORPORATION",
        "citycode": "KHPNH",
        "zip": null,
        "person1": "SAMBATH.LITA (Ms.) EXPORT SUPERVISOR",
        "mobile1": "+855 16 400 545",
        "telephone1": "+855.23.967272",
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "phnompenh.office@beelogistics.com",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "",
        "partytypeid": null
    },
    {
        "oldId": 3249,
        "code": 12010574,
        "name": "ALTRON SHIPPING PTE LTD",
        "citycode": "SGSIN",
        "zip": null,
        "person1": "Katrina Lin-Sales & Marketing Department",
        "mobile1": "65 84445188",
        "telephone1": "(65) 6325 6500",
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "Katrina <katrina@altronshpg.com.sg",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "",
        "partytypeid": null
    },
    {
        "oldId": 3401,
        "code": 12010726,
        "name": "FREIGHT WORLD PAKISTAN (PRIVATE) LIMITED",
        "citycode": "PKKHI",
        "zip": null,
        "person1": "Jawwad ul Haq",
        "mobile1": null,
        "telephone1": "+92 21 3432 1246 to 48 ",
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "jawwad@freightworld.com.pk",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "",
        "partytypeid": null
    },
    {
        "oldId": 3490,
        "code": 12010815,
        "name": "LIGHT PAK GLOBAL INDUSTRIES (PRIVATE) LIMITED",
        "citycode": "PKSKT",
        "zip": null,
        "person1": "MR.Usama Shafiq",
        "mobile1": 3354721092,
        "telephone1": 3354721092,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "lightpak@cyber.net.pk",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "",
        "types": "",
        "partytypeid": null
    }
    ]
}

let accountsList = {
    "Assets":[
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
    "Liability":[
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
    "Expense":[
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
    "income":[
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
    "Capital":[
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

let clientsLeft = [
    {
        "oldId": 121,
        "code": 1,
        "name": "BILAL AND CO",
        "citycode": "PKKHI",
        "zip": 75340,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 124,
        "code": 4,
        "name": "PACIFIC FREIGHT SYSTEMS (PVT) LTD",
        "citycode": "PKKHI",
        "zip": 75100,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 2991,
        "code": 12010316,
        "name": "ZIA OOCL LOG",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
   
    {
        "oldId": 3675,
        "code": 12011000,
        "name": "AKSA TEX STYLE INDUSTRIES",
        "citycode": "PKMUX",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3677,
        "code": 12011002,
        "name": "NEW ZEENAT TEXTILE MILLS",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3678,
        "code": 12011003,
        "name": "KEYSTONE ENTERPRISES (PVT) LTD",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 3681,
        "code": 12011006,
        "name": "RIZVI ASSOCIATES",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 1
    },
    {
        "oldId": 200,
        "code": 80,
        "name": "JUBILEE APPAREL",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 334,
        "code": 214,
        "name": "NEWS LOGISTICS",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Local Vendor, Overseas Agent, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 353,
        "code": 233,
        "name": "UNIVERSAL SHIPPING (PVT.) LTD",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "shiraz@usl.com.pk",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, Sea Import, ",
        "types": "Consignee, Shipper, Local Vendor, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 691,
        "code": 571,
        "name": "SERVOTECH SHIPPING (PVT) LTD",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": "21-2428791",
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, Sea Import, ",
        "types": "Consignee, Overseas Agent, Shipping Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 909,
        "code": 789,
        "name": "DENIM CRAFTS",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": "NULL",
        "branchname": "NULL",
        "operations": "Air Export, Sea Export, ",
        "types": "Shipper, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 1332,
        "code": 1212,
        "name": "ACA INTERNATIONAL (HONG KONG) LIMITED",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": "+852 9438 1209",
        "telephone1": "+852 3101 1433",
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": "Sam.Chan@acaint.com",
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Air Import, Sea Export, ",
        "types": "Consignee, Overseas Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2975,
        "code": 12010300,
        "name": "Raheel @ Amanullah ",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Sea Export, ",
        "types": "Shipper, Local Vendor, Commission Agent, ",
        "partytypeid": 3
    },
    {
        "oldId": 2994,
        "code": 12010319,
        "name": "OOCL LOG (ZIA)",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, Sea Export, ",
        "types": "Consignee, Shipper, ",
        "partytypeid": 3
    },
 
    {
        "oldId": 3339,
        "code": 12010664,
        "name": "SEAFREIGHT ADVISOR",
        "citycode": "PKSKT",
        "zip": 51410,
        "person1": "LIAQUAT ALI BAJWA",
        "mobile1": null,
        "telephone1": 92523257553,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Shipper, CHA/CHB, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 3418,
        "code": 12010743,
        "name": "ZAHID-(DO)",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3444,
        "code": 12010769,
        "name": "MURTAZA-PIA",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Import, ",
        "types": "Consignee, Local Vendor, ",
        "partytypeid": 3
    },
    {
        "oldId": 3575,
        "code": 12010900,
        "name": "JAFFAR - TK - LHE",
        "citycode": "PKLHE",
        "zip": null,
        "person1": "JAFFAR - TK - LHE",
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Local Vendor, Air Line, ",
        "partytypeid": 3
    },
    {
        "oldId": 3680,
        "code": 12011005,
        "name": "ZAHID ",
        "citycode": "PKKHI",
        "zip": null,
        "person1": null,
        "mobile1": null,
        "telephone1": null,
        "telephone2": null,
        "address": null,
        "website": null,
        "infoMail": null,
        "strn": null,
        "accountsMail": null,
        "bankname": null,
        "branchname": null,
        "operations": "Air Export, ",
        "types": "Consignee, Shipper, Local Vendor, ",
        "partytypeid": 3
    }
]