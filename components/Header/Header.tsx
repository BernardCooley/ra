import React, { useContext } from "react";
import styles from "./styles.module.scss";
import Nav from "../Nav/Nav";
import { navContext } from "../../Contexts/AllContexts";

interface Props {
    slide: boolean;
}

const Header = ({ slide }: Props) => {
    const { nav } = useContext(navContext);

    return (
        <>
            <div
                className={`${styles.headerContainer} ${
                    nav.navOpen ? styles.openNav : ""
                } ${slide ? styles.slideUp : ""}`}
            >
                <Nav slide={slide} />
            </div>
        </>
    );
};

export default Header;
