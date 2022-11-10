import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import { datesObj } from '../pages/DateAndTimePage';
import MyNextArrow from './UI/MyNextArrow';
import MyPrevArrow from './UI/MyPrevArrow';

interface datesBlockProps{
    months: datesObj[];
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    setTime: React.Dispatch<React.SetStateAction<string>>;
    setIndexOfMonths: React.Dispatch<React.SetStateAction<number>>;
    initialMonth: string;
}

const DatesBlock:React.FC<datesBlockProps> = ({months, date, setDate, setTime, setIndexOfMonths, initialMonth}) => {
    const sliderRef = useRef<Slider>(null);
    const [initialSlide, setInitialSlide] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            months.forEach((month, i) => {
                if(month.month.toLowerCase() === initialMonth.toLowerCase() && sliderRef !== null) sliderRef.current?.slickGoTo(i);
            })
        }, 500);
    }, []);

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
        initialSlide,
        afterChange: (e: any) => {
            setIndexOfMonths(e);
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
                                        if(day.isActive){
                                            setDate(day.date); 
                                            if(date !== day.date) setTime('');
                                        }
                                    }} 
                                    className={date === day.date ? (day.isActive ? 'date date_active' : 'date date_active date_blured') : (day.isActive ? 'date' : 'date date_blured')}
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