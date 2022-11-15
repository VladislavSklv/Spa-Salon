import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmployee, IService } from "../api/mainApi";


export type IServiceInSlice =  IService & {
    categoryName: string;
}

export interface IDateAndTime {
    time: string;
    date: string;
}
interface serviceEmployeeDate {
    services: IServiceInSlice[];
    employee: IEmployee;
    dateAndTime: IDateAndTime;
}

const initialState = {services: [], employee: {commentsCount: 0, description: '', id: -1, images: {tiny: '', full: '',}, isActive: false, name: '', rating: 0, sort: 0, specialization: ''}, dateAndTime: {date: '', time: ''}} as serviceEmployeeDate;

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
        setServices(state, action: PayloadAction<IServiceInSlice[]>){
            state.services = action.payload;
        },
        setEmployee(state, action: PayloadAction<IEmployee>){
            state.employee = action.payload;
        },
        unsetEmployee(state) {
            state.employee = {commentsCount: 0, description: '', id: -1, images: {tiny: '', full: '',}, isActive: false, name: '', rating: 0, sort: 0, specialization: ''};
        },
        setDateAndTime(state, action:PayloadAction<IDateAndTime>){
            state.dateAndTime = {date: action.payload.date, time: action.payload.time};
        },
        unsetDateAndTime(state){
            state.dateAndTime = {date: '', time: ''};
        },
    }
});

export const {addService, removeService, setEmployee, unsetEmployee, setDateAndTime, unsetDateAndTime, setServices} = mainSlice.actions;
export default mainSlice.reducer;