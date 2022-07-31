import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

interface Props {
    docId: string;
    commentExists: boolean;
    itemComment?: string;
}

const AddComment = ({ docId, commentExists, itemComment }: Props) => {
    const textAreaRef = useRef(null);
    const [showTextBox, setShowTextBox] = useState<boolean>(false);
    const [comment, setComment] = useState<string | undefined>("");

    useEffect(() => {
        if (commentExists) {
            setComment(itemComment);
            setComment("");
            setComment(itemComment);
        }
    }, [showTextBox]);

    const updateDocument = async (documentId: string, data: any) => {
        const update = {
            comments: data,
        };
        try {
            const eventDoc = doc(db, "promoters", documentId);
            updateDoc(eventDoc, update).then(() => {
                console.log("Document saved successfully");
                setShowTextBox(false);
            });
        } catch (e) {
            console.log(`Error updating document ${documentId} ${e}`);
        }
    };

    const onTextAreaInput = () => {
        if (textAreaRef.current) {
            textAreaRef.current.parentNode.dataset.replicatedValue =
                textAreaRef.current.value;
        }
    };

    const onCommentButtonClick = () => {
        setShowTextBox(true);
    };

    return (
        <>
            {!showTextBox && (
                <button
                    className={`${styles.button} ${styles.addButton}`}
                    onClick={onCommentButtonClick}
                >
                    {commentExists ? (
                        <div>Edit comment</div>
                    ) : (
                        <div>Add comment</div>
                    )}
                </button>
            )}
            {showTextBox && (
                <dialog className={styles.addCommentContainer}>
                    <div className={styles.textBoxContainer}>
                        <div className={styles.growWrap}>
                            <textarea
                                name="text"
                                id="text"
                                onInput={onTextAreaInput}
                                ref={textAreaRef}
                                onChange={() =>
                                    setComment(
                                        textAreaRef.current
                                            ? textAreaRef.current.value
                                            : ""
                                    )
                                }
                                value={comment}
                            />
                        </div>
                        <button
                            className={`${styles.button} ${styles.formButton} ${styles.commentButton}`}
                            onClick={() => updateDocument(docId, comment)}
                            disabled={comment?.length === 0}
                        >
                            Save
                        </button>
                    </div>
                </dialog>
            )}
        </>
    );
};

AddComment.propTypes = {
    docId: PropTypes.string.isRequired,
    commentExists: PropTypes.bool.isRequired,
    itemComment: PropTypes.string,
};

export default AddComment;
