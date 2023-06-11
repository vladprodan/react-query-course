import { useQuery } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';

const useIssueQuery = (number) => {
    const fetchOneIssue = async () => {
        return await fetchWithError(`/api/issues/${number}`);
    };

    return useQuery({
        queryKey: ['issues', number],
        queryFn: fetchOneIssue,

    });
};

export default useIssueQuery;
