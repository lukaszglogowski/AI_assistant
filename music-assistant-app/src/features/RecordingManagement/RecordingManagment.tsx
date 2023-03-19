import { CommandRecorder } from 'features/CommandRecorder';
import React from 'react';

export type RecordingManagementProps = {

};

export const RecordingManagement = (props: RecordingManagementProps) => {
  return (
    <>
      <CommandRecorder></CommandRecorder>
    </>
  );
}

RecordingManagement.defaultProps = {

}

export default RecordingManagement;
