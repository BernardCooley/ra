import type { NextPage } from "next";
import EventItem from "../../components/EventItem/EventItem";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { query, onSnapshot } from "firebase/firestore";
import { IEventItem } from "../../types";
import Header from "../../components/Header/Header";
import { eventsRef } from "../../firebase/firebaseRefs";
import { useScrollDirection } from "../../Hooks/useScrollDirection";

const Events: NextPage = () => {
    const { scrollPosition } = useScrollDirection();
    const [events, setEvents] = useState<IEventItem[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(eventsRef), (querySnapshot) => {
            const events = querySnapshot.docs.map((doc) => {
                return doc.data();
            }) as IEventItem[];

            setEvents(events);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <div className={`${styles.eventsContainer} pageContainer`}>
            <Header slide={scrollPosition > 80} />
            <div className={styles.eventsLabel}>{events?.length} events</div>
            {events?.map((event) => (
                <div key={event.href} className={styles.listItem}>
                    <EventItem event={event} />
                </div>
            ))}
        </div>
    );
};

export default Events;
