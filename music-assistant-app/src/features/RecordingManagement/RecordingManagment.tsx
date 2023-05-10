import { MessageDisplayer } from 'components/MessageDisplayer';
import { CommandHelpDisplayer } from 'features/CommandHelpDisplayer';
import { CommandRecorder } from 'features/RecordingManagement/components/CommandRecorder';
import { MusicRecorder } from 'features/RecordingManagement/components/MusicRecorder';
import React from 'react';
import { useSignal } from 'utils/hooks/useSignal';

import styles from './RecordingManagment.module.scss';

export type RecordingManagementProps = {

};

export const RecordingManagement = (props: RecordingManagementProps) => {

  const commandDeactivateSignal = useSignal();
  const musicActivateSignal = useSignal();

  const commandStateChanged = (newState: boolean) => {
    if (!newState) return;

    musicActivateSignal.emit();
  }

  const musicStateChanged = (newState: boolean) => {
    if (!newState) return;

    commandDeactivateSignal.emit();
  }

  return (
    <div className={styles['container']}>
      <div className={styles['recording-box']}>
        <CommandRecorder
          onActiveStateChange={commandStateChanged}
          forceDeactivate={commandDeactivateSignal.signal}
        />
        <div className={styles['music-space']}>
          <MusicRecorder
            onActiveStateChange={musicStateChanged}
            forceDeactivate={musicActivateSignal.signal}
          />
        </div>
      </div>
      <MessageDisplayer/>
    </div>
  );
}

RecordingManagement.defaultProps = {

}

export default RecordingManagement;
