import { useState } from 'react';
import useIssuesQuery from '../hooks/useIssuesQuery';
import IssueItem from './IssueItem';
import useSearchQuery from '../hooks/useSearchQuery';
import Loader from './Loader';

const IssuesList = ({ labels, status, page, setPage }) => {
    const [search, setSearch] = useState('');

    const { data, isLoading, isError, error, isFetching, isPreviousData } = useIssuesQuery(
        labels,
        status,
        page
    );
    const searchQuery = useSearchQuery(search);

    const onSubmitForm = (event) => {
        event.preventDefault();
        setSearch(event.target.elements.search.value);
    };

    const clickToPrevButton = () => {
        if (page - 1 > 0) {
            setPage(page - 1);
        }
    };

    const clickToNextButton = () => {
        if (data.length !== 0 && !isPreviousData) {
            setPage(page + 1);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmitForm}>
                <input
                    type='text'
                    name='search'
                    placeholder='Search'
                    id='search'
                />
            </form>
            {isError && <p>Error: {error.message}</p>}
            {isLoading ? (
                <p>Loading ...</p>
            ) : searchQuery.fetchStatus === 'idle' &&
              searchQuery.isLoading === true ? (
                <>
                    <div className='fetch_header'>
                        <h2>Issues list</h2> {isFetching && <Loader />}
                    </div>
                    <ul className='issues-list'>
                        {data?.map((issue) => (
                            <IssueItem
                                key={issue.id}
                                title={issue.title}
                                number={issue.number}
                                assignee={issue.assignee}
                                commentCount={issue.comments.length}
                                createdBy={issue.createdBy}
                                createdDate={issue.createdDate}
                                labels={issue.labels}
                                status={issue.status}
                            />
                        ))}
                    </ul>
                    <div className='pagination'>
                        <button
                            onClick={clickToPrevButton}
                            disabled={page === 1}
                        >
                            Prev
                        </button>
                        <p>
                            Page: {page} {isFetching && '...'}
                        </p>
                        <button
                            onClick={clickToNextButton}
                            disabled={data.length === 0 || isPreviousData}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <h2>Search Results</h2>
                    {searchQuery.isLoading ? (
                        <p>Search loading ...</p>
                    ) : (
                        <>
                            <p>Count result: {searchQuery.data.count}</p>
                            <ul className='issues-list'>
                                {searchQuery?.data?.items?.map((issue) => (
                                    <IssueItem
                                        key={issue.id}
                                        title={issue.title}
                                        number={issue.number}
                                        assignee={issue.assignee}
                                        commentCount={issue.comments.length}
                                        createdBy={issue.createdBy}
                                        createdDate={issue.createdDate}
                                        labels={issue.labels}
                                        status={issue.status}
                                    />
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default IssuesList;
