import React from "react";
import PropTypes from "prop-types";

interface Props {
    lineup: string;
}

const Lineup = ({ lineup }: Props) => {
    const splitLineup = lineup.split(",");

    return (
        <div className="Lineup">
            {splitLineup.map((artist) => (
                <div key={artist}>{artist}</div>
            ))}
        </div>
    );
};

Lineup.propTypes = {
    lineup: PropTypes.string.isRequired,
};

export default Lineup;
