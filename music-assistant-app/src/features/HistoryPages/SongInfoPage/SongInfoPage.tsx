import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SHAZAM_API } from 'utils/apis/shazam';
import SongInfoContent from './SongInfoContent/SongInfoContent';

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

  const [key, setKey] = useState<string>()
  const [keyGetterStatus, setKeyGetterStatus] = useState<InitResolveStateT>({
    isResolving: false,
    isError: true,
  });

  useEffect(() => {
    if (typeof props.songKey === 'string') {
      setKey(props.songKey);
      setKeyGetterStatus({
        isResolving: false,
        isError: false,
      });
    } else {
      setKeyGetterStatus({
        ...keyGetterStatus,
        isResolving: true
      });
      props.songKey.keyGetter().then((value) => {
        if (typeof props.songKey !== 'string')
        setKey(props.songKey.keyResolver(value));
        setKeyGetterStatus({
          isResolving: false,
          isError: false,
        });
      }).catch(() => {
        setKeyGetterStatus({
          isResolving: false,
          isError: true,
        });
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

  //console.log(apiKeys, songDetails)

  return (
    <>
      <SongInfoContent songDetails={songDetails}/>
    </>
  );
};

SongInfoPage.defaultProps = {

};

export default SongInfoPage;
