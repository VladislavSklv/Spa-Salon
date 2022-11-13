import React, { useState, useRef, useEffect } from 'react';
import { useLazyGetServicesQuery } from '../api/mainApi';
import ModalNavBar from '../components/ModalNavBar';
import NavBar from '../components/NavBar';
import ServicesList from '../components/ServicesList';
import {disablePageScroll, enablePageScroll} from 'scroll-lock';
import ServiceDetails from '../components/ServiceDetails';
import Loader from '../components/Loader';
import ErrorBlock from '../components/ErrorBlock';
import { useAppSelector } from '../hooks/hooks';

interface servicesPageProps {
    isServices: boolean;
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    companyId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({isServices, setIsServices, companyId}) => {
    const [servicesTrigger, {data: servicesCategories, isLoading, isFetching, isError}] = useLazyGetServicesQuery();
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const [isDetails, setIsDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(servicesCategories !== undefined ? servicesCategories[0].id : 0);
    const servicesRef = useRef<HTMLDivElement>(null);

    const { services, dateAndTime, employee } = useAppSelector(state => state.mainSlice);

    /* Fetching services */
    useEffect(() => {
        if(dateAndTime.date !== '' && dateAndTime.time !== '' && employee.id >= 0 && services.length > 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, datetime, employeeId: employee.id, serviceIds});
        } else if(dateAndTime.date !== '' && dateAndTime.time && employee.id >= 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            servicesTrigger({companyId, datetime, employeeId: employee.id});
        } else if(dateAndTime.date !== '' && dateAndTime.time && services.length > 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, datetime, serviceIds});
        } else if(employee.id >= 0 && services.length > 0){
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, employeeId: employee.id, serviceIds});
        }  else if(dateAndTime.date !== '' && dateAndTime.time){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            servicesTrigger({companyId, datetime});
        } else if(services.length > 0){
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, serviceIds});
        } else if(employee.id >= 0) servicesTrigger({companyId, employeeId: employee.id});
        else servicesTrigger({companyId});
    }, [dateAndTime, employee, services]);

    /* Disable scroll */
    useEffect(() => {
        if(isModal || isDetails) {
            if(window.pageYOffset === 0) window.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isModal, isDetails]);

    /* Setting Telegram */

    window.Telegram.WebApp.MainButton.setParams({color: '#3F3133', text_color: '#ffffff'});
    useEffect(() => {
        if(isServices && !isDetails && services.length > 0) {
            window.Telegram.WebApp.MainButton.setText(`Продолжить ${services.length}`);
            if(services.length === 1) window.Telegram.WebApp.MainButton.enable().show();
        } else if(isServices && !isDetails) {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [services, isServices, isDetails]);

    return (
        <>
            {
                companyId !== null
                ?
                <div className='service-page'>
                    {isError && <ErrorBlock/>}
                    {(isLoading || isFetching) && <Loader/>}
                    {servicesCategories !== undefined && 
                        <div ref={servicesRef} className='service'>
                            <NavBar servicesCategories={servicesCategories} mainMenuRef={servicesRef} setIsModal={setIsModal} activeTab={activeTab} setIsOpacity={setIsOpacity}/>
                            <ServicesList setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} setActiveTab={setActiveTab} servicesCategories={servicesCategories}/>
                            <div 
                                onClick={() => {
                                    setIsModal(false);
                                    setIsOpacity(false);
                                    setIsDetails(false);
                                }} 
                                style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                                className='opacity-block'
                            ></div>
                            <ModalNavBar setIsOpacity={setIsOpacity} isModal={isModal} setIsModal={setIsModal} servicesRef={servicesRef} servicesCategories={servicesCategories} />
                            <ServiceDetails companyId={companyId} setIsServices={setIsServices} isServices={isServices} detailsId={detailsId} isDetails={isDetails} servicesCategories={servicesCategories} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity} />
                        </div>
                    }
                </div>
                :
                <div></div>
            }
        </>
    );
};

export default ServicesPage;