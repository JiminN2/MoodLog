import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import Introduction from "./components/Introduction";
import MoodLog from "./components/MoodLog/MoodLog";
import MainLayout from "./Layout";
import IntroductionBg from "./components/IntroductionBg.tsx";

function BgLayout() {
  const {pathname} = useLocation();
  const locked = pathname.startsWith("/mood-log/") ? 0.85 : undefined;
  return (
    <>
     <IntroductionBg lockedProgress={locked} />
     <Outlet />
    </>
  )
}


function App() {
  return (
    
    
        <Routes>
          <Route element={<BgLayout />} >
          <Route element={<MainLayout />} >
            <Route
              path="/"
              element={<Introduction />}
            />
            <Route
              path="/introduction"
              element={<Introduction />}
            />
          </Route>
         

          <Route path="/mood-log" element={<Introduction />} />
          <Route path="/mood-log/:year/:month" element={<MoodLog />} />
          </Route>
        </Routes>

  );
}

export default App;
