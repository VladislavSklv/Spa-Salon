import React from 'react';
import SkeletonElement from './SkeletonElement';
import './skeleton.scss';
import Shimmer from './Shimmer';

const SkeletonTimeBlock:React.FC = () => {
    return (
        <div className='skeleton-timeblock'>
            <SkeletonElement type='title'/>
            <div className="skeleton-wrapper">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <SkeletonElement key={item} type='timestamp'/>
                ))}
            </div>
            <Shimmer/>
        </div>
    );
};

export default SkeletonTimeBlock;