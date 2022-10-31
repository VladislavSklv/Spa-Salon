import React from 'react';
import { useGetServicesQuery } from '../api/mainApi';

interface servicesPageProps {
    companiesId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({companiesId}) => {
    const {data: services, isLoading, isError} = useGetServicesQuery({companiesId});
    return (
        <div>
            Услуги
        </div>
    );
};

export default ServicesPage;