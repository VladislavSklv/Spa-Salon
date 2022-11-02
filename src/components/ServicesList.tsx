import React from 'react';
import { IServicesCategory } from '../api/mainApi';
import ServicesCategory from './ServicesCategory';

interface servicesListProps {
    servicesCategories: IServicesCategory[];
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
}

const ServicesList:React.FC<servicesListProps> = ({servicesCategories, setActiveTab, setIsDetails, setIsOpacity, setDetailsId}) => {
    return (
        <div className='service__list'>
            {servicesCategories.map(servicesCategory => (
                <ServicesCategory setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} key={servicesCategory.id} servicesCategory={servicesCategory} setActiveTab={setActiveTab} />
            ))}
        </div>
    );
};

export default ServicesList;