import React, { useState } from "react";
import { RecordingButton } from "components/RecordingButton";

export type CommandRecorderProps = {

};

export const CommandRecorder = (props: CommandRecorderProps) => {

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  return (
    <div style={{fontSize: '28px'}}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
      >
        Test
      </RecordingButton>
    </div>
  );
};

export default CommandRecorder;