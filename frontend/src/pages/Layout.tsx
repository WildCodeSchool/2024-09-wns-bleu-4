import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
import AnimatedDiv from "../components/background/AnimateBG";

const Layout = () => {
    return (
        <div className="body">
            <AnimatedDiv
                className={"yellow"}
            />
            <AnimatedDiv 
                className={"orange"}
            />
            <div className="blur"></div>
            <Header />
            <Sidebar />
            <main >
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;