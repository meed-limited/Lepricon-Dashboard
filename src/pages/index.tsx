import { Inter } from "@next/font/google";
import { Home } from "../components/templates/home";
import { NextPage } from "next";
import { Default } from "../components/layouts";

const inter = Inter({ subsets: ["latin"] });

const HomePage: NextPage = () => {
    return (
        <div className={inter.className}>
            <Default pageName="Home">
                <Home />
            </Default>
        </div>
    );
};

export default HomePage;
