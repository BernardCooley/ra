import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

interface Props {
    message: string;
}

const Loader = ({ message }: Props) => {
    return <div className={styles.loaderContainer}>{message}</div>;
};

Loader.propTypes = {
    message: PropTypes.string.isRequired,
};

export default Loader;
