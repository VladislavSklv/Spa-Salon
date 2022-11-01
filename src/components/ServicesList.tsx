import React from 'react';
import { IServicesCategory } from '../api/mainApi';
import ServicesCategory from './ServicesCategory';

interface servicesListProps {
    servicesCategories: IServicesCategory[];
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const ServicesList:React.FC<servicesListProps> = ({servicesCategories, setActiveTab}) => {
    return (
        <div className='service__list'>
            {servicesCategories.map(servicesCategory => (
                <ServicesCategory key={servicesCategory.id} servicesCategory={servicesCategory} setActiveTab={setActiveTab} />
            ))}
        </div>
    );
};

export default ServicesList;