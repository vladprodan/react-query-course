import { useQuery } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';

const useSearchQuery = (searchValue) => {

  const fetchSearchValue = async ({signal}) => {
    return await fetchWithError(`/api/search/issues?q=${searchValue}`, {signal});
  }

  return useQuery({
    queryKey: ['issues', 'search', searchValue],
    queryFn: fetchSearchValue,
    enabled: searchValue.length > 0,
  })

}

export default useSearchQuery