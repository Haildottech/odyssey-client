import React, { useState, useEffect } from 'react';
import { Row } from "react-bootstrap";
import AWBCalculator from './AWBCalculator';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import CSVReader from 'react-csv-reader';
import { getJobValues } from '/apis/jobs';
import { useQuery } from '@tanstack/react-query';

const Main = ({sessionData}) => {

  const companyId = useSelector((state) => state.company.value);
  const { data, status, error, refetch } = useQuery({
    queryKey:['values'],
    queryFn:getJobValues
  });

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login');
    }
    data;
  }, [sessionData]);

  useEffect(() => {

  }, []);

  return (
    <div className='base-page-layout'>
      <Row>
        {companyId==3 && <AWBCalculator/>}
        {companyId!=3 && 
        <>
          <div>
              {/* 
              <>
              Account List Importer
              <hr/>
              <CSVReader 
                  onFileLoaded={async(data, fileInfo, originalFile) => {
                      let parentAccounts = [];
                      let tempAccounts = [];
                      await data.forEach((x,i)=>{
                          if(i<1590){
                              tempAccounts.push({
                                  code:x[0]?.trim(),
                                  title:x[2]?.trim(),
                                  account:x[4]?.trim(),
                                  group:x[3]?.trim(),
                                  subCategory:x[5]?.trim()
                              })
                          }else{
                              return;
                          }
                      })
                      tempAccounts.forEach((x)=>{
                          if(x.group=="Group" ){
                              parentAccounts.push({
                                  title:x.title,
                                  editable:"1",
                                  CompanyId:1,
                                  subCategory:x.subCategory,
                                  AccountId:
                                      x.account=="Asset"?
                                      3:
                                      x.account=="Liability"?
                                      4:
                                      x.account=="Expense"?
                                      1:
                                      x.account=="Income"?
                                      2:5,
                                  childs:[],
                              })
                          }else if(x.group!="Group" && parentAccounts.length>0){
                              parentAccounts[parentAccounts.length-1].childs.push({
                                  title:x.title,
                                  subCategory:x.subCategory,
                                  editable:"1"
                              });
                          }
                      })
                      console.log(parentAccounts);
                  }}
              />
              </> 
              */}
          </div>
          <div>
          {/* Client List Importer
          <hr/>
          <CSVReader 
            onFileLoaded={async(data, fileInfo, originalFile) => {
              let parentAccounts = [];
              let tempAccounts = [];
              await data.forEach((x,i) => {
                if(i<2517 && i>0 && (x[0]=='1'||x[0]=='3')){
                  tempAccounts.push({
                    PartyTypeId:x[0]?.trim(),
                    code:x[2]?.trim(),
                    name:x[3]?.trim(),
                    person1:x[5]?.trim(),
                    zip:x[7]?.trim(),
                    telephone1:x[8],
                    telephone2:x[9],
                    mobile1:x[11],
                    mobile2:x[10],
                    infoMail:x[12],
                    website:x[13],
                    operations:`${x[33]}, ${x[34]}, ${x[35]}, ${x[36]}`,
                    types:`${x[17]}, ${x[18]}, ${x[19]}, ${x[26]}`,
                    //types:`${x[20]}, ${x[21]}, ${x[22]}, ${x[24]}, ${x[25]}, ${x[27]}, ${x[28]}, ${x[29]}, ${x[30]}, ${x[31]}, ${x[32]}`,
                  });
                } else {
                  return;
                }
              })
              let newTemp = [...tempAccounts];
              await newTemp.forEach((x, i) => {
                let tempAr = [];
                let tempTypeAr = [];
                tempAr = x.operations.split(", ");
                tempTypeAr = x.types.split(", ");

                let tempOperation = '';
                let tempTypes = '';

                tempOperation = tempAr[0]=='1'?'Sea Export':'';
                tempOperation = `${tempOperation}${((tempAr[0]=='1')&&tempAr[1]=='1')?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[1]=='1'?'Sea Import':''}`;
                tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1')&&(tempAr[2]=='1'))?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[2]=='1'?'Air Export':''}`;
                tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1'||tempAr[2]=='1')&&tempAr[3]=='1')?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[3]=='1'?'Air Import':''}`;
                x.operations = tempOperation;
                
                tempTypes = tempTypeAr[0]=='1'?'Shipper':''
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1')&&tempTypeAr[1]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[1]=='1'?'Consignee':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1')&&tempTypeAr[2]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[2]=='1'?'Notify':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1')&&tempTypeAr[3]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[3]=='1'?'Potential Customer':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1')&&tempTypeAr[4]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Invoice Party':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1'||tempTypeAr[4]=='1')&&tempTypeAr[5]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Non operational Party':''}`;
                x.types = tempTypes;
              })
              newTemp = newTemp.filter((x)=>{return x.types!=''});
              console.log(newTemp);
            }}
          /> */}
          </div>
          <div>
          {/* <>
          NonGL Parties List Importer
          <hr/>
          <CSVReader 
            onFileLoaded={async(data, fileInfo, originalFile) => {
              let parentAccounts = [];
              let tempAccounts = [];
              await data.forEach((x,i) => {
                if(i<2517 && i>0 && (x[0]=='4')){
                  tempAccounts.push({
                    PartyTypeId:x[0]?.trim(),
                    code:x[2]?.trim(),
                    name:x[3]?.trim(),
                    person1:x[5]?.trim(),
                    zip:x[7]?.trim(),
                    telephone1:x[8],
                    telephone2:x[9],
                    mobile1:x[11],
                    mobile2:x[10],
                    infoMail:x[12],
                    website:x[13],
                    operations:`${x[34]}, ${x[35]}, ${x[36]}, ${x[37]}`,
                    types:`${x[16]}, ${x[17]}, ${x[18]}, ${x[19]}`,
                    //types:`${x[20]}, ${x[21]}, ${x[22]}, ${x[24]}, ${x[25]}, ${x[27]}, ${x[28]}, ${x[29]}, ${x[30]}, ${x[31]}, ${x[32]}`,
                  });
                } else {
                  return;
                }
              })
              let newTemp = [...tempAccounts];

              await newTemp.forEach((x, i) => {
                let tempAr = [];
                let tempTypeAr = [];
                tempAr = x.operations.split(", ");
                tempTypeAr = x.types.split(", ");

                let tempOperation = '';
                let tempTypes = '';

                tempOperation = tempAr[0]=='1'?'Sea Export':'';
                tempOperation = `${tempOperation}${((tempAr[0]=='1')&&tempAr[1]=='1')?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[1]=='1'?'Sea Import':''}`;
                tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1')&&(tempAr[2]=='1'))?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[2]=='1'?'Air Export':''}`;
                tempOperation = `${tempOperation}${((tempAr[0]=='1'||tempAr[1]=='1'||tempAr[2]=='1')&&tempAr[3]=='1')?', ':''}`;
                tempOperation = `${tempOperation}${tempAr[3]=='1'?'Air Import':''}`;
                x.operations  = tempOperation;
                
                tempTypes = tempTypeAr[0]=='1'?'Shipper':''
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1')&&tempTypeAr[1]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[1]=='1'?'Consignee':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1')&&tempTypeAr[2]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[2]=='1'?'Notify':''}`;
                tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1')&&tempTypeAr[3]=='1')?', ':''}`;
                tempTypes = `${tempTypes}${tempTypeAr[3]=='1'?'Potential Customer':''}`;
              //   tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1')&&tempTypeAr[4]=='1')?', ':''}`;
              //   tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Invoice Party':''}`;
              //   tempTypes = `${tempTypes}${((tempTypeAr[0]=='1'||tempTypeAr[1]=='1'||tempTypeAr[2]=='1'||tempTypeAr[3]=='1'||tempTypeAr[4]=='1')&&tempTypeAr[5]=='1')?', ':''}`;
              //   tempTypes = `${tempTypes}${tempTypeAr[4]=='1'?'Non operational Party':''}`;
                x.types   = tempTypes;
              })
              
              //newTemp = newTemp.filter((x)=>{return x.types!=''});
              
              newTemp.forEach((x)=>{
                  addresses.forEach((y)=>{
                      if(y.code==x.code){
                          x.address1=y.address1
                          x.address2=y.address2
                      }
                  })
              })
              console.log(newTemp);
            }}
          />
          </>   */}
          </div>
          <div>
          {/* Parties List Importer
          <hr/>
          <CSVReader 
            onFileLoaded={async(data, fileInfo, originalFile) => {
              let parentAccounts = [];
              let tempAccounts = [];
              await data.forEach((x,i) => {
                if(i<2517 && i>0 && (x[0]=='2'||x[0]=='3')){
                  tempAccounts.push({
                    PartyTypeId:x[0]?.trim(),
                    code:x[2]?.trim(),
                    name:x[3]?.trim(),
                    person1:x[4]?.trim(),
                    zip:x[6]?.trim(),
                    telephone1:x[7],
                    telephone2:x[8],
                    mobile1:x[10],
                    mobile2:x[9],
                    infoMail:x[11],
                    website:x[12],
                    operations:`${x[34]}, ${x[35]}, ${x[36]}, ${x[37]}, ${x[39]}`,
                    //types:`${x[16]}, ${x[17]}, ${x[18]}, ${x[19]}`,
                    types:`${x[20]}, ${x[21]}, ${x[22]}, ${x[23]}, ${x[24]}, ${x[25]}, ${x[26]}, ${x[27]}, ${x[28]}, ${x[29]}, ${x[30]}, ${x[31]}, ${x[32]}, ${x[33]}`,
                  });
                } else {
                  return;
                }
              })
              let newTemp = [...tempAccounts];
              await newTemp.forEach((x, i) => {
                let tempAr = [];
                let tempTypeAr = [];
                tempAr = x.operations.split(", ");
                tempTypeAr = x.types.split(", ");

                let tempOperation = '';
                let tempTypes = '';

                tempOperation = tempAr[0]=='1'?'Sea Export':'';
                tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[1]=='1') ?', ':''}${tempAr[1]=='1'?'Sea Import':''}`;
                tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[2]=='1') ?', ':''}${tempAr[2]=='1'?'Air Export':''}`;
                tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[3]=='1') ?', ':''}${tempAr[3]=='1'?'Air Import':''}`;
                tempOperation = `${tempOperation}${(tempOperation.length>1&& tempAr[4]=='1') ?', ':''}${tempAr[4]=='1'?'Logistic':''}`;
                x.operations = tempOperation;
                
                
              //   tempTypes = tempTypeAr[0]=='1'?'Shipper':''
              //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[1]=='1') ?', ':''}${tempTypeAr[1]=='1'?'Consignee':''}`;
              //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[2]=='1') ?', ':''}${tempTypeAr[2]=='1'?'Notify':''}`;
              //   tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[3]=='1') ?', ':''}${tempTypeAr[3]=='1'?'Potential Customer':''}`;
              
              
                tempTypes = tempTypeAr[0]=='1'?'Forwarder/Coloader':''
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[1]=='1') ?', ':''}${tempTypeAr[1]=='1'?'Local Vendor':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[2]=='1') ?', ':''}${tempTypeAr[2]=='1'?'Overseas Agent':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[3]=='1') ?', ':''}${tempTypeAr[3]=='1'?'Commission Agent':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[4]=='1') ?', ':''}${tempTypeAr[4]=='1'?'Indentor':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[5]=='1') ?', ':''}${tempTypeAr[5]=='1'?'Transporter':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[6]=='1') ?', ':''}${tempTypeAr[6]=='1'?'CHA/CHB':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[7]=='1') ?', ':''}${tempTypeAr[7]=='1'?'Shipping Line':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[8]=='1') ?', ':''}${tempTypeAr[8]=='1'?'Delivery Agent':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&& tempTypeAr[9]=='1') ?', ':''}${tempTypeAr[9]=='1'?'Warehouse':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[10]=='1') ?', ':''}${tempTypeAr[10]=='1'?'Air Line':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[11]=='1') ?', ':''}${tempTypeAr[11]=='1'?'Trucking':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[12]=='1') ?', ':''}${tempTypeAr[12]=='1'?'Logistic':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[12]=='1') ?', ':''}${tempTypeAr[12]=='1'?'Import Nomination':''}`;
                tempTypes = `${tempTypes}${(tempTypes.length>1&&tempTypeAr[13]=='1') ?', ':''}${tempTypeAr[13]=='1'?'Export Nomination':''}`;

                x.types = tempTypes;
              })
              newTemp = newTemp.filter((x)=>{return x.types!=''});
              newTemp.forEach((x, i) => {
                  addresses.forEach((y)=>{
                      if(x.code==y.code){
                          newTemp[i].address1=y.address1;
                          newTemp[i].address2=y.address2;
                      }
                  })
              })
              console.log(newTemp)
              // newTemp.forEach((x) => {
              //     console.log(`${x.code} -> ${x.types}`)
              // })
            }}
          /> */}
          </div>
        </>
        }
        {/* <button onClick={()=>{
            queryClient.setQueryData(['values'],
            (oldData) => oldData ? {...oldData,result: []} : oldData)
          }}
        >
          Test
        </button>
        <button onClick={()=>refetch()}>
        Refetch
        </button> */}
      </Row>
    </div>
  )
}

export default Main