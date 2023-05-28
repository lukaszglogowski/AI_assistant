import React, { useContext, useEffect, useRef, useState } from "react";
import { RecordingButton } from "components/RecordingButton";

import { HiMusicNote } from "react-icons/hi";

import styles from "./MusicRecorder.module.scss";
import { buildCssClass } from "utils/css/builders";
import { ActiveStateUpdateProps } from "features/RecordingManagement/types";
import {
  getAudioContext,
  getAudioStream,
  processAudioBufferToShazam,
} from "utils/audio";
import Recorder from "recorder-js";
import HistoryManipulationContext from "contexts/HistoryManipulationContext";
import { SongInfoPage } from "features/HistoryPages/SongInfoPage";
import { SHAZAM_API } from "utils/apis/shazam";
import { ShazamDetectSongResponseBody } from "utils/apis/shazam.types";
import ModalSystemContext from 'contexts/ModalSystemContext';
import { useSpeechRecognition } from 'react-speech-recognition';
import { openErrorMessage } from 'components/ModalMessagesTypes/ErrorMessage';

const AUDIO_TIME_MS = 3500;

const timerPieBegClassObj = buildCssClass({
  [styles["pie"]]: true,
  [styles["spinner"]]: true,
  [styles["timer-color"]]: true,
});

const timerPieEndClassObj = buildCssClass({
  [styles["pie"]]: true,
  [styles["filler"]]: true,
  [styles["timer-color"]]: true,
});

const timerPieMaskClassObj = buildCssClass({
  [styles["mask"]]: true,
  [styles["mask-color"]]: true,
});

export type MusicRecorderProps = ActiveStateUpdateProps & {};

export const MusicRecorder = (props: MusicRecorderProps) => {
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);
  const doAudioProcessing = useRef<boolean>(false);
  const [recorder, setRecorder] = useState<Recorder>();
  const [audioStream, setAudioStream] = useState<MediaStream>();

  const history = useContext(HistoryManipulationContext);
  const modalSystem = useContext(ModalSystemContext)

  const timerClassObj = buildCssClass({
    [styles["timer"]]: true,
    [styles["active"]]: isButtonActive,
  });


  const {
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    if (!isMicrophoneAvailable) {return;}
    async function initStream() {
      let stream;
      try {
        stream = await getAudioStream();
        const audioContext = getAudioContext();
        const recorder = new Recorder(audioContext);
        recorder.init(stream);

        setAudioStream(stream);
        setRecorder(recorder);
      } catch (e) {
        console.log(e);
      }
    }
    initStream().catch((e) => console.log(e));
  }, [isMicrophoneAvailable]);

  useEffect(() => {
    if (!isMicrophoneAvailable) {
      openErrorMessage(modalSystem, <><div className='center'>Mikrofon niedostępny</div><div className='center'>Należy go włączyć dla obecnej strony i ją odświerzyć</div></>);
      return
    }
    setIsButtonActive(true);
  }, [props.forceActivate]);

  useEffect(() => {
    setIsButtonActive(false);
    doAudioProcessing.current = false;
  }, [props.forceDeactivate]);

  useEffect(() => {
    if (isButtonActive) {
      doAudioProcessing.current = true;
      recorder?.start();
    } else {
      if (!recorder) return;
      if (!doAudioProcessing.current) return;

      const processAudio = async () => {
        const result = await recorder.stop();
        const base64 = processAudioBufferToShazam(result.buffer[0]);

        history.resetHistoryAndPush({
          history: {
            component: SongInfoPage<ShazamDetectSongResponseBody>,
            props: {
              //songKey: "157666207",
              songKey: {
                keyGetter: SHAZAM_API.songs.detect.POST({}, {}, base64),
                keyResolver: (k: ShazamDetectSongResponseBody) => {
                  return k.track.key;
                },
              },
            },
          },
        });
      };
      processAudio().catch((e) => console.log(e));
      doAudioProcessing.current = false;
    }

    props.onActiveStateChange!!(isButtonActive);
  }, [isButtonActive]);

  return (
    <div className={styles["music-recorder"]}>
      <RecordingButton
        active={isButtonActive}
        onClick={() => {
          if (!isMicrophoneAvailable) {
            openErrorMessage(modalSystem, <><div className='center'>Mikrofon niedostępny</div><div className='center'>Należy go włączyć dla obecnej strony i ją odświerzyć</div></>);
            return
          }
          setIsButtonActive(!isButtonActive);
          if (!isButtonActive)
            setTimeout(() => {
              setIsButtonActive(false);
            }, AUDIO_TIME_MS);
        }}
        colorClassName={styles["color"]}
      >
        <HiMusicNote />
      </RecordingButton>
      <div className={timerClassObj}>
        <div className={timerPieBegClassObj}></div>
        <div className={timerPieEndClassObj}></div>
        <div className={timerPieMaskClassObj}></div>
      </div>
    </div>
  );
};

MusicRecorder.defaultProps = {
  onActiveStateChange: () => {},
};

export default MusicRecorder;
