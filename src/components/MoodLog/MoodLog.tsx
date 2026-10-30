import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styles from "./MoodLog.module.css";
import HeaderMoodLog from "./HeaderMoodLog.tsx";
import Sidebar from "./Sidebar.tsx";
import { constellationsByMonth } from "@/data/Constellations";
import ConstellationGraph from "./ConstellationGraph.tsx";

type Mood = {
  label: string;
  color: string;
};


type NodeMoods = Record<string, Mood>;
// type Journals = Record<string, string>;

export default function MoodLog() {
  const navigate = useNavigate();
  const { year, month } = useParams<{ year: string; month: string }>();

  const yearNumber = Number(year); 
  const monthNumber = Number(month);
  const isValid = 
   Number.isInteger(yearNumber) && Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12;
  const periodKey = `${yearNumber}-${monthNumber}`;


  const data = constellationsByMonth[monthNumber]; 

  const [selectedNode, setSelectedNode] = useState<string>('');
  const [journals, setJournals] = useState<Record<string, string>>({}); // 노드별 일기 내용을 저장하는 상태
  const [nodeMoodsByMonth, setNodeMoodsByMonth] = useState<Record<string, NodeMoods>>({}); // 월별 노드 감정 상태를 저장하는 상태
  const nodeMoods = nodeMoodsByMonth[periodKey] ?? {};


 
// noddeMoods -> ConstellationGraph가 받는 nodeColors 로 변환
  const nodeColors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nodeMoods).map(([nodeId, mood]) => [nodeId, mood.color] )

      ),
    [nodeMoods]
  )

    const journalsForPeriod = useMemo(() => {
    const prefix = `${periodKey}:`;
    return Object.fromEntries(
      Object.entries(journals)
        .filter(([key]) => key.startsWith(prefix))
        .map(([key, value]) => [key.slice(prefix.length), value])
    );
  }, [journals, periodKey]);


  if (!isValid) {
    return <Navigate to="/moodlog" replace />;
  }


  // 사이드바에서 감정 상태를 업데이트하는 함수
  const handleSelectMood = (mood: Mood) => {
    if (!selectedNode) return;
      setNodeMoodsByMonth((prev) => ({
      ...prev,
      [periodKey]: {
        ...(prev[periodKey] ?? {}),
        [selectedNode]: mood
      },
    }));
    // api 호출
  };

  const handleSubmitJournal = (nodeId: string, journal: string) => {
    setJournals((prev) => ({
      ...prev,
      [`${periodKey}:${nodeId}`] : journal,
    }));

    console.log("저장된 노드", nodeId);
    console.log("저장된 일기", journal);
  }

   if (!data) {
    return <div>해당 월의 별자리 데이터가 없어요</div>;
  }

  
  return (
    <div className={styles.Container} >
      <HeaderMoodLog />
      <div className={styles.wrapper}>
        <div className={styles.cy} >
        <ConstellationGraph
          data={data}
          nodeColors={nodeColors}
          onNodeTap={setSelectedNode}
        />
        </div>      
        <Sidebar 
          selectedNode={selectedNode} 
          journals={journalsForPeriod}
          onSelectMood = {handleSelectMood}
          onSubmit={handleSubmitJournal}
        />
        <button
          type="button"
          className={styles.backButton}
          aria-label="Go to previous page"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        
      </div>
    </div>
    
  );
}