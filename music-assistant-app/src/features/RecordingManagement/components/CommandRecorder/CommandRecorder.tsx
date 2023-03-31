import React, { useContext, useEffect, useState } from "react";
import { RecordingButton } from "components/RecordingButton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { BsFillMicFill } from "react-icons/bs";
import MessageContext from 'contexts/MessageContext';
import { createCommands } from 'commands/commands';

import styles from './CommandRecorder.module.scss';
import { ActiveStateUpdateProps } from 'features/RecordingManagement/types';

export type CommandRecorderProps = ActiveStateUpdateProps & {};

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
    setIsButtonActive(true);
  }, [props.forceActivate])

  useEffect(() => {
    setIsButtonActive(false);
    SpeechRecognition.abortListening();
    resetTranscript();
  }, [props.forceDeactivate])

  useEffect(() => {
    if (isButtonActive) {
      SpeechRecognition.startListening();
      resetTranscript();
    } else {
      SpeechRecognition.stopListening();
    }
    props.onActiveStateChange!!(isButtonActive);
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

CommandRecorder.defaultProps = {
  onActiveStateChange: () => {}
}

export default CommandRecorder;