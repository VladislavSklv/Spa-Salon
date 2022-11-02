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

interface mainApiProps{
    companiesId: string;
}

export const mainApi = createApi({
    reducerPath: 'mainApi',
    baseQuery: fetchBaseQuery({baseUrl: 'https://daomiara.ru/api/v1/'}),
    endpoints: (builder) => ({
        getServices: builder.query<IServicesCategory[], mainApiProps>({
            query: ({companiesId}) => `companies/${companiesId}/services`
        })
    })
});
export const {useGetServicesQuery} = mainApi;