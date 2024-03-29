import { useEffect, useRef, useState,useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatTime } from "../../utils/utilFunctions";
import { FaExpandAlt, SlOptions } from "../../utils/icons";
import {
  handleIsPlaying,
  setProgressBarWidth,
  setVolume,
  setCurrentTime,
  playerSongFetch,
  handleControls,
} from "../../features/playerSlice";
import { SongDetails, SongControls, Download, Volume } from "./index";
import { homeDataFetch } from "../../features/homeSlice";
import { addLastPlayed } from "../../features/storageSlice";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeStore"; 


const Player = () => {

  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);


  const [mousedown, setMouseDown] = useState(false);
  const ref = useRef(null);

  const {
    currentSongData,
    id: songId,
    type,
    songsList,
    isPlaying,
    volume,
    currentTime,
    progressBarWidth,
    songNum,
  } = useSelector((store) => store.player);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(homeDataFetch());
  }, []);

  useEffect(() => {
    dispatch(playerSongFetch({ songId, type }));
  }, [songId, type]);

  const { downloadUrl, name, primaryArtists, image } = currentSongData;

  useEffect(() => {
    if (!currentSongData.id) {
      return;
    }
    dispatch(addLastPlayed(currentSongData));
  }, [currentSongData]);

  useEffect(() => {
    if (!isPlaying) return;
    ref.current.play();
    const interval = setInterval(() => {
      let time = Math.floor(ref.current?.currentTime);
      dispatch(setCurrentTime(time));
    }, 1000);
    return () => clearTimeout(interval);
  }, [isPlaying, currentSongData]);

  const handlePlay = () => {
    dispatch(handleIsPlaying(!isPlaying));
  };

  useEffect(() => {
    if (!isPlaying) ref.current.pause();
    else ref.current.play();
  }, [isPlaying]);

  useEffect(() => {
    if (currentTime < 1) return;
    const totalTime = ref.current?.duration;
    const percentage = ((currentTime / Math.floor(totalTime)) * 100).toFixed(8);
    dispatch(setProgressBarWidth(percentage));
  }, [currentTime]);

  const handleMouseDown = (e, flag) => {
    if (flag && !e.target.classList.contains("progress")) return;
    const currentPoint = e.clientX - e.target.getBoundingClientRect().left;
    const totalWidth = e.currentTarget.clientWidth;
    let percentage = ((currentPoint / totalWidth) * 100).toFixed(8);
    if (percentage > 100) percentage = 100;
    const newTime = Math.floor((percentage / 100) * ref.current.duration);
    dispatch(setCurrentTime(newTime));
    ref.current.currentTime = newTime;
    dispatch(setProgressBarWidth(percentage));
  };

  const handleVolume = (e) => {
    if (e.target.classList.contains("input")) return;
    if (volume > 0) {
      dispatch(setVolume(0));
      ref.current.muted = true;
      return;
    } else dispatch(setVolume(1));
    ref.current.muted = false;
  };
  const handleVolumeChange = (e) => {
    dispatch(setVolume(e.target.value));
    ref.current["volume"] = volume;
  };

  const handleEnd = (e) => {
    if (songsList.length === 1 || songsList.length - 1 === songNum) {
      dispatch(handleIsPlaying(false));
      ref.current.pause();
    }
    if (songsList.length > 1) {
      dispatch(handleControls("next"));
    }
  };

  return (
    <section className={`fixed bottom-0 h-20 ${isDarkMode?'bg-slate-600':'bg-red-100'} w-[100%] rounded-t-lg  ${isDarkMode?'border-slate-500':'border-red-100'} z-20`}>
      <audio
        src={downloadUrl?.[1]?.link}
        ref={ref}
        type="audio/mp3"
        preload="metadata"
        onEnded={handleEnd}
      ></audio>
      <div
        onClick={(e) => {
          handleMouseDown(e, true);
        }}
        onMouseMove={(e) => {
          if (mousedown && e.target.classList.contains("progress")) {
            handleMouseDown(e, false);
          }
        }}
        onMouseDown={() => setMouseDown(true)}
        onMouseLeave={() => setMouseDown(false)}
        className="w-[99.6%] progress border-t-[5px] border-red-300 relative mx-auto"
      >
        <div
          style={{ width: `${progressBarWidth}%` }}
          className="relative -top-1 border-t-[5px] border-t-red-500"
        >
          <span
            className="absolute -top-2.5 -right-3 w-4 h-4 hover:scale-110 rounded-full bg-red-800 "
            onMouseUp={() => setMouseDown(false)}
          ></span>
        </div>
      </div>
      <div className="flex justify-between px-4 items-center h-20 pb-5">
        <SongDetails
          name={name}
          primaryArtists={primaryArtists}
          image={image}
        />
        <SongControls songsList={songsList} handlePlay={handlePlay} />
        <div className="flex items-center gap-x-4 sm:gap-x-6 px-0 sm:px-4">
          <span>
            <span>
              {formatTime(Math.floor(ref.current?.currentTime || 0))}{" "}
            </span>
            / <span>{formatTime(Math.floor(ref.current?.duration || 0))}</span>
          </span>
          <Download downloadUrl={downloadUrl} />
          <Volume
            handleVolume={handleVolume}
            handleVolumeChange={handleVolumeChange}
          />
          {/* <button>
            <SlOptions className="w-5 h-5 md:w-7 md:h-7" />
          </button> */}
          <button
            onClick={() => {
              const path = `${type}/${songId}`;
              navigate(path);
            }}
          >
            <FaExpandAlt className="w-5 h-5 md:w-7 md:h-7 hover:scale-110 duration-200" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default Player;
