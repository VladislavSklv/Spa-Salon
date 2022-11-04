import React from 'react';
import ReactDOM from 'react-dom/client';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { mainApi } from './api/mainApi';
import mainSlice from './redux/redux';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

const rootReducer = combineReducers({
	[mainApi.reducerPath]: mainApi.reducer,
	mainSlice: mainSlice
})

const store = configureStore({reducer: rootReducer})

root.render(
	<BrowserRouter>
		<Provider store={store}>
			<App />
		</Provider>
	</BrowserRouter>
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;