import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';

const useIssuesQuery = (labels, status, page) => {
    const queryClient = useQueryClient()

    const fetchIssues = async ({signal}) => {

        const statusParam = status ? `&status=${status}` : '';
        const labelsParam = labels
            .map((label) => `labels[]=${label}`)
            .join('&');
        const paginationParam = page ?  `&page=${page}` : '';

        const issues =  await fetchWithError(`/api/issues?${labelsParam}${statusParam}${paginationParam}`, {signal});

        issues.forEach(issue => {
            queryClient.setQueryData(['issues', issue.number.toString()], issue)
        });

        return issues;
    };

    return useQuery({
        queryKey: ['issues', { labels, status, page }],
        queryFn: fetchIssues,
        staleTime: 1000 * 60,
        keepPreviousData: true
    });
};

export default useIssuesQuery;
