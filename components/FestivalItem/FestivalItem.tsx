import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { IFestivalItem } from "../../types";
import Checkbox from "../Checkbox/Checkbox";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import AddComment from "../AddComment/AddComment";

interface Props {
    festival: IFestivalItem;
}

const FestivalItem = ({ festival }: Props) => {
    const [clickedFestival, setClickedFestival] = useState("");
    const [clickedCheckbox, setClickedCheckbox] = useState("");
    const filters = [
        "reviewed",
        "interested",
        "not interested",
        "contacted",
        "replied",
    ];

    const updateDocument = async (documentId: string, data: any) => {
        try {
            const eventDoc = doc(db, "festivals", documentId);
            updateDoc(eventDoc, data).then(() => {
                setClickedFestival("");
                setClickedCheckbox("");
            });
        } catch (e) {
            setClickedFestival("");
            setClickedCheckbox("");
            console.log(`Error updating document ${documentId} ${e}`);
        }
    };

    const checkboxOnChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        await updateDocument(festival.docId, {
            [event.target.name]: event.target.checked,
        });
    };

    const onCheckboxClick = (festivalName: string, checkboxName: string) => {
        setClickedCheckbox(checkboxName);
        setClickedFestival(festivalName);
    };

    const shouldDisable = (festival: string, checkbox: string) => {
        return clickedFestival === festival && clickedCheckbox === checkbox;
    };

    return (
        <>
            <div className={`${styles.festivalItemContainer} blur`}>
                <ul className={styles.list}>
                    <li>
                        <div className={styles.title}>Title</div>
                        <a
                            href={festival.festival.url}
                            key={`${festival.festival.title}-${festival.festival.url}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {festival.festival.title}
                        </a>
                    </li>
                    <li>
                        <div className={styles.title}>Location</div>
                        <div>{festival.festival.venue.address}</div>
                    </li>
                    <li>
                        <div className={styles.title}>Lineup</div>
                        <div className={`${styles.lineup}`}>
                            {festival.festival.lineup.map((artist) => (
                                <div key={artist}>{artist}</div>
                            ))}
                        </div>
                    </li>
                    <li>
                        <div className={styles.title}>Addending</div>
                        <div className={styles.staticElement}>
                            {festival.festival.attending}
                        </div>
                    </li>
                    <li className={styles.checkboxContainer}>
                        {filters.map((filter) => (
                            <Checkbox
                                key={filter}
                                onChange={(event) => checkboxOnChange(event)}
                                label={filter}
                                name={filter}
                                checkValue={festival.festival[filter] | 0}
                                onClick={() =>
                                    onCheckboxClick(
                                        festival.festival.title,
                                        filter
                                    )
                                }
                                disabled={shouldDisable(
                                    festival.festival.title,
                                    filter
                                )}
                            />
                        ))}
                    </li>
                    <li>
                        <div className={styles.title}>Actions</div>
                        <div className={styles.commentButtons}>
                            <AddComment
                                docId={festival.docId}
                                commentExists={
                                    festival.festival.comments ? true : false
                                }
                                itemComment={festival.festival.comments}
                            />
                            <AddComment
                                docId={festival.docId}
                                commentExists={
                                    festival.festival.comments ? true : false
                                }
                                itemComment={festival.festival.comments}
                            />
                            <AddComment
                                docId={festival.docId}
                                commentExists={
                                    festival.festival.comments ? true : false
                                }
                                itemComment={festival.festival.comments}
                            />
                            <AddComment
                                docId={festival.docId}
                                commentExists={
                                    festival.festival.comments ? true : false
                                }
                                itemComment={festival.festival.comments}
                            />
                        </div>
                    </li>
                </ul>

                {festival.festival.description &&
                    festival.festival.description !== "none" && (
                        <div className={styles.infoSection}>
                            <div className={styles.title}>Description</div>
                            <div>{festival.festival.description}</div>
                        </div>
                    )}

                {festival.festival.comments && (
                    <div className={styles.infoSection}>
                        <div className={styles.title}>Comments</div>
                        <div>{festival.festival.comments}</div>
                    </div>
                )}
            </div>
        </>
    );
};

FestivalItem.propTypes = {
    festival: PropTypes.shape({
        docId: PropTypes.string.isRequired,
        festival: PropTypes.shape({
            name: PropTypes.string.isRequired,
            links: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string,
                    url: PropTypes.string.isRequired,
                })
            ),
            events: PropTypes.number.isRequired,
            region: PropTypes.string.isRequired,
            raUrl: PropTypes.string.isRequired,
            comments: PropTypes.string,
            interested: PropTypes.bool,
            reviewed: PropTypes.bool,
            contacted: PropTypes.bool,
            replied: PropTypes.bool,
            about: PropTypes.string,
            followers: PropTypes.number,
        }),
    }).isRequired,
};

export default FestivalItem;
