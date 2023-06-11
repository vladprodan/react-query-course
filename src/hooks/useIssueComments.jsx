import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';

export const fetchIssueComments = async (number, pageParam) => {
    return await fetchWithError(`/api/issues/${number}/comments?page=${pageParam}`);
};

const useIssueComments = (issueNumber) => {
    return useInfiniteQuery({
        queryKey: ['issues', issueNumber, 'comments'],
        queryFn: ({pageParam = 1}) => fetchIssueComments(issueNumber, pageParam),
        enabled: !!issueNumber,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) return;

            return pages.length + 1;
        },
    });
};

export default useIssueComments;
