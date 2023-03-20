import { MessageDisplayer } from 'components/MessageDisplayer';
import { CommandRecorder } from 'features/CommandRecorder';
import React from 'react';

export type RecordingManagementProps = {

};

export const RecordingManagement = (props: RecordingManagementProps) => {
  return (
    <>
      <CommandRecorder></CommandRecorder>
      <MessageDisplayer></MessageDisplayer>
    </>
  );
}

RecordingManagement.defaultProps = {

}

export default RecordingManagement;
