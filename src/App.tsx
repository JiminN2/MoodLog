import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Explore from "./components/NasaToday";
import Introduction from "./components/Introduction";
import MoodLog from "./components/MoodLog/MoodLog";
import MainLayout from "./Layout";
import IntroductionBg from "./components/IntroductionBg.tsx";



type Track = {
  label: string;
  file: string;
};


function BgLayout({ isPlaying }: { isPlaying: boolean }) {
  const {pathname} = useLocation();
  const showBg = pathname !== "/explore";
  const locked = pathname.startsWith("/mood-log/") ? 0.85 : undefined;
  return (
    <>
     {showBg && <IntroductionBg isPlaying={isPlaying} lockedProgress={locked} />}
     <Outlet />
    </>
  )
}


function App() {
  const navigate = useNavigate();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tracks = useMemo<Track[]>(
    () => [
      { label: "Track 1 — Introduction", file: "introduction" },
      { label: "Track 2 — Orbit", file: "orbit" },
      { label: "Track 3 — Atmosphere", file: "atmosphere" },
      { label: "Track 4 — Oceans", file: "oceans" },
      { label: "Track 5 — Surface", file: "surface" },
    ],
    []
  );

  const activeTrack = currentTrackIndex !== null ? tracks[currentTrackIndex] : null;
  const hasNextTrack = currentTrackIndex !== null && currentTrackIndex + 1 < tracks.length;

  const handleTrackPlay = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    navigate("/introduction");
  };

  const handleTogglePlay = () => {
    if (!activeTrack) return;
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    if (currentTrackIndex === null || currentTrackIndex + 1 >= tracks.length) return;
    setCurrentTrackIndex(currentTrackIndex + 1);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
  };

  const introProps = {
    activeTrack,
    isPlaying,
    hasNextTrack,
    onTogglePlay: handleTogglePlay,
    onNextTrack: handleNextTrack,
    onTrackEnd: handleTrackEnd,
  }


  return (
    
    
        <Routes>
          <Route element={<BgLayout isPlaying={isPlaying} />} >
          <Route element={<MainLayout onTrackPlay={handleTrackPlay} />} >
            <Route
              path="/"
              element={
                <Introduction {...introProps} />
              }
            />
            <Route
              path="/introduction"
              element={
                <Introduction {...introProps} />
              }
            />
            <Route path="/explore" element={<Explore />} />
          </Route>
         

          <Route path="/mood-log" element={<Introduction {...introProps} />} />
          <Route path="/mood-log/:year/:month" element={<MoodLog />} />
          </Route>
        </Routes>

  );
}

export default App;

