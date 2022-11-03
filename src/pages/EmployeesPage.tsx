import React, { useEffect, useState } from 'react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { useGetEmployeesQuery } from '../api/mainApi';
import Employee from '../components/Employee';
import EmployeeDetails from '../components/EmployeeDetails';
import ErrorBlock from '../components/ErrorBlock';
import Loader from '../components/Loader';
import MainCard from '../components/MainCard';

interface employeesPageProps{
    companyId: string;
}

const EmployeesPage: React.FC<employeesPageProps> = ({companyId}) => {
    const {data: employees, isLoading, isFetching, isError} = useGetEmployeesQuery({companyId});
    const [isOpacity, setIsOpacity] = useState(false);
    const [isDetails, setIsDetails] = useState(false);
    const [detailsId, setDetailsId] = useState(employees !== undefined ? employees[1].id : 0);

    /* Disable scroll */
    useEffect(() => {
        if(isDetails) {
            if(window.pageYOffset === 0) window.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isDetails]);

    return (
        <>
            {isError && <ErrorBlock/>}
            {(isLoading || isFetching) && <Loader/>}
            {employees !== undefined &&
                <div className='employees__wrapper'>
                    <MainCard onMinusClickHandler={() => 1} mainItem={undefined} imgSrc="../images/specialist-icon.svg" title='Любой свободный специалист' onClickHandler={() => console.log('Anyone')}/>
                    {employees.map(employee => (
                        <Employee setDetailsId={setDetailsId} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity} key={employee.id} employee={employee} companyId={companyId}/>
                    ))}
                    <div 
                        onClick={() => {
                            setIsOpacity(false);
                            setIsDetails(false);
                        }} 
                        style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                        className='opacity-block'
                    ></div>
                    <EmployeeDetails companyId={companyId} detailsId={detailsId} employees={employees} isDetails={isDetails} setIsDetails={setIsDetails} setIsOpacity={setIsOpacity}/>
                </div>
            }
        </>
    );
};

export default EmployeesPage;