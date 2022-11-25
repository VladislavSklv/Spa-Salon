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
    video?: string;
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
    serviceIds?: number[];
    employeeId?: number;
    datetime?: string;
}

interface companyIdAndEmloyeeIDProps{
    companyId: string;
    employeeId: string;
    serviceIds?: number[];
}

interface companyIdAndDateProps{
    companyId: string;
    date: string;
    serviceIds?: number[];
    employeeId?: number;
}

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://daomiara.ru/api/v1/'}),
    endpoints: (builder) => ({
        getServices: builder.query<IServicesCategory[], companyIdProps>({
            query: ({companyId, datetime, employeeId, serviceIds}) => {
                let params = '';
                if(employeeId !== undefined) params = `/?employeeId=${employeeId}`;
                if(datetime !== undefined) {
                    if(params === '') params = `/?datetime=${datetime}`;
                    else params += `&datetime=${datetime}`;
                };
                if(serviceIds !== undefined){
                    serviceIds.forEach(serviceId => {
                        if(params === '') params = `/?serviceIds[]=${serviceId}`;
                        else params += `&serviceIds[]=${serviceId}`;
                    });
                }
                return `companies/${companyId}/services${params}`;
            }
        }),
        getEmployees: builder.query<IEmployee[], companyIdProps>({
            query: ({companyId, datetime, serviceIds}) => {
                let params = '';
                if(datetime !== undefined) params = `/?datetime=${datetime}`;
                if(serviceIds !== undefined){
                    serviceIds.forEach(serviceId => {
                        if(params === '') params = `/?serviceIds[]=${serviceId}`;
                        else params += `&serviceIds[]=${serviceId}`;
                    });
                }
                return `companies/${companyId}/employees${params}`;
            }
        }),
        getEmployeeSchedule: builder.query<IEmployeeSchedule, companyIdAndEmloyeeIDProps>({
            query: ({companyId, employeeId, serviceIds}) => {
                let params = '';
                if(serviceIds !== undefined){
                    serviceIds.forEach(serviceId => {
                        if(params === '') params = `/?serviceIds[]=${serviceId}`;
                        else params += `&serviceIds[]=${serviceId}`;
                    });
                }
                return `companies/${companyId}/employees/${employeeId}/schedule${params}`
            }
        }),
        getComments: builder.query<IComment[], companyIdAndEmloyeeIDProps>({
            query: ({companyId, employeeId}) => `companies/${companyId}/employees/${employeeId}/comments`
        }),
        getDates: builder.query<IDates, companyIdProps>({
            query: ({companyId, employeeId, serviceIds}) => {
                let params = '';
                if(employeeId !== undefined) params = `/?employeeId=${employeeId}`
                if(serviceIds !== undefined){
                    serviceIds.forEach(serviceId => {
                        if(params === '') params = `/?serviceIds[]=${serviceId}`;
                        else params += `&serviceIds[]=${serviceId}`;
                    });
                }
                return `companies/${companyId}/dates${params}`;
            }
        }),
        getSeances: builder.query<ISeance[], companyIdAndDateProps>({
            query: ({companyId, date, employeeId, serviceIds}) => {
                let params = '';
                if(employeeId !== undefined) params = `/?employeeId=${employeeId}`
                if(serviceIds !== undefined){
                    serviceIds.forEach(serviceId => {
                        if(params === '') params = `/?serviceIds[]=${serviceId}`;
                        else params += `&serviceIds[]=${serviceId}`;
                    });
                }
                return `companies/${companyId}/seances/${date}${params}`
            }
        })
    })
});
export const {useLazyGetEmployeesQuery, useGetCommentsQuery, useLazyGetSeancesQuery, useLazyGetCommentsQuery, useLazyGetServicesQuery, useLazyGetDatesQuery, useLazyGetEmployeeScheduleQuery} = mainApi;