import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  values:{
    id:"",
    hbl:"",
    hblDate:"",
    hblIssue:"",
    mbl:"",
    mblDate:"",
    status:"",
    blReleaseStatus:"",
    releaseInstruction:"",
    remarks:"",
    shipDate:"",
    shipperContent:"",
    consigneeContent:"",
    notifyOneContent:"",
    notifyTwoContent:"",
    deliveryContent:"",
    marksContent:"",
    noOfPckgs:"",
    descOfGoodsContent:"",
    grossWeightContent:"",
    measurementContent:"",
    AgentStamp:"",
    hs:"",
    onBoardDate:"",
    issuePlace:"",
    issueDate:"",
    poDeliveryTwo:"",
    podTwo:"",
    polTwo:"",
    agentM3:"",
    coloadM3:"",
    formE:"",
    createdAt:"",
    updatedAt:"",
    SEJobId:"",
    notifyPartyOneId:"",
    notifyPartyTwoId:""
  }
}

export const seJobValuesSlice = createSlice({
  name: 'seJobValues',
  initialState,
  reducers: {
    appendValue: (state, action) => {
      state.values = action.payload
    },
  },
})

export const { appendValue } = seJobValuesSlice.actions

export default seJobValuesSlice.reducer