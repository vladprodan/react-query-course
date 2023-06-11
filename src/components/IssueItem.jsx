import { Link } from 'react-router-dom';
import { GoIssueOpened, GoIssueClosed, GoComment } from 'react-icons/go';
import { relativeDate } from '../helpers/relativeDate';
import useUserData from '../hooks/useUserData';
import useLabelsQuery from '../hooks/useLabelsQuery';
import { useQueryClient } from '@tanstack/react-query';
import { fetchIssueComments } from '../hooks/useIssueComments';

const IssueItem = (props) => {
    const {
        title,
        number,
        assignee,
        commentCount,
        createdBy,
        createdDate,
        labels,
        status,
    } = props;

    const assigneeUser = useUserData(assignee);
    const createdByUser = useUserData(createdBy);
    const queryClient = useQueryClient();

    return (
        <li
            onMouseEnter={() =>
                queryClient.prefetchInfiniteQuery(
                    ['issues', number.toString(), 'comments'],
                    () => fetchIssueComments(number)
                )
            }
        >
            <div>
                {status === 'done' || status === 'cancelled' ? (
                    <GoIssueClosed style={{ color: 'red' }} />
                ) : (
                    <GoIssueOpened style={{ color: 'green' }} />
                )}
            </div>
            <div className='issue-content'>
                <span>
                    <Link to={`/issue/${number}`}>{title}</Link>
                    {labels.map((label) => (
                        <Label key={label} label={label} />
                    ))}
                </span>
                <small>
                    #{number} opened {relativeDate(createdDate)}{' '}
                    {createdByUser.isSuccess
                        ? `by ${createdByUser.data.name}`
                        : null}
                </small>
            </div>
            {assignee ? (
                <img
                    src={
                        assigneeUser.isSuccess
                            ? assigneeUser.data.profilePictureUrl
                            : null
                    }
                    className='assigned-to'
                />
            ) : null}
            <span className='comment-count'>
                {commentCount > 0 ? (
                    <>
                        <GoComment />
                        {commentCount}
                    </>
                ) : null}
            </span>
        </li>
    );
};

const Label = ({ label }) => {
    const labelsQuery = useLabelsQuery();
    if (labelsQuery.isLoading) return null;
    const labelObject = labelsQuery.data.find((item) => item.id === label);
    if (!labelObject) return null;

    return (
        <span key={label} className={`label ${labelObject.color}`}>
            {' '}
            {labelObject.name}{' '}
        </span>
    );
};

export default IssueItem;
