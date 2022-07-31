import {
    CollectionReference,
    DocumentData,
    getDocs,
    query,
    where,
    WhereFilterOp,
    addDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./clientApp";

export const getFieldFromFirstDocument = async (
    collectionRef: CollectionReference<DocumentData>,
    docNumber: number,
    fieldName: string
) => {
    try {
        const docSnap = await getDocs(collectionRef);
        return docSnap.docs[docNumber].data()[fieldName].seconds;
    } catch (e) {
        console.log(`Error fetching last updated ${e}`);
    }
};

export const getDocumentsWhere = async (
    collectionRef: CollectionReference<DocumentData>,
    getBy: string,
    operator: WhereFilterOp,
    name: string
) => {
    try {
        const response = query(collectionRef, where(getBy, operator, name));
        return await getDocs(response);
    } catch (e) {
        console.log(`Error getting docs where ${getBy} is ${name} ${e}`);
    }
    return null;
};

export const addDocument = async (
    collectionRef: CollectionReference<DocumentData>,
    data: any
) => {
    try {
        const docRef = await addDoc(collectionRef, data);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateDocument = async (
    collectionName: string,
    documentId: string,
    data: any
) => {
    try {
        const eventDoc = doc(db, collectionName, documentId);
        await updateDoc(eventDoc, data);
    } catch (e) {
        console.log(
            `Error updating document ${documentId} in ${collectionName} ${e}`
        );
    }
};
