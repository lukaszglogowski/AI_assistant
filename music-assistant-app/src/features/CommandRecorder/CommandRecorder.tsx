import React, { useContext, useEffect, useState } from "react";
import { RecordingButton } from "components/RecordingButton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { BsFillMicFill } from "react-icons/bs";
import MessageContext from 'contexts/MessageContext';
import { createCommands } from 'commands/commands';

import styles from './CommandRecorder.module.scss';

export type CommandRecorderProps = {};

export const CommandRecorder = (props: CommandRecorderProps) => {
  const context = useContext(MessageContext);
  const [commands, _] = useState(createCommands({
    DateTime: (msg) => context.setMessage(msg)
  }));

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });



  useEffect(() => {
    if (isButtonActive) {
      SpeechRecognition.startListening();
      resetTranscript();
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isButtonActive]);

  useEffect(() => {
    setIsButtonActive(listening);
  }, [listening])

  useEffect(() => {
    context.setMessage((
      <div className={styles['transcript-message']}>
        {transcript}
      </div>
    ))
  }, [transcript])



  return (
    <div className={styles['command-recorder']}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
        colorClassName={styles['color']}
      >
        <BsFillMicFill />
      </RecordingButton>
    </div>
  );
};

export default CommandRecorder;
