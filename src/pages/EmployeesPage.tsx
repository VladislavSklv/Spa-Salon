import React, { useEffect, useState } from 'react';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { useGetEmployeesQuery } from '../api/mainApi';
import Employee from '../components/Employee';
import EmployeeDetails from '../components/EmployeeDetails';
import ErrorBlock from '../components/ErrorBlock';
import Loader from '../components/Loader';
import MainCard from '../components/MainCard';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setEmployee } from '../redux/redux';

interface employeesPageProps{
    companyId: string;
}

const EmployeesPage: React.FC<employeesPageProps> = ({companyId}) => {
    const {data: employees, isLoading, isFetching, isError} = useGetEmployeesQuery({companyId});
    const [isOpacity, setIsOpacity] = useState(false);
    const [isDetails, setIsDetails] = useState(false);
    const [isAnyone, setIsAnyone] = useState(false);
    const [detailsId, setDetailsId] = useState(employees !== undefined ? employees[1].id : 0);

    const dispatch = useAppDispatch();
    const {employee} = useAppSelector(state => state.mainSlice);

    /* Checking if employye is anyone */
    useEffect(() => {
        if(!(employee.name === 'Любой свободный специалист')) setIsAnyone(false);
    }, [employee]);

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
                    <div 
                        onClick={() => {
                            dispatch(setEmployee({commentsCount:0, description: '', id: Date.now(), images:{full:'', tiny:''}, isActive: true, name: 'Любой свободный специалист', rating: 0, sort: 0, specialization: ''}));
                            setIsAnyone(true);
                        }}
                        className={isAnyone ? 'employee-card employee-card_anyone employee-card_active' : 'employee-card employee-card_anyone'}> 
                        <div className='employee-card__img employee-card__img_icon'>
                            <img src="../images/specialist-icon.svg" alt="icon" />
                        </div>
                        <div>
                            <h2 className='employee-card__name'>Любой свободный специалист</h2>
                        </div>
                    </div>
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