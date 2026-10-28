import styles from './Months.module.css';
import { useNavigate } from 'react-router-dom';
import { MONTHS } from '@/constants/months';


export default function Months() {
    const navigate = useNavigate();

    return(
        <div className={styles.months}>
            <h2 className={styles.title}>Months</h2>
            <ul className={styles.monthList}>
                {MONTHS.map((month) => {
                    return (
                        <li 
                            key={month} 
                            className={styles.month}
                            onClick={() => navigate(`/mood-log/${month}`)}
                        >
                            {month.charAt(0).toUpperCase() + month.slice(1)}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
};

 