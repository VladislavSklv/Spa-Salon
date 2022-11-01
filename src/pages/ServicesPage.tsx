import React, { useState, useRef, useEffect } from 'react';
import { useGetServicesQuery } from '../api/mainApi';
import NavBar from '../components/NavBar';
import ServicesList from '../components/ServicesList';

interface servicesPageProps {
    companiesId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({companiesId}) => {
    const {data: servicesCategories, isLoading, isError} = useGetServicesQuery({companiesId});
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const servicesRef = useRef<HTMLDivElement>(null);

    /* console.log(servicesCategories)

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                console.log('yee');
            }
        })
    }, {
        threshold: 0.7,
    });

    useEffect(() => {
        if(servicesRef.current !== null && servicesRef.current !== undefined) {
            servicesRef.current.childNodes[1].childNodes.forEach((div: any) => {
                observer.observe(div);
            });
        }
    }, [servicesCategories]); */

    return (
        <>
            {servicesCategories !== undefined && 
                <div ref={servicesRef} className='service'>
                    <NavBar servicesCategories={servicesCategories} mainMenuRef={servicesRef} setIsModal={setIsModal} activeTab={activeTab} setIsOpacity={setIsOpacity}/>
                    <ServicesList setActiveTab={setActiveTab} servicesCategories={servicesCategories}/>
                </div>
            }
        </>
    );
};

export default ServicesPage;