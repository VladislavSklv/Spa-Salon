import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainCard from '../components/MainCard';
import MainMenuServiceItem from '../components/MainMenuServiceItem';
import MyCheckbox from '../components/UI/MyCheckbox';
import MyInput from '../components/UI/MyInput';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { unsetDateAndTime, unsetEmployee } from '../redux/redux';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

interface mainMenuPageProps {
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    isServices: boolean;
    setIsEmployee: React.Dispatch<React.SetStateAction<boolean>>;
    isEmployee: boolean;
    isDate: boolean;
    setIsDate: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainMenuPage:React.FC<mainMenuPageProps> = ({setIsDate, setIsServices, setIsEmployee, isDate, isServices, isEmployee}) => {
    const [comment, setComment] = useState('');
    const [isAgree, setIsAgree] = useState(false);
    /* Getting Get param */
    const [searchParams, setSearchParams] = useSearchParams();
	const companyId = searchParams.get('companyId');
    const [totalPrice, setTotalPrice] = useState('');
    const [totalTime, setTotalTime] = useState('');

    const navigate = useNavigate();
    const {services, employee, dateAndTime} = useAppSelector(state => state.mainSlice);
    const dispatch = useAppDispatch();

    /* Counting total services price and time */
    useEffect(() => {
        if(services.length > 0){
            let total = '';
            let from = false;
            let priceMax = 0;
            let priceMin = 0;
            let time = 0;
            services.forEach(service => {
                if(service.length !== undefined) time += service.length;
                priceMax += service.priceMax;
                priceMin += service.priceMin;
                if((service.priceMin === undefined && service.priceMax === undefined) || (service.priceMin === 0 && service.priceMax === 0)) from = true;
            })
            total = ((priceMin !== undefined && priceMax !== undefined) && (priceMin !== 0 && priceMax !== 0))
            ? (priceMax === priceMin ? (priceMax.toLocaleString() + ' so’m') : (priceMax > priceMin ? `${priceMin.toLocaleString()} - ${priceMax.toLocaleString()} so’m` : priceMin.toLocaleString() + ' so’m'))
            : '';
            if(from){
                if(priceMin > 0) total = `от ${priceMin} so’m`;
                else total = '';
            }
            setTotalPrice(total);
            /* Converting service time */
            if(time !== 0){
                let fullLength = '';
                let minutes = 0;
                let hours = 0;
                if(time < 60) fullLength = `${time} сек.`
                    else if(time >= 60) {
                        minutes = Math.round(time / 60);
                        fullLength = `${minutes} мин.`
                        if(minutes >= 60){
                            if(minutes % 60 === 0){
                                let hoursStr = 'час';
                                hours = minutes / 60;
                                if(hours % 10 > 1 && hours % 10 < 5) hoursStr = 'часа';
                                else if(hours % 10 > 4 && hours % 10 <= 9 && hours % 10 === 0) hoursStr = 'часов';
                                fullLength = `${hours} ${hoursStr}`;
                            } else {
                                let hoursStr = 'час';
                                hours = Math.floor(minutes / 60);
                                let lastedMinutes = minutes - hours * 60;
                                if(hours % 10 > 1 && hours % 10 < 5) hoursStr = 'часа';
                                else if((hours % 10 > 4 && hours % 10 <= 9) || hours % 10 === 0) hoursStr = 'часов';
                                fullLength = `${hours} ${hoursStr} ${lastedMinutes} мин.`;
                            } 
                        }
                    }
                setTotalTime(fullLength);
            } else {
                setTotalTime('');
            }
                
        }
    }, [services]);

    /* Handlers */
    const onCheckboxClickHandler = () => {
        setIsAgree(prev => !prev);
    };

    /* Setting Telegram */
    const onMainBtnClick = () => {
        if(!isDate && !isEmployee && !isServices && isAgree){
            window.Telegram.WebApp.showPopup({message: 'Спасибо за заказ!'});
        }
    } 

    window.Telegram.WebApp.MainButton.disable().hide();
    window.Telegram.WebApp.MainButton.setParams({text: 'Отправить', color: '#3F3133', text_color: '#ffffff'});

    useEffect(() => {
        window.Telegram.WebApp.onEvent('mainButtonClicked', onMainBtnClick);
        return () => {
            window.Telegram.WebApp.offEvent('mainButtonClicked', onMainBtnClick);
        };
    }, [onMainBtnClick, isDate, isEmployee, isServices, isAgree]);

    useEffect(() => {
        if(!isDate && !isEmployee && !isServices){
            if(isAgree && employee.id >= 0 && services.length > 0 && dateAndTime.date !== '' && dateAndTime.time !== ''){
                window.Telegram.WebApp.MainButton.enable().show();
            } else {
                window.Telegram.WebApp.MainButton.disable().hide();
            }
        }
    }, [services, employee, dateAndTime, isAgree]);

    useEffect(() => {
		window.Telegram.WebApp.HapticFeedback.selectionChanged();
	}, [isAgree]);

    return (
        <div className='menu'>
            <div className='menu__wrapper'>
                <MainCard 
                    mainItem={(employee !== undefined && employee.id >= 0) ? {subtitle: employee.specialization, title: employee.name, imgSrc: (employee.images && employee.images.tiny.length > 0) ? employee.images.tiny : '../images/specialist-icon.svg'} : undefined} 
                    onClickHandler={() => {
                        setIsEmployee(true); 
                        if(companyId === null) navigate('/specialists');
                        else navigate(`/specialists/?companyId=${companyId}`);
                    }} 
                    onMinusClickHandler={() => dispatch(unsetEmployee())} 
                    title='Выберите специалиста' 
                    imgSrc='../images/specialist-icon.svg'
                    ifImgFull={(employee.images !== undefined && employee.images.tiny.length > 0) ? true : false} 
                    commentsCount={employee.commentsCount}
                    rating={employee.rating}
                />
                <MainCard 
                    mainItem={(dateAndTime.date !== '' && dateAndTime.time !== '') ? {subtitle: new Date(dateAndTime.date).toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'}), title: dateAndTime.time} : undefined}
                    onClickHandler={() => {
                        setIsDate(true); 
                        if(companyId === null) navigate('/date');
                        else navigate(`/date/?companyId=${companyId}`);
                    }} 
                    onMinusClickHandler={() => dispatch(unsetDateAndTime())} 
                    title='Выберите дату и время' 
                    imgSrc='../images/date-icon.svg' 
                    
                />
                <div className="menu-item menu-item_services">
                    <div 
                        onClick={() => {
                            setIsServices(true); 
                            if(companyId === null) navigate('/services');
                            else navigate(`/services/?companyId=${companyId}`);
                        }} 
                        className='menu-item__top'
                    >
                        <div className="menu-item__img" >
                            <img src='../images/services-icon.svg' alt="services-icon" />
                        </div>
                        <div style={services.length > 0 ? {justifyContent: 'center'} : {}} className='menu-item__content'>
                            {services.length > 0 
                                ?
                                <>
                                    <p className='menu-item__category'>Услуги</p>
                                    {totalPrice !== '' && <h2 className="menu-item__title">{totalPrice}{totalTime !== '' && <span><img src='../images/time.svg' alt='time'/> {totalTime}</span>}</h2>}
                                </>
                                :
                                <>
                                    <p className='menu-item__title'>Выберите услуги</p>
                                </>
                            }
                        </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="menu-item__wrapper">
                        <TransitionGroup>
                            {services.map(service => (
                                <CSSTransition
                                    key={service.id}
                                    timeout={500}
                                    classNames="menu-service-transition"
                                >
                                    <MainMenuServiceItem service={service}/>
                                </CSSTransition>
                            ))}
                            </TransitionGroup>
                    </div>
                </div>
            </div>
            <form>
                <MyInput placeholder='Оставить комментарий' type='text' id='comment' inputValue={comment} setInputValue={setComment}/>
                <MyCheckbox forId='agreement' id='agree-checkbox' inputName='agreement' onClickHandler={onCheckboxClickHandler}><p className='agreement'>Я принимаю <span>условия использованя</span> персональных данных*</p></MyCheckbox>
            </form>
        </div>
    );
};

export default MainMenuPage;