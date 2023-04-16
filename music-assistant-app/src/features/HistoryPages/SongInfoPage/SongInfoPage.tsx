import { useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { SHAZAM_API } from 'utils/apis/shazam';
import SongInfoContent from './SongInfoContent/SongInfoContent';
import HistoryRendererManipulationContext from 'contexts/HistoryRendererManipultaionContext';
import { ErrorMessage } from 'components/ErrorMesasge';

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
    setIsError(false);
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
  }, [props.songKey])

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
      keyGetterStatus === 'error' ||
      (songDetailsStatus === 'success' && !(songDetails && songDetails?.data.length > 0))
    ) {
      setIsError(true);
    }

  }, [apiKeysStatus, songDetailsStatus, keyGetterStatus, songDetails])


  useEffect(() => {
    if (!(songDetails && songDetails?.data.length > 0)) return;

    historyRendererContext.updateHistoryTitle(`Znaleziono: ${songDetails.data[0].attributes.name}`)
  }, [songDetails])

  return (
    <>
      {isError && <ErrorMessage>Nie znaleziono utworu</ErrorMessage>}
      {!isError && <SongInfoContent songDetails={songDetails}/>}
    </>
  );
};

SongInfoPage.defaultProps = {

};

export default SongInfoPage;
