import React from "react";
import styles from "./styles.module.scss";
import Nav from "../Nav/Nav";

interface Props {
    slide: boolean;
}

const Header = ({ slide }: Props) => {
    return (
        <div
            className={`${styles.headerContainer} ${
                slide ? styles.slideUp : ""
            }`}
        >
            <Nav slide={slide} />
        </div>
    );
};

export default Header;
