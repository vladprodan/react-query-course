import React from 'react';

export const statuses = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'todo', label: 'Todo' },
    { id: 'inProgress', label: 'In progress' },
    { id: 'done', label: 'Done' },
    { id: 'cancelled', label: 'Cancelled' },
];

const StatusSelect = ({ value, onChange, noEmptyOption = false }) => {

    return (
        <div>
            <h3>Status</h3>
            <select className='status-select' value={value} onChange={onChange}>
              {noEmptyOption ? null : <option value="">Select a status to filtering</option>}
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StatusSelect;
