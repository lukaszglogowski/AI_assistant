import React, { useEffect, useState } from "react";
import { RecordingButton } from "components/RecordingButton";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { BsFillMicFill } from 'react-icons/bs';

export type CommandRecorderProps = {

};

export const CommandRecorder = (props: CommandRecorderProps) => {

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  useEffect(() => {
    if (isButtonActive) {
      SpeechRecognition.startListening({continuous: true})
      resetTranscript()
    } else {
      SpeechRecognition.stopListening()
    }
  }, [isButtonActive])




  return (
    <div style={{fontSize: '56px'}}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
      >
        <BsFillMicFill/>
      </RecordingButton>
      {transcript}
    </div>
  );
};

export default CommandRecorder;