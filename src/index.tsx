import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { mainApi } from './api/mainApi';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const rootReducer = combineReducers({
	[mainApi.reducerPath]: mainApi.reducer
})

const store = configureStore({reducer: rootReducer})

root.render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);