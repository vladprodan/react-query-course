import { useQuery } from '@tanstack/react-query';
import fetchWithError from '../helpers/fetchWithError';
import { defaultLabels } from '../helpers/defaultData';

const useLabelsQuery = () => {

  const getAllLabels = async ({signal}) => {
    return await fetchWithError('/api/labels', {signal});
  }

  const query = useQuery({
    queryKey: ['labels'],
    queryFn: getAllLabels,
    placeholderData: defaultLabels
  })

  return query;
}

export default useLabelsQuery