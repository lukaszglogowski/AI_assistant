import { useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { SHAZAM_API } from 'utils/apis/shazam';
import SongInfoContent from './SongInfoContent/SongInfoContent';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';

type InitResolveStateT = {
  isResolving: boolean;
  isError: boolean;
}

export type SongInfoPageProps<T> = {
  songKey: string | {
    keyGetter: () => Promise<T>;
    keyResolver: (keyGetterResult: T) => string;
  }
};

export const SongInfoPage = <T, >(props: SongInfoPageProps<T>) => {

  const historyRendererContext = useContext(HistoryRendererManipulationContext);

  const [key, setKey] = useState<string>()
  const [keyGetterStatus, setKeyGetterStatus] = useState<'idle' | 'error' | 'loading' | 'success'>('idle');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (typeof props.songKey === 'string') {
      setKey(props.songKey);
      setKeyGetterStatus('success');
    } else {
      setKeyGetterStatus('loading');
      props.songKey.keyGetter().then((value) => {
        if (typeof props.songKey !== 'string') {
          setKey(props.songKey.keyResolver(value));
          setKeyGetterStatus('success');
        } else {
          setKeyGetterStatus('error');
        }
      }).catch(() => {
        setKeyGetterStatus('error');
      })
    }
  }, [])

  const {
    status: apiKeysStatus,
    data: apiKeys
  } = useQuery({
    queryKey: ['infoKeys', key],
    queryFn: SHAZAM_API.infoKeys.GET({}, {id: key!}, null),
    enabled: !!key,
  })

  const songId = apiKeys && apiKeys.resources ? Object.keys(apiKeys.resources.songs)[0] : undefined;

  const {
    status: songDetailsStatus,
    data: songDetails
  } = useQuery({
    queryKey: ['songDetails', apiKeys],
    queryFn: SHAZAM_API.songs.details.GET({}, {id: songId!}, null),
    enabled: !!songId,
  })

  useEffect(() => {
    if (
      apiKeysStatus === 'loading' ||
      songDetailsStatus === 'loading' ||
      keyGetterStatus === 'loading'
    ) {
      historyRendererContext.showLoadingSpinner(true);
    } else {
      historyRendererContext.showLoadingSpinner(false);
    }

    if (
      apiKeysStatus === 'error' ||
      songDetailsStatus === 'error' ||
      keyGetterStatus === 'error'
    ) {
      setIsError(true);
    }

  }, [apiKeysStatus, songDetailsStatus, keyGetterStatus, songDetails])

  return (
    <>
      {isError && 'ups'}
      {!isError && <SongInfoContent songDetails={songDetails}/>}
    </>
  );
};

SongInfoPage.defaultProps = {

};

export default SongInfoPage;
