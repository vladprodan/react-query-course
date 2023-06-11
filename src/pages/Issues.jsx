import { useState } from 'react';
import IssuesList from '../components/IssuesList';
import LabelList from '../components/LabelList';
import StatusSelect from '../components/StatusSelect';
import { Link } from 'react-router-dom';

const Issues = () => {
    const [labels, setLabels] = useState([]);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const handleToggleLabels = (label) => {
        setLabels((prevState) =>
            prevState.includes(label)
                ? prevState.filter((i) => i !== label)
                : prevState.concat(label)
        );
        setPage(1);
    };

    const handleChangeStatus = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    return (
        <div>
            <main>
                <section>
                    <h1>Issues</h1>
                    <IssuesList
                        labels={labels}
                        status={status}
                        page={page}
                        setPage={setPage}
                    />
                </section>
                <aside>
                    <LabelList selected={labels} toggle={handleToggleLabels} />
                    <StatusSelect
                        value={status}
                        onChange={handleChangeStatus}
                    />
                    <hr />
                    <Link className='button' to='add'>
                        Add Issue
                    </Link>
                </aside>
            </main>
        </div>
    );
};

export default Issues;
