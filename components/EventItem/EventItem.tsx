import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { IEventItem } from "../../types";
import Lineup from "../Lineup/Lineup";

interface Props {
    event: IEventItem;
}

const EventItem = ({ event }: Props) => {
    return (
        <div className={styles.eventItemContainer}>
            <div className={styles.title}>
                <strong>Title: </strong>
                <span>{event.title}</span>
            </div>
            <div className={styles.promoter}>
                <strong>Promoter: </strong>
                <span>{event.promoter}</span>
            </div>
            <div className={styles.lineup}>
                <strong>Lineup: </strong>
                <Lineup
                    lineup={
                        !event.lineup.includes("Tickets") ? event.lineup : ""
                    }
                />
            </div>
            <div className={styles.link}>
                <a href={event.href} rel="noreferrer" target="_blank">
                    RA event
                </a>
            </div>
        </div>
    );
};

EventItem.propTypes = {
    event: PropTypes.shape({
        docId: PropTypes.string.isRequired,
        event: PropTypes.shape({
            title: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
            promoter: PropTypes.string.isRequired,
            lineup: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default EventItem;
