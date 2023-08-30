import React from 'react'
import  Manifest  from '../Components/Layouts/Manifest'
import axios from 'axios'

const manifist = ({awbNo}) => {
  return (
    <Manifest awbNo={awbNo}/>
  )
}

export default manifist


export async function getServerSideProps({req,res}){
  
  const values = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_AWB_NUMBER)
  .then((x)=>x.data);

  return{
    props: { awbNo : values }
  }
}