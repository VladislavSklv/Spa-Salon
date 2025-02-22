import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import DateAndTimePage from './pages/DateAndTimePage';
import MainMenuPage from './pages/MainMenuPage';
import ServicesPage from './pages/ServicesPage';
import EmployeesPage from './pages/EmployeesPage';
import { useAppSelector } from './hooks/hooks';

function App() {
	const [isServices, setIsServices] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isDate, setIsDate] = useState(false);
	const [datesFirstOpened, setDatesFirstOpened] = useState(true);
	const [initialMonth, setInitialMonth] = useState('');

	const [searchParams, setSearchParams] = useSearchParams();
	const companyId = searchParams.get('companyId');
	/* ?companyId=deb15d4d-1b1a-4730-9982-79df9fe431b5 */
	if(companyId === null) console.error('required parameter companyId was not passed');
	const { dateAndTime, employee, services } = useAppSelector(state => state.mainSlice);
	const navigate = useNavigate();

	useEffect(() => {
		if(dateAndTime.date !== '' && dateAndTime.time !== ''){
			setInitialMonth(new Date(dateAndTime.date).toLocaleString('ru-RU', {month: 'long'}));
		} else {
			setInitialMonth('');
		}
	}, [dateAndTime]);

	/* Setting Telegram */
	window.Telegram.WebApp.enableClosingConfirmation();
	window.Telegram.WebApp.expand();

	const backBtnClick = () => {
		if(isServices || isEmployee || isDate) {
			if(companyId !== null) navigate(`/?companyId=${companyId}`);
			else navigate('/');
			setIsServices(false);
			setIsEmployee(false);
			setIsDate(false);
		}
	};

	useEffect(() => {
		if(isServices || isEmployee || isDate){
			window.Telegram.WebApp.BackButton.show();
		} else {
			window.Telegram.WebApp.BackButton.hide();
		}
		window.Telegram.WebApp.BackButton.onClick(backBtnClick);
		return () => {
			window.Telegram.WebApp.BackButton.offClick(backBtnClick);
		}
	}, [isServices, isEmployee, isDate]);

	useEffect(() => {
		window.Telegram.WebApp.HapticFeedback.selectionChanged();
	}, [dateAndTime, employee, services]);
	
	return (
		<>
			{companyId !== null 
				?
				<Routes>
					<Route path='/' element={<MainMenuPage isDate={isDate} isServices={isServices} isEmployee={isEmployee} setIsDate={setIsDate} setIsServices={setIsServices} setIsEmployee={setIsEmployee} />}/>
					<Route path={`/services`} element={<ServicesPage setIsServices={setIsServices} isServices={isServices} companyId={companyId}/>}/>
					<Route path={`/specialists`} element={<EmployeesPage setIsEmployee={setIsEmployee} isEmployee={isEmployee} companyId={companyId}/>}/>
					<Route path={`/date`} element={<DateAndTimePage initialMonth={initialMonth} firstOpened={datesFirstOpened} setFirstOpened={setDatesFirstOpened} setIsDate={setIsDate} isDate={isDate} companyId={companyId}/>}/>
				</Routes>
				:
				<div></div>
			}
		</>
	);
}

export default App;
