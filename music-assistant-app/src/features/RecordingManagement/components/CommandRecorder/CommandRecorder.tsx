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
import HistoryManipulationContext from 'contexts/HistoryManipulationContext';
import { SearchResultPage } from 'features/HistoryPages/SearchResultPage';
import ModalSystemContext from 'contexts/ModalSystemContext';
import { openErrorMessage } from 'components/ModalMessagesTypes/ErrorMessage';

export type CommandRecorderProps = ActiveStateUpdateProps & {};


export const CommandRecorder = (props: CommandRecorderProps) => {
  const context = useContext(MessageContext);
  const history = useContext(HistoryManipulationContext);
  const modalSystem = useContext(ModalSystemContext)
  const [commands, _] = useState(createCommands({
    DateTime: (msg) => context.setMessage(msg),
    ShazamSearch: (term) => history.resetHistoryAndPush({
      history: {
        component: SearchResultPage,
        props: {
          term: term
        },
      },
    })
  }));

  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition({ commands });


  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      openErrorMessage(modalSystem, <><div className='center'>Niekompatybilna przeglądarka</div><div className='center'>Aplikacja nideostępna</div></>, undefined, false);
      return
    }
    if (!isMicrophoneAvailable) {
      openErrorMessage(modalSystem, <><div className='center'>Mikrofon niedostępny</div><div className='center'>Należy go włączyć dla obecnej strony i ją odświerzyć</div></>);
      return
    }
  }, [])

  useEffect(() => {
    if (!isMicrophoneAvailable) {
      openErrorMessage(modalSystem, <><div className='center'>Mikrofon niedostępny</div><div className='center'>Należy go włączyć dla obecnej strony i ją odświerzyć</div></>);
      return;
    }
    setIsButtonActive(true);
  }, [props.forceActivate])

  useEffect(() => {
    setIsButtonActive(false);
    SpeechRecognition.abortListening();
    resetTranscript();
  }, [props.forceDeactivate])

  useEffect(() => {
    if (isButtonActive) {
      SpeechRecognition.startListening({ language: 'pl-PL' });
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
        onClick={() => {
          if (!isMicrophoneAvailable) {
            openErrorMessage(modalSystem, <><div className='center'>Mikrofon niedostępny</div><div className='center'>Należy go włączyć dla obecnej strony i ją odświerzyć</div></>);
            return;
          }
          setIsButtonActive(!isButtonActive)
        }}
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
