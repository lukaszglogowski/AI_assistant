import React, { useContext, useEffect, useState } from "react";
import { RecordingButton } from "components/RecordingButton";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { BsFillMicFill } from "react-icons/bs";
//import { commands } from "commands/commands";
import { MessageDisplayer } from "components/MessageDisplayer";
import MessageContext from 'contexts/MessageContext';

export type CommandData = {
  commandName: string;
  command: string[];
  callback: (...args: any[]) => unknown;
  description: React.ReactNode;
}

export type CommandRecorderProps = {};

export const CommandRecorder = (props: CommandRecorderProps) => {
  const context = useContext(MessageContext);
  const commands: CommandData[] = [
    {
      commandName: '1',
      command: ['Podaj datę i czas'],
      callback: () => {
        let dateTime = new Date().toLocaleString();
        
        context.setMessage(dateTime);
      },
      description: 'TEST'
    },
    {
      commandName: '2',
      command: ['wyszukaj w Wikipedii *'],
      callback: (search) => {
        console.log(search);
        const url = new URL('https://pl.wikipedia.org/w/index.php')
  
        url.searchParams.append('search', search)
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      description: 'TEST'
    },
    {
      commandName: '3',
      command: ['Wyszukaj w Youtube *'],
      callback: (search) => {
        console.log(search);
        const url = new URL('https://www.youtube.com/results')
  
        url.searchParams.append('search_query', search)
        window.open(url, '_blank', 'noopener,noreferrer');
      },
      description: 'TEST'
    },
  ];

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

  return (
    <div style={{ fontSize: "56px" }}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => setIsButtonActive(!isButtonActive)}
      >
        <BsFillMicFill />
      </RecordingButton>
    </div>
  );
};

export default CommandRecorder;
