import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DateAndTimePage from './pages/DateAndTimePage';
import MainMenuPage from './pages/MainMenuPage';
import ServicesPage from './pages/ServicesPage';
import SpecialistsPage from './pages/SpecialistsPage';

function App() {
	const companiesId = 'dafa1b03-788e-4333-b566-10c43c16f6f3';
	return (
		<Routes>
			<Route path='/' element={<MainMenuPage />}/>
			<Route path='/services' element={<ServicesPage companiesId={companiesId}/>}/>
			<Route path='/specialists' element={<SpecialistsPage/>}/>
			<Route path='/date' element={<DateAndTimePage/>}/>
		</Routes>
	);
}

export default App;
