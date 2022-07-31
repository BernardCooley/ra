import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    name: string;
    checkValue?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    elementRef?: React.MutableRefObject<null>;
}

const Checkbox = ({
    onChange,
    label,
    name,
    checkValue,
    onClick,
    disabled,
    elementRef,
}: Props) => {
    return (
        <label className={styles.formControl}>
            <input
                className={styles.checkbox}
                type="checkbox"
                name={name}
                onChange={(event) => onChange(event)}
                checked={checkValue}
                onClick={onClick}
                disabled={disabled}
                ref={elementRef}
            />
            {label}
        </label>
    );
};

Checkbox.propTypes = {
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checkValue: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    elementRef: PropTypes.object,
};

export default Checkbox;
