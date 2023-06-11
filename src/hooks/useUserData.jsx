import { useQuery } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';

const useUserData = (userId) => {

    const fetchUserData = async () => {
        return await fetchWithError(`/api/users/${userId}`);
    };
    
    return useQuery({
        queryKey: ['users', userId],
        queryFn: fetchUserData,
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // infinity
        refetchOnWindowFocus: true // default
    });
};

export default useUserData;
