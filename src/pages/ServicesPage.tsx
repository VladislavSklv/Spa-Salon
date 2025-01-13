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
import { IServiceInSlice } from '../redux/redux';

interface servicesPageProps {
    isServices: boolean;
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    companyId: string;
}

const ServicesPage:React.FC<servicesPageProps> = ({isServices, setIsServices, companyId}) => {
    const [chosenServices, setChosenServices] = useState<IServiceInSlice[]>([]);
    const [servicesTrigger, {data: servicesCategories, isLoading, isFetching, isError}] = useLazyGetServicesQuery();
    const [isOpacity, setIsOpacity] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [activeTab, setActiveTab] = useState(servicesCategories !== undefined ? servicesCategories.data[0].id : 0);
    const [isDetails, setIsDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(servicesCategories !== undefined ? servicesCategories.data[0].id : 0);
    const servicesRef = useRef<HTMLDivElement>(null);
    const servicesListRef = useRef<HTMLDivElement>(null);

    const { services, dateAndTime, employee } = useAppSelector(state => state.mainSlice);

    useEffect(() => {
        if(services.length > 0){
            setChosenServices(services);
        }
    }, [services]);

    /* Fetching services */
    useEffect(() => {
        if(dateAndTime.date !== '' && dateAndTime.time !== '' && employee.id >= 0 && chosenServices.length > 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            let serviceIds: number[] = [];
            chosenServices.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, datetime, employeeId: employee.id, serviceIds});
        } else if(dateAndTime.date !== '' && dateAndTime.time && employee.id >= 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            servicesTrigger({companyId, datetime, employeeId: employee.id});
        } else if(dateAndTime.date !== '' && dateAndTime.time && chosenServices.length > 0){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            let serviceIds: number[] = [];
            chosenServices.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, datetime, serviceIds});
        } else if(employee.id >= 0 && chosenServices.length > 0){
            let serviceIds: number[] = [];
            chosenServices.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, employeeId: employee.id, serviceIds});
        }  else if(dateAndTime.date !== '' && dateAndTime.time){
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            servicesTrigger({companyId, datetime});
        } else if(chosenServices.length > 0){
            let serviceIds: number[] = [];
            chosenServices.forEach(service => serviceIds.push(service.id));
            servicesTrigger({companyId, serviceIds});
        } else if(employee.id >= 0) servicesTrigger({companyId, employeeId: employee.id});
        else servicesTrigger({companyId});
    }, [dateAndTime, employee, chosenServices]);

    /* Disable scroll */
    useEffect(() => {
        if(isModal || isDetails) {
            if(servicesListRef.current !== null && servicesListRef.current.scrollTop === 0) servicesListRef.current.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isModal, isDetails]);

    /* Setting Telegram */

    window.Telegram.WebApp.MainButton.setParams({color: '#3F3133', text_color: '#ffffff'});
    useEffect(() => {
        if(isServices && !isDetails && chosenServices.length > 0) {
            window.Telegram.WebApp.MainButton.setText(`Продолжить ${chosenServices.length}`);
            if(chosenServices.length === 1) window.Telegram.WebApp.MainButton.enable().show();
        } else if(isServices && !isDetails) {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [chosenServices, isServices, isDetails]);

    useEffect(() => {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
    }, [chosenServices]);

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
                            <NavBar servicesListRef={servicesListRef} servicesCategories={servicesCategories.data} mainMenuRef={servicesRef} setIsModal={setIsModal} activeTab={activeTab} setIsOpacity={setIsOpacity}/>
                            <ServicesList servicesListRef={servicesListRef} chosenServices={chosenServices} setChosenServices={setChosenServices} setDetailsId={setDetailsId} setIsOpacity={setIsOpacity} setIsDetails={setIsDetails} setActiveTab={setActiveTab} servicesCategories={servicesCategories.data}/>
                            <div 
                                onClick={() => {
                                    setIsModal(false);
                                    setIsOpacity(false);
                                    setIsDetails(false);
                                }} 
                                style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                                className='opacity-block'
                            ></div>
                            <ModalNavBar servicesListRef={servicesListRef} setIsOpacity={setIsOpacity} isModal={isModal} setIsModal={setIsModal} servicesRef={servicesRef} servicesCategories={servicesCategories.data} />
                            <ServiceDetails chosenServices={chosenServices} setChosenServices={setChosenServices} companyId={companyId} setIsServices={setIsServices} isServices={isServices} detailsId={detailsId} isDetails={isDetails} servicesCategories={servicesCategories.data} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity} />
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