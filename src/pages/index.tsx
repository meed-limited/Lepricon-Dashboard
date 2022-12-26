import { Home } from "../components/templates/home";
import { NextPage } from "next";
import { Default } from "../components/layouts";

const HomePage: NextPage = () => {
    return (
        <Default pageName="Home">
            <Home />
        </Default>
    );
};

export default HomePage;
