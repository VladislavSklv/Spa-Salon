import React from 'react';
import './skeleton.scss';

interface skeletonElementProps{
    type: string;
}

const SkeletonElement:React.FC<skeletonElementProps> = ({type}) => {
    return (
        <div className={`skeleton ${type}`}>
            
        </div>
    );
};

export default SkeletonElement;