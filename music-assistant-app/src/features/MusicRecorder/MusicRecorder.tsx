import React, { useState } from 'react';
import { RecordingButton } from 'components/RecordingButton';

import { HiMusicNote } from 'react-icons/hi';

import styles from './MusicRecorder.module.scss';
import { buildCssClass } from 'utils/css/builders';

const timerPieBegClassObj = buildCssClass({
  [styles['pie']]: true,
  [styles['spinner']]: true,
  [styles['timer-color']]: true,
});

const timerPieEndClassObj = buildCssClass({
  [styles['pie']]: true,
  [styles['filler']]: true,
  [styles['timer-color']]: true,
});

const timerPieMaskClassObj = buildCssClass({
  [styles['mask']]: true,
  [styles['mask-color']]: true,
});

export type MusicRecorderProps = {};

export const MusicRecorder = (props: MusicRecorderProps) => {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const timerClassObj = buildCssClass({
    [styles['timer']]: true,
    [styles['active']]: isButtonActive,
  });

  return (
    <div className={styles['music-recorder']}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
        colorClassName={styles['color']}
      >
        <HiMusicNote/>
      </RecordingButton>
      <div className={timerClassObj}>
        <div className={timerPieBegClassObj}></div>
        <div className={timerPieEndClassObj}></div>
        <div className={timerPieMaskClassObj}></div>
      </div>
    </div>
  );
};

MusicRecorder.defaultProps = {

};

export default MusicRecorder;
