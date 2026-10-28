import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MoodLog.module.css";
import HeaderMoodLog from "./HeaderMoodLog.tsx";
import Sidebar from "./Sidebar.tsx";
import { constellationsByMonth } from "@/data/Constellations";
import ConstellationGraph from "./ConstellationGraph.tsx";
import { MONTHS } from "@/constants/months";

type Mood = {
  label: string;
  color: string;
};


type NodeMoods = Record<string, Mood>;
// type Journals = Record<string, string>;

export default function MoodLog() {
  const navigate = useNavigate();
  const { month } = useParams<{ month: string }>();
  const monthNumber = MONTHS.indexOf(month as typeof MONTHS[number]) + 1; // 월 이름을 숫자로 변환 (1~12)
  const data = constellationsByMonth[monthNumber]; 

  const [selectedNode, setSelectedNode] = useState<string>('');
  const [journals, setJournals] = useState<Record<string, string>>({}); // 노드별 일기 내용을 저장하는 상태
  const [nodeMoodsByMonth, setNodeMoodsByMonth] = useState<Record<number, NodeMoods>>({}); // 월별 노드 감정 상태를 저장하는 상태
  const nodeMoods = nodeMoodsByMonth[monthNumber] ?? {};


 
// noddeMoods -> ConstellationGraph가 받는 nodeColors 로 변환
  const nodeColors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(nodeMoods).map(([nodeId, mood]) => [nodeId, mood.color] )

      ),
    [nodeMoods]
  )

  // 사이드바에서 감정 상태를 업데이트하는 함수
  const handleSelectMood = (mood: Mood) => {
    if (!selectedNode) return;
      setNodeMoodsByMonth((prev) => ({
      ...prev,
      [monthNumber]: {
        ...(prev[monthNumber] ?? {}),
        [selectedNode]: mood
      },
    }));
    // api 호출
  };

  const handleSubmitJournal = (nodeId: string, journal: string) => {
    setJournals((prev) => ({
      ...prev,
      [nodeId] : journal,
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
          journals={journals}
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