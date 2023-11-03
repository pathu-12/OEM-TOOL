import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    treeData: [],
    sortTreeData: [],
};

const treeData = createSlice({
    name:  "treeData",
    initialState: initialState,
    reducers: {
        addElement(state, action){
            state.treeData = [...state.treeData, ...action.payload.data];
        },
        setTreeData(state, action){

        }
    }
})