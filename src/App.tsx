import { Route, Routes, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Explore from "./components/NasaToday";
import Introduction from "./components/Introduction";
import MoodLog from "./components/MoodLog/MoodLog";
import MainLayout from "./Layout";



type Track = {
  label: string;
  file: string;
};

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
        </Routes>

  );
}

export default App;

