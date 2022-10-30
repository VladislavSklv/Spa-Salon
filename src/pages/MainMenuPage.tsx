import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCheckbox from '../components/UI/MyCheckbox';
import MyInput from '../components/UI/MyInput';

const MainMenuPage:React.FC = () => {
    const [comment, setComment] = useState('');
    const [isAgree, setIsAgree] = useState(false);

    const navigate = useNavigate();

    /* Handlers */
    const onClickHandler = () => {
        setIsAgree(prev => !prev);
    }

    return (
        <div className='menu'>
            <div className='menu__wrapper'>
                <div onClick={() => navigate('/specialists')} className="menu-item">
                    <div className="menu-item__img"><img src="../images/specialist-icon.svg" alt="specialist" /></div>
                    <h2 className="menu-item__title">Выберите специалиста</h2>
                </div>
                <div onClick={() => navigate('/date')} className="menu-item">
                    <div className="menu-item__img"><img src="../images/date-icon.svg" alt="date" /></div>
                    <h2 className="menu-item__title">Выберить дату и время</h2>
                </div>
                <div onClick={() => navigate('/services')} className="menu-item">
                    <div className="menu-item__img"><img src="../images/services-icon.svg" alt="services" /></div>
                    <h2 className="menu-item__title">Выберите услуги</h2>
                </div>
            </div>
            <form>
                <MyInput placeholder='Оставить комментарий' type='text' id='comment' inputValue={comment} setInputValue={setComment}/>
                <MyCheckbox forId='agreement' id='agree-checkbox' inputName='agreement' onClickHandler={onClickHandler}><p className='agreement'>Я принимаю <span>условия использованя</span> персональных данных*</p></MyCheckbox>
            </form>
        </div>
    );
};

export default MainMenuPage;