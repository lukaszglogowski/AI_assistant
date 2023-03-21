import React, { useEffect, useState } from "react";
import { RecordingButton } from "components/RecordingButton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { BsFillMicFill } from "react-icons/bs";
import { commands } from "commands/commands";
import { MessageDisplayer } from "components/MessageDisplayer";

export type CommandRecorderProps = {};

export const CommandRecorder = (props: CommandRecorderProps) => {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (isButtonActive) {
      SpeechRecognition.startListening({ continuous: true });
      resetTranscript();
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isButtonActive]);

  return (
    <div style={{ fontSize: "56px" }}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
      >
        <BsFillMicFill />
      </RecordingButton>
      {transcript}
      <MessageDisplayer></MessageDisplayer>
    </div>
  );
};

export default CommandRecorder;
