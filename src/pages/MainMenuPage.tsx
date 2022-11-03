import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from '../components/MainCard';
import MyButton from '../components/UI/MyButton';
import MyCheckbox from '../components/UI/MyCheckbox';
import MyInput from '../components/UI/MyInput';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { removeService, unsetEmployee } from '../redux/redux';

interface mainMenuPageProps {
    setIsServices: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSpecialist: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDate: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainMenuPage:React.FC<mainMenuPageProps> = ({setIsDate, setIsServices, setIsSpecialist}) => {
    const [comment, setComment] = useState('');
    const [isAgree, setIsAgree] = useState(false);

    const navigate = useNavigate();
    const {services, employee} = useAppSelector(state => state.mainSlice);
    const dispatch = useAppDispatch();

    /* Handlers */
    const onCheckboxClickHandler = () => {
        setIsAgree(prev => !prev);
    };

    const onMinusClickHandler = ({id}: {id: number}) => {
        dispatch(removeService(id));
    };

    return (
        <div className='menu'>
            <div className='menu__wrapper'>
                <MainCard mainItem={(employee !== undefined && employee.id > 0) ? {subtitle: employee.specialization, title: employee.name, imgSrc: employee.images ? employee.images.tiny : '../images/specialist-icon.svg'} : undefined} title='Выберите специалиста' onMinusClickHandler={() => dispatch(unsetEmployee())} onClickHandler={() => {setIsSpecialist(true); navigate('/specialists')}} imgSrc='../images/specialist-icon.svg'/>
                <div onClick={() => {setIsDate(true); navigate('/date')}} className="menu-item">
                    <div className="menu-item__img"><img src="../images/date-icon.svg" alt="date" /></div>
                    <h2 className="menu-item__title">Выберить дату и время</h2>
                </div>
                <MainCard mainItem={(services !== undefined && services.length > 0) ? {subtitle: services[services.length - 1].categoryName, title: services[services.length - 1].name} : undefined} onMinusClickHandler={() => dispatch(removeService(services[services.length - 1].id))} imgSrc="../images/services-icon.svg" title='Выберите услуги' onClickHandler={() => {setIsServices(true); navigate('/services')}}/>
            </div>
            <form>
                <MyInput placeholder='Оставить комментарий' type='text' id='comment' inputValue={comment} setInputValue={setComment}/>
                <MyCheckbox forId='agreement' id='agree-checkbox' inputName='agreement' onClickHandler={onCheckboxClickHandler}><p className='agreement'>Я принимаю <span>условия использованя</span> персональных данных*</p></MyCheckbox>
            </form>
        </div>
    );
};

export default MainMenuPage;