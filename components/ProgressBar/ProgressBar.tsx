import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

interface Props {
    progress: number;
    currentlyFetching: string;
}

const ProgressBar = ({ progress, currentlyFetching }: Props) => {
    const [gradient, setGradient] = useState(
        `linear-gradient(to right, green ${progress}%, white 0%)`
    );

    useEffect(() => {
        setGradient(
            `linear-gradient(to right, #f7f7ffd1 ${progress}%, #00000036 0%)`
        );
    }, [progress]);

    return (
        <div className={styles.progressBarContainer}>
            <div
                className={styles.progressBar}
                style={{ background: gradient }}
            ></div>
            <div className={styles.label}>Fetching...</div>
            <div className={styles.label}>{currentlyFetching}</div>
        </div>
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number.isRequired,
    currentlyFetching: PropTypes.string.isRequired,
};

export default ProgressBar;
