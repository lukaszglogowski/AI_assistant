
import { ShazamSongInfoResponseBody } from 'utils/apis/shazam.types';
import styles from './SongInfoContent.module.scss';

export type SongInfoContentProps = {
  songDetails?: ShazamSongInfoResponseBody
};

export const SongInfoContent = (props: SongInfoContentProps) => {

  return (
    <>
      {props.songDetails?.data[0].attributes.name}
    </>
  );
};

SongInfoContent.defaultProps = {

};

export default SongInfoContent;
