import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DateAndTimePage from './pages/DateAndTimePage';
import MainMenuPage from './pages/MainMenuPage';
import ServicesPage from './pages/ServicesPage';
import EmployeesPage from './pages/EmployeesPage';
import { useAppSelector } from './hooks/hooks';

function App() {
	const [isServices, setIsServices] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [isDate, setIsDate] = useState(false);

	const companyId = 'dafa1b03-788e-4333-b566-10c43c16f6f3';
	const { dateAndTime, employee, services } = useAppSelector(state => state.mainSlice);
	const navigate = useNavigate();

	/* Setting Telegram */
	window.Telegram.WebApp.enableClosingConfirmation();
	window.Telegram.WebApp.expand();

	useEffect(() => {
		if(isServices || isEmployee || isDate){
			window.Telegram.WebApp.BackButton.show();
		} else {
			window.Telegram.WebApp.BackButton.hide();
		}
		window.Telegram.WebApp.BackButton.onClick(() => {
			if(isServices || isEmployee || isDate) {
				navigate('/');
			}
		});
		return () => {
			window.Telegram.WebApp.BackButton.onClick(() => {
				if(isServices || isEmployee || isDate) {
					navigate('/');
					setIsServices(false);
					setIsEmployee(false);
					setIsDate(false);
				}
			});
		}
	}, [isServices, isEmployee, isDate]);

	useEffect(() => {
		window.Telegram.WebApp.HapticFeedback.selectionChanged();
	}, [dateAndTime, employee, services]);
	
	return (
		<Routes>
			<Route path='/' element={<MainMenuPage isDate={isDate} isServices={isServices} isEmployee={isEmployee} setIsDate={setIsDate} setIsServices={setIsServices} setIsEmployee={setIsEmployee} />}/>
			<Route path='/services' element={<ServicesPage setIsServices={setIsServices} isServices={isServices} companyId={companyId}/>}/>
			<Route path='/specialists' element={<EmployeesPage setIsEmployee={setIsEmployee} isEmployee={isEmployee} companyId={companyId}/>}/>
			<Route path='/date' element={<DateAndTimePage setIsDate={setIsDate} isDate={isDate} companyId={companyId}/>}/>
		</Routes>
	);
}

export default App;
