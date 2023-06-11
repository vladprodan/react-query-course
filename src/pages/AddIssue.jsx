import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddIssue = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const addIssueHandler = async (issue) => {
        const res = await fetch('/api/issues', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(issue),
        });

        const data = await res.json();
        return data;
    };

    const addIssue = useMutation(addIssueHandler, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(['issues'], { exact: true });
            queryClient.setQueryData(['issues', data.number.toString()], data);
            navigate(`/issue/${data.number}`)
        },
    });

    const onSubmitForm = (event) => {
        event.preventDefault();
        if (addIssue.isLoading) return;
        addIssue.mutate({
            comment: comment,
            title: title,
        });

    };

    return (
        <div className='add-issue'>
            <h2>Add Issue</h2>
            {addIssue.isError && <p>Something went wrong</p>}
            {addIssue.isSuccess && <p>Successfully added new issue</p>}
            <form onSubmit={onSubmitForm}>
                <label>
                    <p>Title</p>
                    <input
                        type='text'
                        placeholder='Enter the title of issue'
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    <p>Comment</p>
                    <textarea
                        placeholder='Enter the comment of issue'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>

                <button type='submit' disabled={addIssue.isLoading}>
                    {addIssue.isLoading ? 'Loading ...' : 'Add issue'}
                </button>
            </form>
        </div>
    );
};

export default AddIssue;
