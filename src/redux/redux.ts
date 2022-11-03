import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmployee, IService } from "../api/mainApi";


export type IServiceInSlice =  IService & {
    categoryName: string;
}
interface serviceEmployeeDate {
    services: IServiceInSlice[];
    employee: IEmployee;
}

const initialState = {services: [], employee: {commentsCount: 0, description: '', id: -1, images: {tiny: '', full: '',}, isActive: false, name: '', rating: 0, sort: 0, specialization: ''}} as serviceEmployeeDate;

const mainSlice = createSlice({
    name: 'mainSlice',
    initialState: initialState,
    reducers: {
        addService(state, action: PayloadAction<IServiceInSlice>){
            state.services.push(action.payload);
        },
        removeService(state, action: PayloadAction<number>){
            state.services = state.services.filter(service => service.id !== action.payload);
        },
        setEmployee(state, action: PayloadAction<IEmployee>){
            state.employee = action.payload;
        },
        unsetEmployee(state) {
            state.employee = {commentsCount: 0, description: '', id: -1, images: {tiny: '', full: '',}, isActive: false, name: '', rating: 0, sort: 0, specialization: ''};
        }
    }
});

export const {addService, removeService, setEmployee, unsetEmployee} = mainSlice.actions;
export default mainSlice.reducer;