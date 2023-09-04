import axios from "axios";

export function getJobValues() {
    return axios.get(`${process.env.NEXT_PUBLIC_CLIMAX_MAIN_URL}/seaJob/getValues`)
    .then((x)=>x.data)
}