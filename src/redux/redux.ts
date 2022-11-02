import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IService } from "../api/mainApi";

interface serviceSpecialstDate {
    services: IService[];
}

const initialState = {services: []} as serviceSpecialstDate;

const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: initialState,
    reducers: {
        addService(state, action: PayloadAction<IService>){
            state.services.push(action.payload);
        },
        removeService(state, action: PayloadAction<number>){
            state.services = state.services.filter(service => service.id !== action.payload);
        }
    }
});

export const {addService, removeService} = mainSlice.actions;
export default mainSlice.reducer;