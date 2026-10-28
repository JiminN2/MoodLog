import styles from "./Sidebar.module.css";
import MoodSelector from "./MoodSelector.tsx";
import { useState } from "react";

type Mood = {
  label: string;
  color: string;
};

type SidebarProps = {
  selectedNode: string;
  journals: Record<string, string>;
  onSelectMood: (mood: Mood) => void;
  onSubmit: (nodeId: string, journal: string) => void;
};




export default function Sidebar({ selectedNode, journals, onSelectMood, onSubmit}: SidebarProps) {
  const [journal, setJournal] = useState("");
  const [aiEmotion, setAiEmotion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const handleSubmit = async () => {
    console.log("감정:", selectedNode);
    console.log("일기:", journal);
    if (!journal) return;

    onSubmit(selectedNode, journal);
    setIsLoading(true);
    setAiEmotion(null);

    try {  
      const response = await fetch("http://localhost:3001/api/analyze-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          journal,
        }),
      });

      if (!response.ok) {
        throw new Error("AI 분석 요청에 실패했다");
      }

      const data = await response.json();
      console.log("AI emotion:", data.emotion);
      setAiEmotion(data.emotion);
    } catch (error) {
      console.error("AI 분석 실패:", error);
      setAiEmotion("AI 분석에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedNode) return null;

  
  return (
    <aside className={styles.sidebar}>
      
      <div className={styles.sidebarContainer}>
        <p>Selected Node: {selectedNode}</p>
        <MoodSelector onSelectMood={onSelectMood} />
        <h2>Explore why you might be feeling this way</h2>
        <textarea
         className={styles.textarea}
         placeholder="Write your journal entry here..."
         value={journal}
         onChange={(e) => setJournal(e.target.value)}
         />
        <button 
        type="button"
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isLoading}
        >
        {isLoading ? "Analyzing..." : "Submit"}
      </button>
      {aiEmotion && (
          <p className={styles.aiEmotion}>
            How AI analyzed your feeling : {aiEmotion}
          </p>
        )}
     </div>
     
    </aside>
  );
}
  
