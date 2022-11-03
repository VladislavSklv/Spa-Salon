import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DateAndTimePage from './pages/DateAndTimePage';
import MainMenuPage from './pages/MainMenuPage';
import ServicesPage from './pages/ServicesPage';
import EmployeesPage from './pages/EmployeesPage';

function App() {
	const [isServices, setIsServices] = useState(false);
    const [isSpecialist, setIsSpecialist] = useState(false);
    const [isDate, setIsDate] = useState(false);

	const companyId = 'dafa1b03-788e-4333-b566-10c43c16f6f3';
	
	return (
		<Routes>
			<Route path='/' element={<MainMenuPage setIsDate={setIsDate} setIsServices={setIsServices} setIsSpecialist={setIsSpecialist} />}/>
			<Route path='/services' element={<ServicesPage companyId={companyId}/>}/>
			<Route path='/specialists' element={<EmployeesPage companyId={companyId}/>}/>
			<Route path='/date' element={<DateAndTimePage/>}/>
		</Routes>
	);
}

export default App;
