import { useNavigate } from "react-router-dom";
import styles from "./LogNowButton.module.css";


export default function LogNowButton() {
    const navigate = useNavigate();

const goToThisMonth = () => {
  const now = new Date();
  navigate(`/mood-log/${now.getFullYear()}/${now.getMonth() + 1}`);
};

    return(
        
        <button className={styles.button} type="button" onClick={goToThisMonth}>Log now</button>

    )
    
}
