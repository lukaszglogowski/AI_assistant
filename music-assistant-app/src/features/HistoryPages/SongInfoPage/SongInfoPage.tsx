import { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import { SHAZAM_API } from "utils/apis/shazam";
import SongInfoContent from "./SongInfoContent/SongInfoContent";
import HistoryRendererManipulationContext from "contexts/HistoryRendererManipultaionContext";
import { ErrorMessage } from "components/ErrorMesasge";
import {
  ShazamSongInfoResponseBody,
  YoutubeSongInfoResponseBody,
} from "utils/apis/shazam.types";
import { YOUTUBE_API } from "utils/apis/youtube-v3";
import { log } from "console";

export type SongInfoPageProps<T> = {
  songKey:
    | string
    | {
        keyGetter: () => Promise<T>;
        keyResolver: (keyGetterResult: T) => string;
      };
};

export const SongInfoPage = <T,>(props: SongInfoPageProps<T>) => {
  const historyRendererContext = useContext(HistoryRendererManipulationContext);

  const [key, setKey] = useState<string>();
  const [keyGetterStatus, setKeyGetterStatus] = useState<
    "idle" | "error" | "loading" | "success"
  >("idle");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
    historyRendererContext.updateHistoryTitle("");

    if (typeof props.songKey === "string") {
      setKey(props.songKey);
      setKeyGetterStatus("success");
    } else {
      setKeyGetterStatus("loading");
      props.songKey
        .keyGetter()
        .then((value) => {
          if (typeof props.songKey !== "string") {
            setKey(props.songKey.keyResolver(value));
            setKeyGetterStatus("success");
          } else {
            setKeyGetterStatus("error");
          }
        })
        .catch(() => {
          setKeyGetterStatus("error");
        });
    }
  }, [props.songKey]);

  const { status: apiKeysStatus, data: apiKeys } = useQuery({
    queryKey: ["infoKeys", key],
    queryFn: SHAZAM_API.infoKeys.GET({}, { id: key! }, null),
    enabled: !!key,
  });

  const songId =
    apiKeys && apiKeys.resources
      ? Object.keys(apiKeys.resources.songs)[0]
      : undefined;

  const { status: songDetailsStatus, data: songDetails } = useQuery({
    queryKey: ["songDetails", apiKeys],
    queryFn: SHAZAM_API.songs.details.GET({}, { id: songId! }, null),
    enabled: !!songId,
  });

  const songName =
    songDetails && songDetails.data
      ? songDetails.data[0].attributes.artistName +
        " " +
        songDetails.data[0].attributes.name
      : undefined;

  const { status: searchDetailsStatus, data: songTitle } = useQuery({
    queryKey: ["searchDetails", songDetails],
    queryFn: YOUTUBE_API.songName.GET({}, { query: songName! }, null),
    enabled: !!songName,
  });

  useEffect(() => {
    if (
      apiKeysStatus === "loading" ||
      songDetailsStatus === "loading" ||
      keyGetterStatus === "loading" ||
      searchDetailsStatus === "loading"
    ) {
      historyRendererContext.showLoadingSpinner(true);
    } else {
      historyRendererContext.showLoadingSpinner(false);
    }

    if (
      apiKeysStatus === "error" ||
      songDetailsStatus === "error" ||
      keyGetterStatus === "error" ||
      searchDetailsStatus === "error" ||
      (songDetailsStatus === "success" &&
        !(songDetails && songDetails?.data.length > 0))
    ) {
      setIsError(true);
    }
  }, [
    apiKeysStatus,
    songDetailsStatus,
    keyGetterStatus,
    songDetails,
    searchDetailsStatus,
    songTitle,
  ]);

  useEffect(() => {
    if (!(songDetails && songDetails?.data.length > 0)) return;

    historyRendererContext.updateHistoryTitle(
      `Znaleziono: ${songDetails.data[0].attributes.name}`
    );
  }, [songDetails]);

  return (
    <>
      {isError && <ErrorMessage>Nie znaleziono utworu</ErrorMessage>}
      {!isError && (
        <SongInfoContent songDetails={songDetails} songTitle={songTitle} />
      )}
      {/*{true && (
        <SongInfoContent
          songDetails={data as unknown as ShazamSongInfoResponseBody}
          songTitle={data1 as unknown as YoutubeSongInfoResponseBody}
      />
      )}*/}
    </>
  );
};

SongInfoPage.defaultProps = {};

/*const data1 = {
  continuation: "dcsdc",
  estimatedResults: "",
  data: [
    {
      type: "",
      videoId: "e-ORhEE9VVg",
      title: "string;",
      channelTitle: "",
      channelId: "",
      description: "",
      viewCount: "",
      publishedText: "",
      lengthText: "",
      thumbnail: [
        {
          url: "",
          width: 123,
          height: 123,
        },
      ],
      richThumbnail: [
        {
          url: "",
          width: 123,
          height: 123,
        },
      ],
      channelThumbnail: [
        {
          url: "",
          width: 123,
          height: 123,
        },
      ],
    },
  ],
  msg: "",
  refinements: ["", ""],
};

const data = {
  data: [
    {
      id: "1445765740",
      type: "songs",
      attributes: {
        albumName: "1989 (Big Machine Radio Release Special)",
        hasTimeSyncedLyrics: true,
        genreNames: ["Pop", "Music"],
        trackNumber: 4,
        releaseDate: "2014-10-27",
        durationInMillis: 231827,
        isVocalAttenuationAllowed: true,
        isMasteredForItunes: false,
        isrc: "USCJY1431309",
        artwork: {
          width: 3000,
          url: "https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/b2/38/d3/b238d354-1aec-f71b-8706-26fcb1738b6d/00843930039562.rgb.jpg/{w}x{h}bb.jpg",
          height: 3000,
          textColor3: "c8c9c2",
          textColor2: "e8d0b4",
          textColor4: "bfab96",
          textColor1: "f4f5ec",
          bgColor: "1b1b1b",
          hasP3: false,
        },
        audioLocale: "en-US",
        composerName: "Taylor Swift, Shellback & Max Martin",
        playParams: {
          id: "1445765740",
          kind: "song",
        },
        url: "https://music.apple.com/us/album/blank-space/1445765736?i=1445765740",
        discNumber: 1,
        hasLyrics: true,
        isAppleDigitalMaster: false,
        audioTraits: ["lossless", "lossy-stereo"],
        name: "Blank Space",
        previews: [
          {
            url: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/20/3b/f8/203bf8a6-4f53-8e6b-ec00-8afd01241ebe/mzaf_3245104137492806502.plus.aac.ep.m4a",
          },
        ],
        artistName: "Taylor Swift",
      },
      relationships: {
        albums: {
          data: [
            {
              id: "1445765736",
              type: "albums",
            },
          ],
        },
        artists: {
          data: [
            {
              id: "159260351",
              type: "artists",
            },
          ],
        },
      },
    },
  ],
};*/

export default SongInfoPage;
