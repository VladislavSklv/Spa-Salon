import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from '../components/MainCard';
import MyButton from '../components/UI/MyButton';
import MyCheckbox from '../components/UI/MyCheckbox';
import MyInput from '../components/UI/MyInput';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { removeService } from '../redux/redux';

const MainMenuPage:React.FC = () => {
    const [comment, setComment] = useState('');
    const [isAgree, setIsAgree] = useState(false);
    const [isServices, setIsServices] = useState(false);
    const [isSpecialist, setIsSpecialist] = useState(false);
    const [isDate, setIsDate] = useState(false);

    const navigate = useNavigate();
    const {services} = useAppSelector(state => state.mainSlice);
    const dispatch = useAppDispatch();

    /* Checking if there are chosen services */
    useEffect(() => {
        if(services.length > 0) setIsServices(true);
        else setIsServices(false);
    }, [services]);

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
                <div onClick={() => navigate('/specialists')} className="menu-item">
                    {false 
                        ?<>
                            <div className="menu-item__img"><img src="../images/specialist-icon.svg" alt="specialist" /></div>
                            <h2 className="menu-item__title">Выберите специалиста</h2>
                        </>
                        :<>
                            <div className="menu-item__img"><img src="../images/specialist-icon.svg" alt="specialist" /></div>
                            <h2 className="menu-item__title">Выберите специалиста</h2>
                        </>
                    }
                </div>
                <div onClick={() => navigate('/date')} className="menu-item">
                    <div className="menu-item__img"><img src="../images/date-icon.svg" alt="date" /></div>
                    <h2 className="menu-item__title">Выберить дату и время</h2>
                </div>
                <MainCard array={services} isArray={isServices} onClickHandler={() => navigate('/services')}/>
            </div>
            <form>
                <MyInput placeholder='Оставить комментарий' type='text' id='comment' inputValue={comment} setInputValue={setComment}/>
                <MyCheckbox forId='agreement' id='agree-checkbox' inputName='agreement' onClickHandler={onCheckboxClickHandler}><p className='agreement'>Я принимаю <span>условия использованя</span> персональных данных*</p></MyCheckbox>
            </form>
        </div>
    );
};

export default MainMenuPage;