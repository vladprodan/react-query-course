import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useUserData from '../hooks/useUserData';
import { GoGear } from 'react-icons/go';
import useUsersQuery from '../hooks/useUsersQuery';

const IssueAssignment = ({ assignee, issueNumber }) => {
    const user = useUserData(assignee);
    const allUsers = useUsersQuery();

    const [isOpen, setIsOpen] = useState(false);

    const queryClient = useQueryClient();

    const mutation = async (assignee) => {
        const res = await fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ assignee }),
        });

        const data = await res.json();
        return data;
    };

    const changeAssignee = useMutation(mutation, {
        onMutate: (assignee) => {
         
            // old value for rollback function
            const oldAssignee = queryClient.getQueryData([
                'issues',
                issueNumber,
            ]).assignee;

            queryClient.setQueryData(['issues', issueNumber], (data) => ({
                ...data,
                assignee,
            }));

            //rollback function
            return () => {
                queryClient.setQueryData(['issues', issueNumber], (data) => ({
                    ...data,
                    assignee: oldAssignee,
                }));
            };
        },
        onError: (data, variables, rollback) => {
            rollback();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['issues', issueNumber], (oldState) => ({
                ...oldState,
                assignee: data.assignee,
            }));
        },
        onSettled: () => {
            queryClient.invalidateQueries(['issues', issueNumber], {
                exact: true,
            });
        },
    });

    return (
        <div className='issue-options'>
            {changeAssignee.isError && (
                <p>Face some problem with update Assignee</p>
            )}
            {/* {changeAssignee.isSuccess && <p>Successfully updated Assignee</p>} */}
            <div>
                <span>Assignment</span>
                {user.isSuccess && (
                    <div>
                        <img src={user.data.profilePictureUrl} />
                        <span>{user.data.name}</span>
                    </div>
                )}
            </div>
            <GoGear onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className='picker-menu'>
                    {allUsers.data.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => {
                                changeAssignee.mutate(user.id);
                                setIsOpen(false);
                            }}
                        >
                            <img src={user.profilePictureUrl} />
                            <span>{user.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IssueAssignment;
