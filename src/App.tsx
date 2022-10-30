import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DateAndTimePage from './pages/DateAndTimePage';
import MainMenuPage from './pages/MainMenuPage';
import ServicesPage from './pages/ServicesPage';
import SpecialistsPage from './pages/SpecialistsPage';

function App() {
	return (
		<Routes>
			<Route path='/' element={<MainMenuPage />}/>
			<Route path='/services' element={<ServicesPage/>}/>
			<Route path='/specialists' element={<SpecialistsPage/>}/>
			<Route path='/date' element={<DateAndTimePage/>}/>
		</Routes>
	);
}

export default App;
