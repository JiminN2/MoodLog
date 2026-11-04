import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import Header from "./components/Header";

export default function MainLayout() {
    return (
        <>
         <Header />
         <div className={styles.container}>
            <Outlet />
         </div>
        </>
    );
}
 
