import axios from "axios";

export function getJobValues() {
    return axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getValues`)
    .then((x)=>x.data)
}
export async function getJobById({id, type}) {
    console.log(id, type)
    return await axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getSEJobById`,{
        headers: {"id":`${id}`, operation:`${type}`}
    })
    .then((x)=>x.data)
}