import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { IServicesCategory } from '../api/mainApi';
import Service from './Service';

interface servicesCategoryProps {
    servicesCategory: IServicesCategory;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const ServicesCategory: React.FC<servicesCategoryProps> = ({servicesCategory, setActiveTab}) => {
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0.1,
    });

    useEffect(() => {
        if(inView) setActiveTab(servicesCategory.id);
    }, [inView]);

    return (
        <div ref={ref} id={servicesCategory.id.toString()} key={servicesCategory.id} className='service__group'>
            <h2 className='subtitle'>{servicesCategory.name}</h2>
            {servicesCategory.services.map(service => (
                <Service key={service.id} service={service}/>
            ))}
        </div>
    );
};

export default ServicesCategory;