import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from '../components/MainCard';
import MyButton from '../components/UI/MyButton';
import MyCheckbox from '../components/UI/MyCheckbox';
import MyInput from '../components/UI/MyInput';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { removeService, unsetDateAndTime, unsetEmployee } from '../redux/redux';

interface mainMenuPageProps {
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSpecialist: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDate: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainMenuPage:React.FC<mainMenuPageProps> = ({setIsDate, setIsServices, setIsSpecialist}) => {
    const [comment, setComment] = useState('');
    const [isAgree, setIsAgree] = useState(false);

    const navigate = useNavigate();
    const {services, employee, dateAndTime} = useAppSelector(state => state.mainSlice);
    const dispatch = useAppDispatch();

    /* Handlers */
    const onCheckboxClickHandler = () => {
        setIsAgree(prev => !prev);
    };

    return (
        <div className='menu'>
            <div className='menu__wrapper'>
                <MainCard 
                    mainItem={(employee !== undefined && employee.id > 0) ? {subtitle: employee.specialization, title: employee.name, imgSrc: (employee.images && employee.images.tiny.length > 0) ? employee.images.tiny : '../images/specialist-icon.svg'} : undefined} 
                    onClickHandler={() => {setIsSpecialist(true); navigate('/specialists')}} 
                    onMinusClickHandler={() => dispatch(unsetEmployee())} 
                    title='Выберите специалиста' 
                    imgSrc='../images/specialist-icon.svg'
                    ifImgFull={employee.images.tiny.length > 0 ? true : false} 
                />
                <MainCard 
                    mainItem={(dateAndTime.date !== '' && dateAndTime.time !== '') ? {subtitle: new Date(dateAndTime.date).toLocaleDateString('ru-RU', {weekday: 'long', day: 'numeric', month: 'long'}), title: dateAndTime.time} : undefined}
                    onClickHandler={() => {setIsDate(true); navigate('/date')}} 
                    onMinusClickHandler={() => dispatch(unsetDateAndTime())} 
                    title='Выберить дату и время' 
                    imgSrc='../images/date-icon.svg' 
                    
                />
                <MainCard 
                    mainItem={(services !== undefined && services.length > 0) ? {subtitle: services[services.length - 1].categoryName, title: services[services.length - 1].name} : undefined} 
                    onClickHandler={() => {setIsServices(true); navigate('/services')}}
                    onMinusClickHandler={() => dispatch(removeService(services[services.length - 1].id))} 
                    title='Выберите услуги' 
                    imgSrc="../images/services-icon.svg" 
                />
            </div>
            <form>
                <MyInput placeholder='Оставить комментарий' type='text' id='comment' inputValue={comment} setInputValue={setComment}/>
                <MyCheckbox forId='agreement' id='agree-checkbox' inputName='agreement' onClickHandler={onCheckboxClickHandler}><p className='agreement'>Я принимаю <span>условия использованя</span> персональных данных*</p></MyCheckbox>
            </form>
        </div>
    );
};

export default MainMenuPage;