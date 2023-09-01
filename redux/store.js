import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counter/counterSlice';
import tabsReducer from './tabs/tabSlice';
import companyReducer from './company/companySlice';
import blCreationReducer from './BlCreation/blCreationSlice';
import persistValuesReducer from './persistValues/persistValuesSlice';
import { seJobValues } from './apis/seJobValues';

export const store = configureStore({
  reducer: {
    [seJobValues.reducerPath]: seJobValues.reducer,
    counter: counterReducer,
    company: companyReducer,
    tabs: tabsReducer,
    blCreationValues: blCreationReducer,
    persistValues: persistValuesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seJobValues.middleware),
})