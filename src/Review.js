import React from 'react';

function Review(props){
    return (
        <div>
            <p>{props.user}</p>
            <p>{props.review}</p>
            <p>{props.rating}</p>
        </div>
    );
}

export default Review;