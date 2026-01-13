import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = ({navigate }: {navigate: (to: string) => void }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar navigate={navigate}/>
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
