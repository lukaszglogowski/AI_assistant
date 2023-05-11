import {
  ShazamSongInfoResponseBody,
  YoutubeSongInfoResponseBody,
} from "utils/apis/shazam.types";
import styles from "./SongInfoContent.module.scss";
import { url } from "inspector";
import React from "react";
import { AiFillYoutube } from "react-icons/ai";

export type SongInfoContentProps = {
  songDetails?: ShazamSongInfoResponseBody;
  songTitle?: YoutubeSongInfoResponseBody<'video'>;
};

export const SongInfoContent = (props: SongInfoContentProps) => {
  if (!props.songDetails) {
    return <></>;
  }

  return (
    <div>
      <div className={styles["song-info-container"]}>
        <strong>Tytuł:</strong> {props.songDetails?.data[0].attributes.name}
      </div>
      <div className={styles["song-info-container"]}>
        <strong>Wykonawca:</strong>{" "}
        {props.songDetails?.data[0].attributes.artistName}
      </div>
      <div className={styles["song-info-container"]}>
        <strong>Kompozytor:</strong>{" "}
        {props.songDetails?.data[0].attributes.composerName}
      </div>
      <div className={styles["song-info-container"]}>
        <strong>Tytuł albumu:</strong>{" "}
        {props.songDetails?.data[0].attributes.albumName}
      </div>
      <div className={styles["song-info-container"]}>
        <strong>Gatunek muzyczny:</strong>{" "}
        {props.songDetails?.data[0].attributes.genreNames.map((el, i) => (
          <React.Fragment key={el}>
            {i !== 0 && ", "}
            {el}
          </React.Fragment>
        ))}
      </div>
      <div className={styles["song-info-container"]}>
        <strong>Data wydania:</strong>{" "}
        {props.songDetails?.data[0].attributes.releaseDate}
      </div>
      <div>
        <button
          className={styles["button"]}
          role="link"
          onClick={() =>
            window.open(
              "https://www.youtube.com/watch?v=" +
                props.songTitle?.data[0].videoId,
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          <AiFillYoutube size={50} color="white" />
        </button>
      </div>
    </div>
  );
};

SongInfoContent.defaultProps = {};

export default SongInfoContent;
