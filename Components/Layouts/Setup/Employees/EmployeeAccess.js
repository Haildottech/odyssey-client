import { Form, Input, DatePicker, Select  } from "formik-antd";
import { Formik, useField, useFormikContext } from 'formik';
import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import "antd/dist/antd.css";
import * as Yup from 'yup';
import axios from 'axios';

const EmployeeAccess = () => {

  const [values, setValues] = useState({
    name:'',
  })

  useEffect(() => {
    // NEXT_PUBLIC_CLIMAX_POST_CREATE_EMPLOYEE_ACCESS ;
    // NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES ;
    fetchData();
    console.log('Acess Page') ;
  }, [])

  const fetchData = async() => {
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_ALL_EMPLOYEES)
    .then((x)=>console.log(x.data));
  }

  return (
    <div>
      Employee Access
    </div>
  )
}

export default EmployeeAccess
