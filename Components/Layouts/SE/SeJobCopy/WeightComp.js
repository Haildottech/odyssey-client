import React from "react";
import { Row, Col } from "react-bootstrap";
import InputNumComp from "/Components/Shared/Form/InputNumComp";
import SelectComp from "/Components/Shared/Form/SelectComp";
import { InputNumber } from "antd";

const Weights = ({register, control, getStatus, allValues, type, approved, getWeight}) => {

    const packageValues = [
        {label:'BAGS', value:'BAGS'},
        {label:'BALES', value:'BALES'},
        {label:'BARRELS', value:'BARRELS'},
        {label:'CARTONS', value:'CARTONS'},
        {label:'BLOCKS', value:'BLOCKS'},
        {label:'BOATS', value:'BOATS'},
        {label:'BOBBIN', value:'BOBBIN'},
        {label:'BOTTLES', value:'BOTTLES'},
        {label:'BOXES', value:'BOXES'},
        {label:'BRIQUETTES', value:'BRIQUETTES'},
        {label:'BUNDLES', value:'BUNDLES'},
        {label:'CABLE DRUM', value:'CABLE DRUM'},
        {label:'CANS', value:'CANS'},
        {label:'CARBOY', value:'CARBOY'},
        {label:'CARTONS', value:'CARTONS'},
        {label:'CASE', value:'CASE'},
        {label:'CASKS', value:'CASKS'},
        {label:'COILS', value:'COILS'},
        {label:'COLLI', value:'COLLI'},
        {label:'CRATES', value:'CRATES'},
        {label:'CYLINDERS', value:'CYLINDERS'},
        {label:'DOZENS', value:'DOZENS'},
        {label:'DRUMS', value:'DRUMS'},
        {label:'FUBRE DRUMS', value:'FUBRE DRUMS'},
        {label:'ITEMS', value:'ITEMS'},
        {label:'JOTTAS', value:'JOTTAS'},
        {label:'KEGS', value:'KEGS'},
        {label:'LOOSE', value:'LOOSE'},
        {label:'METAL DRUMS', value:'METAL DRUMS'},
        {label:'METERS', value:'METERS'},
        {label:'MODULES', value:'MODULES'},
        {label:'PACKETS', value:'PACKETS'},
        {label:'PACKAGES', value:'PACKAGES'},
        {label:'PAILS', value:'PAILS'},
        {label:'PALLETS', value:'PALLETS'},
        {label:'PARCELS', value:'PARCELS'},
        {label:'PIECES', value:'PIECES'},
        {label:'PLASTIC DRUMS', value:'PLASTIC DRUMS'},
        {label:'REELS', value:'REELS'},
        {label:'ROLLS', value:'ROLLS'},
        {label:'SACKS', value:'SACKS'},
        {label:'SETS', value:'SETS'},
        {label:'SHEETS', value:'SHEETS'},
        {label:'SKIDS', value:'SKIDS'},
        {label:'SLABS', value:'SLABS'},
        {label:'STEEL PACKAGES', value:'STEEL PACKAGES'},
        {label:'STEEL PLATES', value:'STEEL PLATES'},
        {label:'STEEL TRUNKS', value:'STEEL TRUNKS'},
        {label:'TES CHESTS', value:'TES CHESTS'},
        {label:'TONS', value:'TONS'},
        {label:'UNIT', value:'UNIT'}
    ]

    return(
    <div className='px-2 pb-2' style={{border:'1px solid silver'}}>
    <Row>
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='weight' control={control} width={"100%"} label='Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>
        {allValues.subType=="LCL" &&
        <Col md={6} className='mt-2'>
            <SelectComp register={register} name='weightUnit' control={control} label='WT Unit' width={"100%"} disabled={getStatus(approved)}
                options={[  
                    {"id":"KG"   , "name":"KG"},
                    {"id":"LBS"  , "name":"LBS"},
                    {"id":"MTON" , "name":"MTON"}
                ]}
            />
        </Col>}
        {allValues.subType=="FCL" &&
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='bkg' control={control} width={"100%"} label='BKG Weight' step={'0.01'} disabled={getStatus(approved)} />
        </Col>}
        {allValues.subType=="FCL" &&
        <Col md={6} className='mt-2'>
            <div>Container</div>
            <InputNumber value={getWeight().qty} disabled style={{width:"100%"}} />
        </Col>}
        {((allValues.subType=="FCL" && type=="SE")||(allValues.subType=="LCL" && type=="SI")) && 
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='shpVol' control={control} label='Shp Vol' width={"100%"} step={'0.01'} disabled={getStatus(approved)} />
        </Col>}
        {allValues.subType=="FCL" &&
        <Col md={6} className='mt-2'>
            <div>TEU</div><InputNumber value={getWeight().teu} disabled style={{width:"100%", color:'black'}} />
        </Col>}
        <Col md={6} className='mt-2'>
            <InputNumComp register={register} name='vol' control={control} label={`${allValues.subType=="LCL"?"Bill":""} Vol`} width={"100%"} step={'0.00001'} disabled={getStatus(approved)}/>
        </Col>
        {allValues.subType=="LCL" &&<Col md={6}></Col>}
        <Col md={3} className='mt-2'>
            <InputNumComp register={register} name='pcs' control={control}  label='PCS' width={"100%"} disabled={getStatus(approved)} />
        </Col>
        <Col md={9} className='mt-2'>
            <SelectComp register={register} name='pkgUnit' control={control} label='.' width={"100%"} disabled={getStatus(approved)}
                options={packageValues.map((x)=>{
                    return {id:x.label, name:x.value}
                })}
            />
        </Col>
    </Row>
    </div>
    )
}
export default Weights