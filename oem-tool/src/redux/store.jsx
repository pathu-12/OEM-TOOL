import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import equipmentReducer from './currentEquipmentSlice';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        currentEquipment: equipmentReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});