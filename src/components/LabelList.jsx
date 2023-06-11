import useLabelsQuery from '../hooks/useLabelsQuery';

export default function LabelList({ selected, toggle }) {
    const { data, isLoading, isSuccess } = useLabelsQuery();
    return (
        <div className='labels'>
            <h3>Labels</h3>
            {isLoading && <p>Loading ...</p>}
            <ul>
                {isSuccess &&
                    data.map((label) => {
                        const isSelected = selected.includes(label.id);
                        return (
                            <li key={label.id}>
                                <button
                                onClick={() => toggle(label.id)}
                                    className={`label ${isSelected ? 'selected' : ''} ${
                                        label.color
                                    }`}
                                >
                                    {label.name}
                                </button>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}
