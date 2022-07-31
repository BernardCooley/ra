import { collection, doc } from "firebase/firestore";
import { db } from "./clientApp";

export const promotersRef = collection(db, "promoters");
export const eventsRef = collection(db, "events");
export const requestsRef = collection(db, "requests");
export const festivalsRef = collection(db, "festivals");
