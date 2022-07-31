import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

interface Props {
    hide: boolean;
}

const BackToTop = ({ hide }: Props) => {
    const backToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`${styles.backToTopContainer} ${
                hide ? styles.hidden : ""
            }`}
        >
            <button onClick={backToTop}>Top</button>
        </div>
    );
};

BackToTop.propTypes = {
    hide: PropTypes.bool.isRequired,
};

export default BackToTop;
