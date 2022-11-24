import React from 'react';
import Shimmer from './Shimmer';
import SkeletonElement from './SkeletonElement';

const SkeletonComment:React.FC = () => {
    return (
        <div className='skeleton-comment'>
            <div className='skeleton-wrapper'>
                <SkeletonElement type='avatar'/>
                <div className='skeleton-comment__content'>
                    <SkeletonElement type='title'/>
                    <div className="skeleton-wrapper">
                        <SkeletonElement type='text-mini'/>
                        <SkeletonElement type='text-mini'/>
                    </div>
                </div>
            </div>
            <SkeletonElement type='text'/>
            <SkeletonElement type='text'/>
            <Shimmer/>
        </div>
    );
};

export default SkeletonComment;