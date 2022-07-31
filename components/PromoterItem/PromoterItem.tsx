import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { IPromoterItem } from "../../types";
import Checkbox from "../Checkbox/Checkbox";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import AddComment from "../AddComment/AddComment";

interface Props {
    promoter: IPromoterItem;
}

const PromoterItem = ({ promoter }: Props) => {
    const [clickedPromoter, setClickedPromoter] = useState("");
    const [clickedCheckbox, setClickedCheckbox] = useState("");
    const filters = ["reviewed", "interested", "contacted", "replied"];

    const updateDocument = async (documentId: string, data: any) => {
        try {
            const eventDoc = doc(db, "promoters", documentId);
            updateDoc(eventDoc, data).then(() => {
                setClickedPromoter("");
                setClickedCheckbox("");
            });
        } catch (e) {
            setClickedPromoter("");
            setClickedCheckbox("");
            console.log(`Error updating document ${documentId} ${e}`);
        }
    };

    const checkboxOnChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        await updateDocument(promoter.docId, {
            [event.target.name]: event.target.checked,
        });
    };

    const onCheckboxClick = (promoterName: string, checkboxName: string) => {
        setClickedCheckbox(checkboxName);
        setClickedPromoter(promoterName);
    };

    const shouldDisable = (promoter: string, checkbox: string) => {
        return clickedPromoter === promoter && clickedCheckbox === checkbox;
    };

    return (
        <>
            <div className={`${styles.promoterItemContainer} blur`}>
                <ul className={styles.list}>
                    <li>
                        <div className={styles.title}>Name</div>
                        <a
                            href={promoter.promoter.raUrl}
                            key={`${promoter.promoter.name}-${promoter.promoter.raUrl}`}
                            rel="noreferrer"
                            target="_blank"
                        >
                            {promoter.promoter.name}
                        </a>
                    </li>
                    <li>
                        <div className={styles.title}>Location</div>
                        <div className={styles.staticElement}>
                            {promoter.promoter.region}
                        </div>
                    </li>
                    <li>
                        <div className={styles.title}>Links</div>
                        <div className={styles.linksContainer}>
                            {promoter.promoter.links.map((link) => (
                                <a
                                    href={link.url}
                                    key={`${link.name}-${promoter.promoter.name}`}
                                    rel="noreferrer"
                                    target="_blank"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </li>
                    <li>
                        <div className={styles.title}>Events</div>
                        <div className={styles.staticElement}>
                            {promoter.promoter.events}
                        </div>
                    </li>
                    <li>
                        <div className={styles.title}>Followers</div>
                        <div className={styles.staticElement}>
                            {promoter.promoter.followers}
                        </div>
                    </li>
                    <li className={styles.checkboxContainer}>
                        {filters.map((filter) => (
                            <Checkbox
                                key={filter}
                                onChange={(event) => checkboxOnChange(event)}
                                label={filter}
                                name={filter}
                                checkValue={promoter.promoter[filter] | 0}
                                onClick={() =>
                                    onCheckboxClick(
                                        promoter.promoter.name,
                                        filter
                                    )
                                }
                                disabled={shouldDisable(
                                    promoter.promoter.name,
                                    filter
                                )}
                            />
                        ))}
                    </li>
                    <li>
                        <div className={styles.title}>Actions</div>
                        <div className={styles.commentButtons}>
                            <AddComment
                                docId={promoter.docId}
                                commentExists={
                                    promoter.promoter.comments ? true : false
                                }
                                itemComment={promoter.promoter.comments}
                            />
                            <AddComment
                                docId={promoter.docId}
                                commentExists={
                                    promoter.promoter.comments ? true : false
                                }
                                itemComment={promoter.promoter.comments}
                            />
                            <AddComment
                                docId={promoter.docId}
                                commentExists={
                                    promoter.promoter.comments ? true : false
                                }
                                itemComment={promoter.promoter.comments}
                            />
                            <AddComment
                                docId={promoter.docId}
                                commentExists={
                                    promoter.promoter.comments ? true : false
                                }
                                itemComment={promoter.promoter.comments}
                            />
                        </div>
                    </li>
                </ul>

                {promoter.promoter.about && promoter.promoter.about !== "none" && (
                    <div className={styles.infoSection}>
                        <div className={styles.title}>About</div>
                        <div className={styles.staticElement}>
                            {promoter.promoter.about}
                        </div>
                    </div>
                )}

                {promoter.promoter.comments && (
                    <div className={styles.infoSection}>
                        <div className={styles.title}>Comments</div>
                        <div className={styles.staticElement}>
                            {promoter.promoter.comments}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

PromoterItem.propTypes = {
    promoter: PropTypes.shape({
        docId: PropTypes.string.isRequired,
        promoter: PropTypes.shape({
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

export default PromoterItem;
