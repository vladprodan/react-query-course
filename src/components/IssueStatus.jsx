import React from 'react';
import StatusSelect from './StatusSelect';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const IssueStatus = ({ status, issueNumber }) => {
    const queryClient = useQueryClient();

    const mutation = async (status) => {
        const res = await fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        const data = await res.json();
        return data;
    };

    const changeStatus = useMutation(mutation, {
        onMutate: (status) => {
          console.log(" onMutate: (status)", status)
            const oldStatus = queryClient.getQueryData([
                'issues',
                issueNumber,
            ]).status;

            queryClient.setQueryData(['issues', issueNumber], (data) => ({
                ...data,
                status,
            }));

            //rollback function
            return () => {
                queryClient.setQueryData(['issues', issueNumber], (data) => ({
                    ...data,
                    status: oldStatus,
                }));
            };
        },
        onError: (data, variables, rollback) => {
          rollback();
        },
        onSettled: (data, variables, rollback) => {
          queryClient.invalidateQueries(['issues', issueNumber], {exact: true})
        }
    });

    return (
        <div className='issue-options'>
            <div>
                <StatusSelect
                    noEmptyOption
                    value={status}
                    onChange={(e) => changeStatus.mutate(e.target.value)}
                />
            </div>
        </div>
    );
};

export default IssueStatus;
