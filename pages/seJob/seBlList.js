import React from 'react';
import SEBL from '/Components/Layouts/SE/BL/';
import axios from 'axios';

const seBlList = ({partiesData, BlsData}) => {
  return <SEBL partiesData={partiesData} BlsData={BlsData} />
}

export default seBlList

export async function getServerSideProps({req,res}){

  const partiesData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_NOTIFY_PARTIES)
  .then((x)=>x.data.result);
  
  const BlsData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_BLS)
  .then((x)=>x.data.result)

  return{
      props: { partiesData:partiesData, BlsData }
  }
}