import * as yup from "yup"; 



export const initialValue = {
    awb:"",
    no_of_pc:"",
    nature_of_good:"",
    goross_wt:"",
    destination:"",
    office_use:"",
    gd:"",
    job_type:"",
    shipper_content:"",
    consignee_content:"",
    carriar_agent_content:"",
    shipper_account_no:"",
    consignee_account_no:"",
    agent_IATA_code:"",
    account_no:"",
    airport_of_departure:"",
    airport_of_destination:"",
    to:"",
    by:"",
    
    currency:"",
    chgs:"",
    ppd:"",
    coll:"",
    ppd2:"",
    coll2:"",
    declared_value_carriage:"",
    declared_value_customs:"",
    to1: "",
    by1: "",
    to2: "",
    by2: "",
    at2: "",
    sci:"",

    commodity_no:"",
    shipper_certifies:"",
    kg:"",
    by_first_carrier:"",
    routing_and_destination:"",
    requested_flight:"",
    requested_flight_date:"",
    non_negotiable:"",
    issued_by:"",
    at:"",
    on:"",
    accounting_information:"",
    refrence_number:"",
    optional_shipping_information:"",
    amount_of_insurance:"",
    handing_information:"",
    rate_class:"",
    chargeable_weight:"",
    rate:"",
    total:"",
    prepaid:"",
    weight_charge:"",
    collect:"",
    valuation_charge:"",
    tax:"",
    total_other_charges_due_agnet:"",
    total_other_charges_due_carrier:"",
    total_prepaid:"",
    total_collect:"",
    currency_conversion_rate:"",
    cc_charges_dest_currency:"",
    charges_at_destination:"",
    other_charges:"",
    excluded_on_date:"",
    total_collect_charges:"",
    issuing_agent:"",
    visible:false   
}


export const validationSchema = yup.object().shape({
    flight_no: yup.string().required('Flight No is required'),
    point_of_loading: yup.string().required('Point of Loading is required'),
})