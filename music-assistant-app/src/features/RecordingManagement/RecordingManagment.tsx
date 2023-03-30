import { MessageDisplayer } from 'components/MessageDisplayer';
import { CommandHelpDisplayer } from 'features/CommandHelpDisplayer';
import { CommandRecorder } from 'features/CommandRecorder';
import { MusicRecorder } from 'features/MusicRecorder';
import React from 'react';

import styles from './RecordingManagment.module.scss';

export type RecordingManagementProps = {

};

export const RecordingManagement = (props: RecordingManagementProps) => {
  return (
    <>
      <div className={styles['recording-box']}>
        <CommandRecorder></CommandRecorder>
        <MusicRecorder></MusicRecorder>
      </div>
      <MessageDisplayer></MessageDisplayer>
    </>
  );
}

RecordingManagement.defaultProps = {

}

export default RecordingManagement;
