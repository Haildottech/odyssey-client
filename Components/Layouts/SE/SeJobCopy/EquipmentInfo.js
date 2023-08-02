import React from 'react';
import { Table } from 'react-bootstrap';
import { Select, Input  } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import PopConfirm from '../../../Shared/PopConfirm';

const EquipmentInfo = ({state, dispatch}) => {

  const width = 162
  return (
    <div style={{minHeight:630, maxHeight:630}}>
      <div className=''>
        <button type='button' className='btn-custom right'
          onClick={()=>{
            let tempState = [...state.equipments];
            tempState.push({size:'', qty:'', dg:'', gross:'', teu:''});
            dispatch({type:'toggle', fieldName:'equipments', payload:tempState});
          }}>Add</button>
      </div>
    <Table className='x-5'>
        <thead>
          <tr>
            <th>Size/Type</th>
            <th>Qty</th>
            <th>DG/Non-DG</th>
            <th>Gross WT/CNT</th>
            <th>TEU</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {state.equipments.map((x, i) => {
            return(
              <tr className='f' key={i}>
                <td>
                <Select style={{width:width}} value={x.size}
                  onChange={(e)=>{
                    let tempState = [...state.equipments];
                    tempState[i].size = e;
                    if(e=='40HC'){
                      tempState[i].gross = '3,600';
                    }else if(e=='20HC') { tempState[i].gross = '0'; }
                    dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                  }}
                  options={[
                    {value:'40HC', label:'40HC'},
                    {value:'20HC', label:'20HC'},
                  ]}
                />
                </td>
                <td>
                  <Input placeholder="Basic usage" value={x.qty} style={{width:width}}
                    onChange={(e)=>{
                      let tempState = [...state.equipments];
                      tempState[i].qty = e.target.value;
                      tempState[i].teu = e.target.value*2;
                      dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                    }} />
                </td>
                <td>
                  <Select style={{ width: width }} value={x.dg}
                    onChange={(e)=>{
                      let tempState = [...state.equipments];
                      tempState[i].dg = e;
                      dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                    }} 
                    options={[
                      {value:'non-DG', label:'non-DG'},
                      {value:'DG', label:'DG'},
                    ]}
                  />
                </td>
                <td><Input placeholder="Basic usage" style={{width:width}} value={x.gross} /></td>
                <td><Input placeholder="Basic usage" style={{width:width}} value={x.teu} /></td>
                <td>
                      <CloseCircleOutlined className='mx-3 cross-icon' onClick={()=>{
                        PopConfirm(
                          "Confirmation",
                          "Are You Sure To Delete This Equipment",
                          ()=>{
                            let tempState = [...state.equipments];
                            tempState.splice(i, 1);
                            dispatch({type:'toggle', fieldName:'equipments', payload:tempState})
                          })
                        }}
                      />
                    
                </td>
              </tr>
            )
          })}
        </tbody>
    </Table>
    </div>
  )
}

export default EquipmentInfo