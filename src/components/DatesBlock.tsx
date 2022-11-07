import React, { useRef } from 'react';
import Slider from 'react-slick';
import { datesObj } from '../pages/DateAndTimePage';
import MyNextArrow from './UI/MyNextArrow';
import MyPrevArrow from './UI/MyPrevArrow';

interface datesBlockProps{
    months: datesObj[];
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    setTime: React.Dispatch<React.SetStateAction<string>>;
}

const DatesBlock:React.FC<datesBlockProps> = ({months, date, setDate, setTime}) => {
    const sliderRef = useRef<Slider>(null);

    let settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false,
        swipeToSlide: false,
        swipe: false,
        nextArrow: <MyNextArrow />,
        prevArrow: <MyPrevArrow />,
        beforeChange: () => {
            setDate('');
            setTime('');
        }
    };

    return (
        <div className='dates-seances__dates'>
            <Slider ref={sliderRef} {...settings}>
                {months.map(month => 
                    <div key={month.month} className='dates'>
                        <div className='dates__month'>{month.month}</div>
                        <div className='dates__wrapper'>
                            {month.days.map(day => 
                                <div 
                                    key={day.date} 
                                    onClick={() => {
                                        setDate(day.date); 
                                        if(date !== day.date) setTime('');
                                    }} 
                                    className={date === day.date ? 'date date_active' : 'date'}
                                >{day.weekDay}<span>{day.day}</span></div>    
                            )}
                        </div>
                    </div>    
                )}
            </Slider>
        </div>
    );
};

export default DatesBlock;