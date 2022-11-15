import React, { useRef } from 'react';
import { IServicesCategory } from '../api/mainApi';
import { IServiceInSlice } from '../redux/redux';
import ServicesCategory from './ServicesCategory';

interface servicesListProps {
    chosenServices: IServiceInSlice[];
    setChosenServices: React.Dispatch<React.SetStateAction<IServiceInSlice[]>>;
    servicesCategories: IServicesCategory[];
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
    servicesListRef: React.RefObject<HTMLDivElement>;
}

const ServicesList:React.FC<servicesListProps> = ({servicesCategories, setActiveTab, setIsDetails, setIsOpacity, setDetailsId, chosenServices, setChosenServices, servicesListRef}) => {
    return (
        <div ref={servicesListRef} className='service__list'>
            {servicesCategories.map(servicesCategory => (
                <ServicesCategory chosenServices={chosenServices} setChosenServices={setChosenServices} servicesListRef={servicesListRef} setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} key={servicesCategory.id} servicesCategory={servicesCategory} setActiveTab={setActiveTab} />
            ))}
        </div>
    );
};

export default ServicesList;