import React, { useEffect, useReducer } from 'react';
import { recordsReducer, initialState, baseValues } from './states';
import CreateOrEdit from './CreateOrEdit';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { useJobValuesQuery, useJobDataQuery } from '/redux/apis/seJobValues';

const SeJob = ({id, type}) => {

  const { data, isSuccess:dataSuccess } = useJobValuesQuery();
  const { data:newdata, isSuccess, refetch } = useJobDataQuery({id:id, operation:type});
  const companyId = useSelector((state) => state.company.value);
  const [ state, dispatch ] = useReducer(recordsReducer, initialState);

  useEffect(() => {
    let tempPerms = JSON.parse(Cookies.get('permissions'));
    if(dataSuccess && newdata) {
      dispatch({type:'set',
        payload:{
          fields:data.result,
          selectedRecord:dataSuccess?newdata?.result:{},
          fetched:true,
          edit:id=="new"?false:true,
          permissions:tempPerms
        }
      })
    }
  }, [dataSuccess, isSuccess])

  return (
  <>
    <div className='base-page-layout'>
      {state.fetched && 
        <>
          <CreateOrEdit
            jobData={isSuccess?newdata.result:{}}
            baseValues={baseValues}
            companyId={companyId}
            dispatch={dispatch}
            refetch={refetch}
            state={state}
            type={type}
            id={id}
          />
        </>
      }
    </div>
  </>
  )
}

export default React.memo(SeJob);