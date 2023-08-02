import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap';
import readXlsxFile from 'read-excel-file'

const Requests = ({sessionData}) => {

  useEffect(() => {
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
  }, [sessionData]);

  const [files, setFiles] = useState();

  return (
    <div className='base-page-layout'>
        <input type="file" value={files} onChange={(e)=>{
          setFiles(e.target.value)
            readXlsxFile(e.target.files[0]).then((rows) => {
              console.log(rows.splice(10, 1594))
            })

        }} />
    </div>
  )
}

export default Requests