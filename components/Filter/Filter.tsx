import React, { useRef, useContext } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import Checkbox from "../Checkbox/Checkbox";
import { capitalizeFirstLetter } from "../../utils";
import { filterContext } from "../../Contexts/AllContexts";

interface Props {
    availableFilters: string[];
}

const Filter = ({ availableFilters }: Props) => {
    const { filters, setFilters } = useContext(filterContext);

    const usedFilters = [
        { name: "reviewed", ref: useRef(null) },
        { name: "interested", ref: useRef(null) },
        { name: "contacted", ref: useRef(null) },
        { name: "replied", ref: useRef(null) },
        { name: "comments", ref: useRef(null) },
        { name: "about", ref: useRef(null) },
    ];

    const checkboxOnChange = () => {
        const newFilter: string[] = [];

        usedFilters.forEach((filter) => {
            if (filter.ref.current && filter.ref.current.checked)
                newFilter.push(filter.name);
        });

        setFilters(newFilter);
    };

    return (
        <div className={styles.filterContainer}>
            <div className="orderFilterTitle">Filters</div>
            {filters.length > 0 && (
                <button
                    className={styles.clearButton}
                    onClick={() => setFilters([])}
                >
                    clear
                </button>
            )}
            <ul className={styles.list}>
                {usedFilters.map((filter) => (
                    <li key={filter.name}>
                        <Checkbox
                            onChange={checkboxOnChange}
                            label={capitalizeFirstLetter(filter.name)}
                            name={filter.name}
                            elementRef={filter.ref}
                            checkValue={filters?.includes(filter.name)}
                            disabled={!availableFilters.includes(filter.name)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

Filter.propTypes = {
    availableFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Filter;
