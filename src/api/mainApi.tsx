import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IService {
    id: number;
    name: string;
    description: string;
    priceMin: number;
    priceMax: number;
    images: string[];
    isActive: boolean;
    sort: number;
    length?: number;
}

export interface IServicesCategory {
    id: number;
    name: string;
    sort: number;
    services: IService[];
}

export interface IImages {
    tiny: string;
    full: string;
}

export interface IEmployee {
    id: number;
    name: string;
    description: string;
    specialization: string;
    rating: number;
    commentsCount: number;
    images: IImages;
    isActive: boolean;
    sort: number;
}

export interface ISeance {
    time: string;
}

export interface IEmployeeSchedule {
    date: string;
    seances: ISeance[];
}

export interface IComment {
    id: number;
    text: string;
    date: Date;
    rating: number;
    userName: string;
    userImage: string;
}

export interface IDates {
    bookingDates: string[];
    workingDates: string[];
}

export interface ISeance {
    time: string;
}

interface companyIdProps{
    companyId: string;
}

interface companyIdAndEmloyeeIDProps{
    companyId: string;
    employeeId: string;
}

interface companyIdAndDateProps{
    companyId: string;
    date: string;
}

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://daomiara.ru/api/v1/'}),
    endpoints: (builder) => ({
        getServices: builder.query<IServicesCategory[], companyIdProps>({
            query: ({companyId}) => `companies/${companyId}/services`
        }),
        getEmployees: builder.query<IEmployee[], companyIdProps>({
            query: ({companyId}) => `companies/${companyId}/employees`
        }),
        getEmployeeSchedule: builder.query<IEmployeeSchedule, companyIdAndEmloyeeIDProps>({
            query: ({companyId, employeeId}) => `companies/${companyId}/employees/${employeeId}/schedule`
        }),
        getComments: builder.query<IComment[], companyIdAndEmloyeeIDProps>({
            query: ({companyId, employeeId}) => `companies/${companyId}/employees/${employeeId}/comments`
        }),
        getDates: builder.query<IDates, companyIdProps>({
            query: ({companyId}) => `companies/${companyId}/dates`
        }),
        getSeances: builder.query<ISeance[], companyIdAndDateProps>({
            query: ({companyId, date}) => `companies/${companyId}/seances/${date}`
        })
    })
});
export const {useGetServicesQuery, useGetEmployeesQuery, useGetCommentsQuery, useGetEmployeeScheduleQuery, useGetDatesQuery, useLazyGetSeancesQuery} = mainApi;