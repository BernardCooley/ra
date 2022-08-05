import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";
import { navContext } from "../../Contexts/AllContexts";
import Image from "next/image";
import MenuIcon from "../../public/assets/icons/menu.png";
import CloseIcon from "../../public/assets/icons/close.png";

interface Props {
    slide: boolean;
}

const Nav = ({ slide }: Props) => {
    const { nav, setNav } = useContext(navContext);
    const router = useRouter();

    const toggleNav = () => {
        setNav({ navOpen: !nav.navOpen });
    };

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
            <div
                className={`${styles.closeButton} ${
                    nav.navOpen ? styles.navOpen : ""
                }`}
            >
                <Image
                    onClick={toggleNav}
                    width={50}
                    height={50}
                    src={nav.navOpen ? CloseIcon : MenuIcon}
                    alt=""
                    color="white"
                />
            </div>
        </nav>
    );
};

Nav.propTypes = {
    slide: PropTypes.bool.isRequired,
};

export default Nav;
