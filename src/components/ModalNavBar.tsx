import React from 'react';
import { IServicesCategory } from '../api/mainApi';
import Modal from './Modal';

interface modalNavBarProps {
    servicesCategories: IServicesCategory[];
    servicesRef: React.RefObject<HTMLDivElement>;
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpacity: React.Dispatch<React.SetStateAction<boolean>>;
    servicesListRef: React.RefObject<HTMLDivElement>;
}

const ModalNavBar: React.FC<modalNavBarProps> = ({servicesCategories, servicesRef, isModal, setIsModal, setIsOpacity, servicesListRef}) => {
    return (
        <Modal setIsOpened={setIsModal} setIsOpacity={setIsOpacity} isOpened={isModal}>
            <div className='modal-navbar'>
                <div className="modal-navbar__title">Направления</div>
                <ul className='modal-navbar__wrapper'>
                    {servicesCategories.map(servicesCategory => (
                        <li
                            data-href={`${servicesCategory.id}`} 
                            key={servicesCategory.id}
                            onClick={(e: any) => {
                                if(servicesRef.current !== null) {
                                    servicesRef.current.childNodes[1].childNodes.forEach((div: any, i) => {
                                        if(div.id && div.id === e.target.dataset.href && servicesListRef.current !== null){
                                            if(i === 0) servicesListRef.current.scrollBy(0, div.getBoundingClientRect().top - 61);
                                            else servicesListRef.current.scrollBy(0, div.getBoundingClientRect().top - 45);
                                        }
                                    })
                                    setIsModal(false);
                                    setIsOpacity(false);
                                }
                            }}
                        >{servicesCategory.name}</li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};

export default ModalNavBar;