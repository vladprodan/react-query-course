import { useParams } from 'react-router-dom';
import useIssueQuery from '../hooks/useIssueQuery';
import { GoIssueClosed, GoIssueOpened } from 'react-icons/go';
import { statuses } from './StatusSelect';
import useUserData from '../hooks/useUserData';
import { relativeDate } from '../helpers/relativeDate';
import useIssueComments from '../hooks/useIssueComments';
import Comment from './Comment';
import IssueStatus from './IssueStatus';
import IssueAssignment from './IssueAssignment';
import IssueLabels from './IssueLabels';
import React from 'react';

export default function IssueDetails() {
    const { number } = useParams();
    const { data, isLoading, isFetching } = useIssueQuery(number);
    const userName = data?.createdBy;

    const createdUser = useUserData(userName);
    const commentsIssue = useIssueComments(number);
    console.log(commentsIssue);
    const statusObject = statuses.find((s) => s.id === data?.status);

    const statusClass =
        data?.status === 'done' || data?.status === 'cancelled'
            ? 'closed'
            : 'open';
    return (
        <div className='issue-details'>
            {isLoading ? (
                <p>Loading issue ...</p>
            ) : (
                <>
                    <header>
                        <h2>
                            {data.title} <span>#{data.number}</span>{' '}
                            {isFetching && <p>Updating...</p>}
                        </h2>
                        <div>
                            <span className={statusClass}>
                                {data.status === 'done' ||
                                data.status === 'cancelled' ? (
                                    <GoIssueClosed style={{ color: 'white' }} />
                                ) : (
                                    <GoIssueOpened style={{ color: 'white' }} />
                                )}
                                {statusObject?.label}
                            </span>
                            <span className='created-by'>
                                {createdUser.isLoading
                                    ? '...'
                                    : createdUser.data?.name}
                            </span>
                            <span>
                                opened this issue{' '}
                                {relativeDate(data.createdDate)}
                            </span>
                            <span> · {data.comments.length} comments</span>
                        </div>
                    </header>
                    <main>
                        <section>
                            {commentsIssue.isLoading && (
                                <p>Comments loading ...</p>
                            )}
                            {commentsIssue.isSuccess &&
                                commentsIssue.data.pages.map((page, index) => (
                                    <React.Fragment key={index}>
                                        {page.map((item) => (
                                            <Comment
                                                key={item.id}
                                                content={item}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            <button
                                onClick={() => commentsIssue.fetchNextPage()}
                                disabled={
                                    !commentsIssue.hasNextPage ||
                                    commentsIssue.isFetchingNextPage
                                }
                            >
                                {commentsIssue.isFetchingNextPage
                                    ? 'Loading...'
                                    : 'Load more'}
                            </button>
                        </section>
                        <aside>
                            <IssueStatus
                                status={data.status}
                                issueNumber={data.number.toString()}
                            />
                            <IssueAssignment
                                assignee={data.assignee}
                                issueNumber={data.number.toString()}
                            />
                            <IssueLabels
                                labels={data.labels}
                                issueNumber={data.number.toString()}
                            />
                        </aside>
                    </main>
                </>
            )}
        </div>
    );
}
