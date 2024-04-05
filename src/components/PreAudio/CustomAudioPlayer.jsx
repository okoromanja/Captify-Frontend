import React, { useState, useRef, useEffect } from 'react';
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
function CustomAudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Function to handle volume change
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    audioRef.current.volume = event.target.value;
  };


   // Function to handle seeking
   const handleSeek = (event) => {
    const value = parseFloat(event.target.value);
    setCurrentTime(value);
    audioRef.current.currentTime = value;
  };

  // Update progress and duration
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    };

    const updateProgress = () => {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('loadedmetadata', updateTime);

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateProgress);
      audioRef.current.removeEventListener('loadedmetadata', updateTime);
    };
  }, []);

  console.log(volume)
  return (
    <div>
      <audio ref={audioRef} src={audioUrl}></audio>
      <div className='flex gap-1'>
        <button onClick={togglePlayPause}>{isPlaying ? <FaPause className='hover:bg-bg-blue  hover:text-white w-7 h-7 hover:p-1 hover:rounded-md '   size={25}/> : <FaPlay className='hover:bg-bg-blue  hover:text-white w-7 h-7 hover:p-1 hover:rounded-md ' />}</button>
       
         <input
          type="range"
          min="0"
          max={duration}
          step="1"
          value={currentTime}
          onChange={handleSeek}
          className='w-[500px] bg-gray-500 border-none mx-5'
          
        />
        {currentTime && `${Math.floor(currentTime)}s`}
        <div className='flex items-center gap-1 mx-4'>


{
    volume === "0" ? (<FaVolumeMute size={22}/>) : (<FaVolumeUp size={22}/>)
}
       
         <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className='mx-2 w-28'
        />
         </div>
      </div>
    </div>
  );
}

export default CustomAudioPlayer;
