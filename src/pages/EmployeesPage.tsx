import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { IEmployee, useLazyGetEmployeesQuery } from '../api/mainApi';
import Employee from '../components/Employee';
import EmployeeDetails from '../components/EmployeeDetails';
import ErrorBlock from '../components/ErrorBlock';
import Loader from '../components/Loader';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setEmployee } from '../redux/redux';

interface employeesPageProps{
    companyId: string;
    isEmployee: boolean;
    setIsEmployee: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmployeesPage: React.FC<employeesPageProps> = ({companyId, isEmployee, setIsEmployee}) => {
    const [chosenEmployee, setChosenEmployee] = useState<IEmployee>({commentsCount: 0, description: '', id: -1, images: {tiny: '', full: '',}, isActive: false, name: '', rating: 0, sort: 0, specialization: ''});
    const [employeesTrigger, {data: employees, isLoading, isFetching, isError}] = useLazyGetEmployeesQuery();
    const [isOpacity, setIsOpacity] = useState(false);
    const [isEmployeeDetails, setIsEmployeeDetails] = useState(false);
    const [isAnyone, setIsAnyone] = useState(false);
    const [detailsId, setDetailsId] = useState(0);

    const dispatch = useAppDispatch();
    const {employee, dateAndTime, services} = useAppSelector(state => state.mainSlice);
    const navigate = useNavigate();

    useEffect(() => {
        if(employee.id >= 0){
            setChosenEmployee(employee);
        }
    }, [employee]);

    /* Fetching employees */
    useEffect(() => {
        if(dateAndTime.date !== '' && dateAndTime.time !== '' && services.length > 0) {
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            employeesTrigger({companyId, serviceIds, datetime});
        } else if(services.length > 0){
            let serviceIds: number[] = [];
            services.forEach(service => serviceIds.push(service.id));
            employeesTrigger({companyId, serviceIds});
        } else if(dateAndTime.date !== '' && dateAndTime.time !== '') {
            let datetime = `${dateAndTime.date}T${dateAndTime.time}`;
            employeesTrigger({companyId, datetime});
        } else employeesTrigger({companyId});
    }, [dateAndTime, services]);

    /* Checking if employye is anyone */
    useEffect(() => {
        if(chosenEmployee.id === 0) setIsAnyone(true);
        else setIsAnyone(false);
    }, [chosenEmployee]);

    /* Disable scroll */
    useEffect(() => {
        if(isEmployeeDetails) {
            if(window.pageYOffset === 0) window.scrollBy(0, 1);
            disablePageScroll(document.body);
        } else {
            enablePageScroll(document.body);
        }
    }, [isEmployeeDetails]);

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(isEmployee && !isEmployeeDetails) {
            dispatch(setEmployee(chosenEmployee));
            setIsEmployee(false);
            navigate(`/?companyId=${companyId}`);
        }
    };

    useEffect(() => {
        window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
        return () => {
            window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
        }
    }, [onMainBtnClick, isEmployee, isEmployeeDetails]);
    
    window.Telegram.WebApp.MainButton.setParams({color: '#3F3133', text_color: '#ffffff'});
    useEffect(() => {
        if(isEmployee && !isEmployeeDetails && chosenEmployee.id >= 0) {
            window.Telegram.WebApp.MainButton.setText(`Продолжить`);
            window.Telegram.WebApp.MainButton.enable().show();
        } else if(isEmployee && !isEmployeeDetails) {
            window.Telegram.WebApp.MainButton.disable().hide();
        }
    }, [chosenEmployee, isEmployeeDetails, isEmployee]);

    return (
        <>
            {companyId !== null
            ?
                <>
                    {isError && <ErrorBlock/>}
                    {(isLoading || isFetching) && <Loader/>}
                    {employees !== undefined &&
                        <div className='employees-page'>
                            <div className='employees__wrapper'>
                                <div 
                                    onClick={() => {
                                        setChosenEmployee({commentsCount:0, description: '', id: 0, images:{full:'', tiny:''}, isActive: true, name: 'Любой свободный специалист', rating: 0, sort: 0, specialization: ''});
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
                                    <Employee chosenEmployee={chosenEmployee} setChosenEmployee={setChosenEmployee} setDetailsId={setDetailsId} setIsDetails={setIsEmployeeDetails} setIsOpacity={setIsOpacity} key={employee.id} employee={employee} companyId={companyId}/>
                                ))}
                            </div>
                            <div 
                                onClick={() => {
                                    setIsOpacity(false);
                                    setIsEmployeeDetails(false);
                                }} 
                                style={isOpacity ? {opacity: 1, pointerEvents: 'all'} : {opacity: 0, pointerEvents: 'none'}} 
                                className='opacity-block'
                            ></div>
                            <EmployeeDetails setChosenEmployee={setChosenEmployee} isEmployee={isEmployee} companyId={companyId} detailsId={detailsId} employees={employees} isEmployeeDetails={isEmployeeDetails} setIsEmployeeDetails={setIsEmployeeDetails} setIsOpacity={setIsOpacity}/>
                        </div>
                    }
                </>
            : <div></div>
            }
        </>
    );
};

export default EmployeesPage;