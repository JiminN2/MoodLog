import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import Header from "./components/Header";

export default function MainLayout({onTrackPlay} : { onTrackPlay : (index: number) => void }) {
    return (
        <>
         <Header onTrackPlay={onTrackPlay} />
         <div className={styles.container}>
            <Outlet />
         </div>
        </>
    );
}
 

