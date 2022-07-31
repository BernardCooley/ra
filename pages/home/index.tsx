import type { NextPage } from "next";
import styles from "./styles.module.scss";
import Header from "../../components/Header/Header";
import Scrape from "../../components/Scrape/Scrape";
import { useScrollDirection } from "../../Hooks/useScrollDirection";

const Home: NextPage = () => {
    const { scrollPosition } = useScrollDirection();

    return (
        <div className="pageContainer">
            <Header slide={scrollPosition > 80} />
            <Scrape />
        </div>
    );
};

export default Home;
