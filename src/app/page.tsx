"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Şarkı listesi
  const playlist = [
    {
      name: "Çıkar Biri Karşıma",
      src: "/music.mp3",
      author: "Era7capone",
      img: "https://i.scdn.co/image/ab67616d00001e027646443490fdff4eb8a22ecc",
    },
    {
      name: "O Adam",
      src: "/music2.mp3",
      author: "Jeff Red",
      img: "https://i.scdn.co/image/ab67616d00001e0235154c876bea2cda3a61484a",
    },
    {
      name: "Aşk Tanımaz Engelleri",
      src: "/music3.mp3",
      author: "Semicenk",
      img: "https://i.scdn.co/image/ab67616d00001e02e39b3e49e254ed6bcb731659",
    },
    {
      name: "Kalbim Yanında",
      src: "/music4.mp3",
      author: "Ati242",
      img: "https://i.scdn.co/image/ab67616d00001e0279dbe6c33d218de4aa59223b",
    },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.play() : audio.pause();

    const updateTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleSongEnd); // Şarkı bittiğinde otomatik değiştir

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [isPlaying, currentSongIndex, isSeeking]);

  const changeSong = (index: number) => {
    if (isChanging) return;
    if (index >= 0 && index < playlist.length) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
        setIsChanging(false);
      }, 1000);
    }
  };

  // Şarkı bittiğinde otomatik olarak sonraki şarkıya geç
  const handleSongEnd = () => {
    changeSong((currentSongIndex + 1) % playlist.length);
  };

  // Süreyi MM:SS formatına çevir
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Kullanıcı çubuğu sürüklediğinde
  const handleSeekChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className="h-screen justify-center items-center flex w-full">
      <div className="">
        <h1 className="text-center mb-12 font-extrabold text-2xl">MP3 Player @mehmetc4ner</h1>
        <audio ref={audioRef} key={playlist[currentSongIndex].src}>
          <source src={playlist[currentSongIndex].src} type="audio/mp3" />
        </audio>
        <div className="bg w-96 py-2 rounded-2xl items-center flex justify-between pr-5 pl-2 shadow bg-gradient-to-l to-black via-[#151515] from-black">
          <div
            style={{
              opacity: isChanging ? 0.5 : 1,
              transition: "opacity 0.3s",
            }}
            className="flex items-center gap-2"
          >
            <div>
              <img
                src={playlist[currentSongIndex].img}
                className="w-14 h-14 rounded-xl"
              />
            </div>
            <div>
              <h4 className="text-xs text-gray-400">
                {playlist[currentSongIndex].author}
              </h4>
              <h1 className="font-semibold text-sm">
                {playlist[currentSongIndex].name}
              </h1>
              <div className="flex items-center gap-2">
                <div
                  onClick={handleSeekChange}
                  className="w-32 h-1 rounded-full relative overflow-hidden cursor-pointer bg-gray-500"
                >
                  <div
                    style={{
                      width: duration > 0 ? `${(currentTime / duration) * 100}%` : "1%",
                    }}
                    className="rounded-full bg-white h-1"
                  />
                </div>
                <h4 className="text-xs text-gray-400">
                  {formatTime(currentTime)}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                changeSong((currentSongIndex + 1) % playlist.length)
              }
              disabled={isChanging}
              style={{
                opacity: isChanging ? 0.5 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="w-3 h-3  active:opacity-70 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
              </svg>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isChanging}
              style={{
                opacity: isChanging ? 0.5 : 1,
                transition: "opacity 0.3s",
              }}
            >
              {isPlaying ? (
                <div className="bg-white   active:bg-opacity-70 active:scale-90 h-7 flex justify-center items-center w-7 rounded-full">
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    className="w-3 h-3 "
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                  </svg>
                </div>
              ) : (
                <div className="bg-white  active:bg-opacity-70 active:scale-90 h-7 flex justify-center items-center w-7 rounded-full">
                  <svg
                    data-encore-id="icon"
                    role="img"
                    aria-hidden="true"
                    className="w-3 h-3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                  </svg>
                </div>
              )}
            </button>
            <button
              onClick={() =>
                changeSong(
                  (currentSongIndex - 1 + playlist.length) % playlist.length
                )
              }
              disabled={isChanging}
              style={{
                opacity: isChanging ? 0.5 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="w-3 h-3  active:opacity-70 fill-current"
                viewBox="0 0 16 16"
              >
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
