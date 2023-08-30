import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import InputComp from "../../Shared/Form/InputComp";



const Modal = ({index, manifest_jobs, register, control}) => {

  return (
    <div style={{ maxHeight: 760, overflowY: "auto", overflowX:'hidden', padding:10 }}>  
      <Row>
      <Col md={12}><InputComp control={control} register={register} label={"AWB Number"} width={"100%"} name={`Manifest_Jobs.${index}.awb`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Shipper's Name and Address"} width={"100%"} name={`Manifest_Jobs.${index}.shipper_content`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Consignee's Name and Address"} name={`Manifest_Jobs.${index}.consignee_content`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Issuing Carrier's Agent Name and City"} name={`Manifest_Jobs.${index}.carriiar_agent_content`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Agents's IAT Code"} name={`Manifest_Jobs.${index}.agent_IATA_code`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Account No"} name={`Manifest_Jobs.${index}.account_no`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Airport Of Departure And Requested Route"} name={`Manifest_Jobs.${index}.airport_of_departure`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Airport of Destination"} name={`Manifest_Jobs.${index}.airport_of_destination`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"To"} name={`Manifest_Jobs.${index}.to`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"By"} name={`Manifest_Jobs.${index}.by`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"By First Carrier"} name={`Manifest_Jobs.${index}.by_first_carrier`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Routing and Destination"} name={`Manifest_Jobs.${index}.routing_and_destination`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Requested Flight"} name={`Manifest_Jobs.${index}.requested_flight`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Requested Flight Date"} name={`Manifest_Jobs.${index}.requested_flight_date`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Not Negotiable Bill"} name={`Manifest_Jobs.${index}.non_negotiable`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Issued By"} name={`Manifest_Jobs.${index}.issued_by`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"At"} name={`Manifest_Jobs.${index}.at`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"On"} name={`Manifest_Jobs.${index}.on`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Account Information"} name={`Manifest_Jobs.${index}.accounting_information`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Refrence Number"} name={`Manifest_Jobs.${index}.refrence_number`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Optional Shipping Information"} name={`Manifest_Jobs.${index}.optional_shipping_information`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Amount Of Insurance"} name={`Manifest_Jobs.${index}.amount_of_insurance`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Handing Information"} name={`Manifest_Jobs.${index}.handing_information`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Rate Class"} name={`Manifest_Jobs.${index}.rate_class`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Chargeable Weight"} name={`Manifest_Jobs.${index}.chargeable_weight`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Rate"} name={`Manifest_Jobs.${index}.rate`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total"} name={`Manifest_Jobs.${index}.total`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Prepaid"} name={`Manifest_Jobs.${index}.prepaid`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Weight Charge"} name={`Manifest_Jobs.${index}.weight_charge`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Collect"} name={`Manifest_Jobs.${index}.collect`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Valuation Charge"} name={`Manifest_Jobs.${index}.valuation_charge`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Tax"} name={`Manifest_Jobs.${index}.tax`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total Other Charges Due Agent"} name={`Manifest_Jobs.${index}.total_other_charges_due_agnet`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total Other Charges Due Carrier"} name={`Manifest_Jobs.${index}.total_other_charges_due_carrier`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total Prepaid"} name={`Manifest_Jobs.${index}.total_prepaid`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total Collect"} name={`Manifest_Jobs.${index}.total_collect`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Currency Conversion Rate"} name={`Manifest_Jobs.${index}.currency_conversion_rate`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"CC Charges in Dest Currency"} name={`Manifest_Jobs.${index}.cc_charges_dest_currency`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Charges in Destination"} name={`Manifest_Jobs.${index}.charges_at_destination`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Other Charges"} name={`Manifest_Jobs.${index}.other_charges`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Excluded On Date"} name={`Manifest_Jobs.${index}.excluded_on_date`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"G/D"} name={`Manifest_Jobs.${index}.gd`}/></Col>
      <Col md={12}><InputComp control={control} register={register} label={"Total Collect Charges"} name={`Manifest_Jobs.${index}.total_collect_charges`}/></Col>
      </Row>
    </div>
  );
};

export default Modal;
