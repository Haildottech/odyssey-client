import React from 'react';
//import { useRouter } from 'next/router';
import axios from "axios";
import Jobs from '/Components/Layouts/JobsLayout/Jobs';

const aeExport = ({jobData, id, fieldsData}) => {
  return (
    <Jobs jobData={jobData} id={id} fieldsData={fieldsData} type={"AI"} />
  )
}
export default aeExport

export async function getServerSideProps(context) {
  const { params } = context;
  let jobData = {};
  const fieldsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SEAJOB_VALUES).then((x)=>x.data);
  if(params.id!="new"){
    jobData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_SE_JOB_BY_ID,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
    if (!jobData.id) {
      return {
        notFound: true
      }
    }
  }
  return {
    props: { jobData:jobData, id:params.id, fieldsData:fieldsData,  }
  }
}