import { useQuery } from '@tanstack/react-query';

const useUsersQuery = () => {
    const getAllUsers = async () => {
        const res = await fetch('/api/users');
        const data = await res.json();
        return data;
    };

    return useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });
};

export default useUsersQuery;
