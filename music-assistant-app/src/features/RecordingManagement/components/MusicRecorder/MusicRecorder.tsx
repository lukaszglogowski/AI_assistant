import React, { useEffect, useState } from 'react';
import { RecordingButton } from 'components/RecordingButton';

import { HiMusicNote } from 'react-icons/hi';

import styles from './MusicRecorder.module.scss';
import { buildCssClass } from 'utils/css/builders';
import { ActiveStateUpdateProps } from 'features/RecordingManagement/types';

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

export type MusicRecorderProps = ActiveStateUpdateProps & {};

export const MusicRecorder = (props: MusicRecorderProps) => {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const timerClassObj = buildCssClass({
    [styles['timer']]: true,
    [styles['active']]: isButtonActive,
  });


  useEffect(() => {
    setIsButtonActive(true);
  }, [props.forceActivate])

  useEffect(() => {
    setIsButtonActive(false);
  }, [props.forceDeactivate])

  useEffect(() => {
    props.onActiveStateChange!!(isButtonActive)
  }, [isButtonActive])
  

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
  onActiveStateChange: () => {}
};

export default MusicRecorder;
