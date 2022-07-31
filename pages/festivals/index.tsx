import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import { query, onSnapshot } from "firebase/firestore";
import { IFestivalItem, IOrderBy } from "../../types";
import Header from "../../components/Header/Header";
import FestivalItem from "../../components/FestivalItem/FestivalItem";
import Filter from "../../components/Filter/Filter";
import { festivalsRef } from "../../firebase/firebaseRefs";
import OrderBy from "../../components/OrderBy/OrderBy";
import {
    festivalFilterContext,
    orderByContext,
} from "../../Contexts/AllContexts";
import { useScrollDirection } from "../../Hooks/useScrollDirection";
import { testFestivals } from "../test/data";

const Festivals: NextPage = () => {
    const { festivalFilters, setFestivalFilters } = useContext(
        festivalFilterContext
    );
    const { order, setOrder } = useContext(orderByContext);
    const [festivals, setFestivals] = useState<IFestivalItem[]>(testFestivals);
    const { scrollPosition } = useScrollDirection();

    useEffect(() => {
        const unsubscribe = onSnapshot(query(festivalsRef), (querySnapshot) => {
            const festivals = querySnapshot.docs.map((doc) => {
                return { docId: doc.id, festival: doc.data() };
            }) as IFestivalItem[];

            // setFestivals(festivals);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (orderFestivals(order, filterList()).length === 0) {
            setFestivalFilters([]);
        }
    }, [festivals]);

    const getAvailableFilters = () => {
        const available: string[] = [];
        const festivalFilters = ["reviewed", "interested", "comments"];

        festivalFilters.forEach((filter) => {
            const matching = festivals.filter((festival) => {
                return festival.festival[filter];
            });
            if (matching.length > 0) {
                available.push(filter);
            }
        });

        return available;
    };

    const filterList = (): IFestivalItem[] => {
        if (festivalFilters?.length === 0) {
            return festivals;
        }
        return festivals.filter((festival: IFestivalItem) => {
            if (
                festival.festival.reviewed &&
                festivalFilters.includes("reviewed")
            )
                return true;
            if (
                festival.festival.interested &&
                festivalFilters.includes("interested")
            )
                return true;
            if (
                festival.festival.comments &&
                festivalFilters.includes("comments")
            )
                return true;

            return false;
        });
    };

    const orderFestivals = function (
        order: IOrderBy,
        festivalList: IFestivalItem[]
    ): IFestivalItem[] {
        return festivalList.sort(function (a, b) {
            if (order.ascending) {
                if (a.festival[order.orderBy] < b.festival[order.orderBy]) {
                    return -1;
                } else if (a[order.orderBy] > b[order.orderBy]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a.festival[order.orderBy] > b.festival[order.orderBy]) {
                    return -1;
                } else if (a[order.orderBy] < b[order.orderBy]) {
                    return 0;
                } else {
                    return 1;
                }
            }
        });
    };

    return (
        <>
            <div className="pageContainer">
                <Header slide={scrollPosition > 80} />
                {festivals.length > 0 && getAvailableFilters().length > 0 && (
                    <div className={styles.sortAndOrderContainer}>
                        <Filter availableFilters={getAvailableFilters()} />
                        <OrderBy />
                    </div>
                )}

                <div className={styles.eventsLabel}>
                    {filterList()?.length} festivals
                </div>
                {orderFestivals(order, filterList())?.map((festival) => (
                    <div
                        key={festival.festival.title}
                        className={styles.listItem}
                    >
                        <FestivalItem festival={festival} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Festivals;
