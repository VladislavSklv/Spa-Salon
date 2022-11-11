import React, { createRef, useEffect } from 'react';
import { IServicesCategory } from '../api/mainApi';

export interface navBarProps {
    servicesCategories: IServicesCategory[];
    mainMenuRef: React.RefObject<HTMLDivElement>;
    setIsOpacity?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModal?: React.Dispatch<React.SetStateAction<boolean>>;
    activeTab?: number;
}

const NavBar:React.FC<navBarProps> = ({servicesCategories, setIsModal, setIsOpacity, activeTab, mainMenuRef}) => {
    const tabRef = createRef<HTMLDivElement>();

    useEffect(() => {
        tabRef.current?.childNodes.forEach((tab: any) => {
            if(tab.classList.contains('active')) {
                let left = tab.getBoundingClientRect().left - 46;
                tabRef.current!.scrollBy({
                    left,
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }, [activeTab]);

    return (
        <div className='navbar'>
            {setIsOpacity && setIsModal &&
                <div 
                    className='hamburger'
                    onClick={() => {    
                        setIsModal(true);
                        setIsOpacity(true);
                    }}
                >
                    <span className='hamburger__block'></span>
                    <span className='hamburger__block'></span>
                    <span className='hamburger__block'></span>
                </div>
            }
            <div ref={tabRef} className='navbar__wrapper'>
                {servicesCategories !== undefined && servicesCategories.map(servicesCategory => (
                    <a 
                        data-href={`${servicesCategory.id}`} 
                        key={servicesCategory.id}
                        className={activeTab == servicesCategory.id ? 'navbar__href active' : 'navbar__href'} 
                        onClick={(e: any) => {
                            if(mainMenuRef.current !== null) {
                                mainMenuRef.current.childNodes[1].childNodes.forEach((div: any) => {
                                    if(div.id && div.id === e.target.dataset.href){
                                        window.scrollBy(0, div.getBoundingClientRect().top - 45);
                                    }
                                })
                            }
                        }}
                    >{servicesCategory.name}</a>
                ))}
            </div>
        </div>
    );
};

export default NavBar;