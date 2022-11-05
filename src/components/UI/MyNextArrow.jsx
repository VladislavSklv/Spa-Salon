import React from 'react';

const MyNextArrow = (props) => {
    const { className, style, onClick } = props;

    return (
        <div
            className={className}
            style={{ ...style}}
            onClick={onClick}
        />
    );
};

export default MyNextArrow;