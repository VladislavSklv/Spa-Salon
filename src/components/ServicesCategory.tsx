import React from 'react';
import { useInView } from 'react-intersection-observer';
import { IServicesCategory } from '../api/mainApi';
import { IServiceInSlice } from '../redux/redux';
import Service from './Service';

interface servicesCategoryProps {
    chosenServices: IServiceInSlice[];
    setChosenServices: React.Dispatch<React.SetStateAction<IServiceInSlice[]>>;
    servicesCategory: IServicesCategory;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
    setIsDetails: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    setDetailsId: React.Dispatch<React.SetStateAction<number>>;
    servicesListRef: React.RefObject<HTMLDivElement>;
}


const ServicesCategory: React.FC<servicesCategoryProps> = ({servicesCategory, setActiveTab, setIsDetails, setIsOpacity, setDetailsId, servicesListRef, chosenServices, setChosenServices}) => {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0.3,
        onChange(inView) {
            if(inView) setActiveTab(servicesCategory.id);
        },
    });

    return (
        <div ref={ref} id={servicesCategory.id.toString()} key={servicesCategory.id} className='service__group'>
            <h2 className='subtitle'>{servicesCategory.name}</h2>
            {servicesCategory.services.map(service => (
                <Service chosenServices={chosenServices} setChosenServices={setChosenServices} categoryName={servicesCategory.name} setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} key={service.id} service={service}/>
            ))}
        </div>
    );
};

export default ServicesCategory;