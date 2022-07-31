import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface Props {
    slide: boolean;
}

const Nav = ({ slide }: Props) => {
    const router = useRouter();

    return (
        <nav className={styles.navContainer}>
            <ul className={`${styles.links} ${slide ? styles.slideUp : ""}`}>
                <li
                    className={`${
                        router.asPath === "/home" ? styles.selected : ""
                    }`}
                >
                    <a href="./home">Home</a>
                </li>
                <li
                    className={`${
                        router.asPath === "/events" ? styles.selected : ""
                    }`}
                >
                    <a href="./events">Events</a>
                </li>
                <li
                    className={`${
                        router.asPath === "/promoters" ? styles.selected : ""
                    }`}
                >
                    <a href="./promoters">Promoters</a>
                </li>
                <li
                    className={`${
                        router.asPath === "/festivals" ? styles.selected : ""
                    }`}
                >
                    <a href="./festivals">Festivals</a>
                </li>
            </ul>
        </nav>
    );
};

Nav.propTypes = {
    slide: PropTypes.bool.isRequired,
};

export default Nav;
