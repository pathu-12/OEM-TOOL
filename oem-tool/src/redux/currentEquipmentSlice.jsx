import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    duty_cycle: "",
    equipment_id: "",
    equipment_name: "",
    failure_mode: "",
    parallel_components: "",
    repair_type: "",
    parent_name: ""
};


const equipmentSlice = createSlice({
    name: 'currentEquipment',
    initialState: initialState, // Initial state is null
    reducers: {
        setCurrentEquipment: (state, action) => {
            return action.payload; // Update the selected equipment
        },
        clearCurrentEquipment: (state) => {
            return initialState; // Clear the selected equipment
        },
    },
});

export const { setCurrentEquipment, clearCurrentEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;