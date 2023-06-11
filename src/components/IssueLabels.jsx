import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useLabelsQuery from '../hooks/useLabelsQuery';
import { GoGear } from 'react-icons/go';

const IssueLabels = ({ labels, issueNumber }) => {
    const queryClient = useQueryClient();
    const labelsQuery = useLabelsQuery();
    const [isOpen, setIsOpen] = useState(false);

    const mutation = async (labelId) => {
        const newLabels = labels.includes(labelId)
            ? labels.filter((currentLabel) => currentLabel !== labelId)
            : [...labels, labelId];
        const res = await fetch(`/api/issues/${issueNumber}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ labels: newLabels }),
        });

        const data = await res.json();
        return data;
    };

    const changeLabels = useMutation(mutation, {
        onMutate: (labelId) => {
            const oldLabels = queryClient.getQueryData([
                'issues',
                issueNumber,
            ]).labels;

            const newLabels = oldLabels.includes(labelId)
                ? oldLabels.filter((currentLabel) => currentLabel !== labelId)
                : [...labels, labelId];

            queryClient.setQueryData(['issues', issueNumber], (issueState) => ({
                ...issueState,
                labels: newLabels,
            }));

            return () => {
                queryClient.setQueryData(
                    ['issues', issueNumber],
                    (issueState) => ({
                        ...issueState,
                        labels: oldLabels,
                    })
                );
            };
        },
        onError: (data, variables, rollback) => {
          rollback();
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['issues', issueNumber], (oldState) => ({
            ...oldState,
            labels: data.labels,
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
            <div>
                <span>Labels</span>
                {labels &&
                    labels?.map((label) => {
                        const labelObject = labelsQuery.data.find(
                            (queryLabel) => queryLabel.id === label
                        );
                        if (!labelObject) return null;
                        return (
                            <span
                                key={label}
                                className={`label ${labelObject.color}`}
                            >
                                {labelObject.name}
                            </span>
                        );
                    })}
            </div>
            <GoGear onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <div className='picker-menu labels'>
                    {labelsQuery.data.map((label) => {
                      
                      const selected = labels.includes(label.id);
                      return (
                        <div
                            key={label.id}
                            className={selected ? "selected" : ""}
                            onClick={() => {
                                changeLabels.mutate(label.id);
                                setIsOpen(false);
                            }}
                        >
                            <span className='label-dot'></span>
                            {label.name}
                        </div>
                    )})}
                </div>
            )}
        </div>
    );
};

export default IssueLabels;
