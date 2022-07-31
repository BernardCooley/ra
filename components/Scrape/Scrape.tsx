import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import { query, onSnapshot } from "firebase/firestore";
import { IEventItem, IPromoterItem } from "../../types";
import ProgressBar from "../ProgressBar/ProgressBar";
import {
    eventsRef,
    promotersRef,
    requestsRef,
    festivalsRef,
} from "../../firebase/firebaseRefs";
import {
    getDocumentsWhere,
    addDocument,
    updateDocument,
    getFieldFromFirstDocument,
} from "../../firebase/functions";
import { promotersContext } from "../../Contexts/AllContexts";
import { removeDuplicates } from "../../utils";

const Scrape = () => {
    const { promoters, setPromoters } = useContext(promotersContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastUpdate, setLastUpdate] = useState({});
    const currentDate = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const [progress, setProgress] = useState<number>(0);
    const [currentlyFetching, setcurrentlyFetching] = useState<string>("");
    const [eventsToScrape, setEventsToScrape] = useState<boolean>(false);
    const [events, setEvents] = useState<IEventItem[]>();

    useEffect(() => {
        const unsubscribeEvents = onSnapshot(
            query(eventsRef),
            (querySnapshot) => {
                const events = querySnapshot.docs.map((doc) => {
                    return { docId: doc.id, event: doc.data() };
                }) as IEventItem[];

                setEvents(events);
            }
        );

        const unsubscribePromoters = onSnapshot(
            query(promotersRef),
            (querySnapshot) => {
                const promoters = querySnapshot.docs.map((doc) => {
                    return { docId: doc.id, promoter: doc.data() };
                }) as IPromoterItem[];

                setPromoters(promoters);
            }
        );

        getFieldFromFirstDocument(requestsRef, 0, "lastUpdate").then((data) => {
            setLastUpdate(data);
        });

        return () => {
            unsubscribeEvents();
            unsubscribePromoters();
        };
    }, []);

    useEffect(() => {
        isEventsToScrape();
    }, [events]);

    const isEventsToScrape = async () => {
        let validEvents = [];

        if (events) {
            validEvents = events?.filter((event) => {
                return event.event?.promoter === "";
            });
        }

        setEventsToScrape(validEvents.length > 0);
    };

    const postData = async (doc: IEventItem) => {
        const eventResponse = await getDocumentsWhere(
            eventsRef,
            "href",
            "==",
            doc.href
        );

        if (eventResponse?.docs.length === 0) {
            addDocument(eventsRef, doc);
        } else {
            console.log("Events document already exists");
        }
    };

    const getRAPromoters = async (url: string) => {
        try {
            const response = await fetch(`api/getPromoters?raUrl=${url}`);
            return await response.json();
        } catch (e) {
            console.error(`Error scraping promoters ${e}`);
        }
        return null;
    };

    const getRAPromotersSingleElement = async (url: string) => {
        try {
            const response = await fetch(`api/updatePromoters?raUrl=${url}`);
            return await response.json();
        } catch (e) {
            console.error(`Error scraping promoters ${e}`);
        }
        return null;
    };

    const scrapeFestivals = async (url: string) => {
        setLoading(true);

        try {
            const response = await fetch(`api/getFestivalUrls?raUrl=${url}`);
            const festivalUrls = await response.json();
            const uniqueUrls = removeDuplicates(festivalUrls, "url");

            for (const festival of uniqueUrls) {
                if (festival) {
                    setProgress(
                        (uniqueUrls?.indexOf(festival) / uniqueUrls.length) *
                            100
                    );

                    setcurrentlyFetching(
                        `Festival details from ${
                            festival.title
                        } (${uniqueUrls?.indexOf(festival)} of ${
                            uniqueUrls.length
                        })`
                    );
                }

                const festivalResponse = await getDocumentsWhere(
                    festivalsRef,
                    "url",
                    "==",
                    festival.url
                );
                if (festivalResponse?.docs.length === 0) {
                    const response = await fetch(
                        `api/getFestival?raUrl=${festival.url}`
                    );
                    const festivalDetails = await response.json();

                    festivalDetails["url"] = festival.url;

                    addDocument(festivalsRef, festivalDetails);
                }
            }

            setLoading(false);
        } catch (e) {
            console.error(`Error scraping promoters ${e}`);
        }

        setLoading(false);

        return null;
    };

    const scrapeEvents = async () => {
        setLoading(true);
        const currentDate = new Date();
        const currentDate2 = new Date();
        const sevenDaysFromNow = currentDate2.setDate(
            currentDate2.getDate() + 7
        );

        const urls = [
            `https://ra.co/events/uk/london?week=${
                currentDate.toISOString().split("T")[0]
            }`,
            `https://ra.co/events/uk/london?week=${
                new Date(sevenDaysFromNow).toISOString().split("T")[0]
            }`,
        ];

        const jsonResponses = [];

        let response = await fetch(`api/getEvents?raUrl=${urls[0]}`);
        let jsonResponse = await response.json();
        jsonResponses.push(...jsonResponse);

        response = await fetch(`api/getEvents?raUrl=${urls[1]}`);
        jsonResponse = await response.json();
        jsonResponses.push(...jsonResponse);

        jsonResponses.forEach((element: IEventItem) => {
            postData(element);
        });
        updateDocument("requests", "t8sMj0VpN8Prt6yLec9a", {
            lastUpdate: new Date(),
        });
        setLoading(false);
    };

    const scrapePromoters = async () => {
        setLoading(true);

        for (const event of events as IEventItem[]) {
            if (events) {
                setProgress((events?.indexOf(event) / events.length) * 100);
            }

            if (event.event.promoter == "") {
                const raPromoterDetails = await getRAPromoters(
                    event.event.href
                );
                if (raPromoterDetails) {
                    const promoterResponse = await getDocumentsWhere(
                        promotersRef,
                        "name",
                        "==",
                        raPromoterDetails.name
                    );
                    if (promoterResponse?.docs.length === 0) {
                        await addDocument(promotersRef, raPromoterDetails);
                        await updateDocument("events", event.id, {
                            promoter: raPromoterDetails.name,
                        });
                    } else {
                        await updateDocument("events", event.id, {
                            promoter: raPromoterDetails.name,
                        });
                        console.log("Promter document already exists");
                    }
                } else {
                    await updateDocument("events", event.id, {
                        promoter: "none",
                    });
                }
            }
        }

        setLoading(false);
    };

    const updatePromoters = async () => {
        setLoading(true);

        for (const promoter of promoters) {
            setcurrentlyFetching(
                `Info from ${promoter.promoter.name} (${promoters?.indexOf(
                    promoter
                )} of ${promoters.length})`
            );

            if (!promoter.promoter.followers) {
                console.log(`getting info from ${promoter.promoter.name}`);

                if (promoters) {
                    setProgress(
                        (promoters?.indexOf(promoter) / promoters.length) * 100
                    );
                }

                const raPromoterDetails = await getRAPromotersSingleElement(
                    promoter.promoter.raUrl
                );

                updateDocument("promoters", promoter.docId, {
                    followers: raPromoterDetails ? raPromoterDetails : 0,
                });
            }
        }

        setLoading(false);
    };

    const getFestivals = async () => {
        await scrapeFestivals("https://ra.co/festivals/uk");
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <button
                    disabled={
                        lastUpdate < currentDate.getTime() / 1000 || loading
                    }
                    className={styles.scrapeButton}
                    onClick={scrapeEvents}
                >
                    Scrape events
                </button>
                <button
                    className={styles.scrapeButton}
                    onClick={scrapePromoters}
                    disabled={loading || !eventsToScrape}
                >
                    Scrape promoters
                </button>
                <button
                    className={styles.scrapeButton}
                    onClick={updatePromoters}
                    disabled={loading}
                >
                    Update promoters
                </button>
                <button
                    className={styles.scrapeButton}
                    onClick={getFestivals}
                    disabled={loading}
                >
                    Scrape festivals
                </button>
            </div>

            {loading && (
                <ProgressBar
                    progress={progress}
                    currentlyFetching={currentlyFetching}
                />
            )}
        </div>
    );
};

export default Scrape;
