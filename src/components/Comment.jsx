import React from 'react';
import useUserData from '../hooks/useUserData';
import { relativeDate } from '../helpers/relativeDate';

const Comment = ({ content }) => {
    const { createdBy, createdDate, comment } = content;
    const { data, isLoading, isError } = useUserData(createdBy);


    if (isError) {
        return (
            <div className='comment'>
                <div>
                    <div className='comment-header'>Failed loaded comment...</div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='comment'>
                <div>
                    <div className='comment-header'>Loading comment...</div>
                </div>
            </div>
        );
    }
    return (
        <div className='comment'>
            <img src={data.profilePictureUrl} />
            <div>
                <div className='comment-header'>
                    <span>{data.name}</span> commented{' '}
                    <span>{relativeDate(createdDate)}</span>
                </div>
                <div className='comment-body'>{comment}</div>
            </div>
        </div>
    );
};

export default Comment;
