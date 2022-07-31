import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { useContext, useEffect, useState } from "react";
import { query, onSnapshot } from "firebase/firestore";
import { IOrderBy, IPromoterItem } from "../../types";
import Header from "../../components/Header/Header";
import PromoterItem from "../../components/PromoterItem/PromoterItem";
import Filter from "../../components/Filter/Filter";
import { testPromoters } from "../test/data";
import { promotersRef } from "../../firebase/firebaseRefs";
import OrderBy from "../../components/OrderBy/OrderBy";
import { filterContext, orderByContext } from "../../Contexts/AllContexts";
import { useScrollDirection } from "../../Hooks/useScrollDirection";

const Promoters: NextPage = () => {
    const { filters, setFilters } = useContext(filterContext);
    const { order, setOrder } = useContext(orderByContext);
    const [promoters, setPromoters] = useState<IPromoterItem[]>(testPromoters);
    const { scrollPosition } = useScrollDirection();

    useEffect(() => {
        const unsubscribe = onSnapshot(query(promotersRef), (querySnapshot) => {
            const promoters = querySnapshot.docs.map((doc) => {
                return { docId: doc.id, promoter: doc.data() };
            }) as IPromoterItem[];

            setPromoters(promoters);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (orderPromoters(order, filterList()).length === 0) {
            setFilters([]);
        }
    }, [promoters]);

    const getAvailableFilters = () => {
        const available: string[] = [];
        const filters = [
            "reviewed",
            "interested",
            "contacted",
            "replied",
            "comments",
            "about",
        ];

        filters.forEach((filter) => {
            const matching = promoters.filter((promoter) => {
                return promoter.promoter[filter];
            });
            if (matching.length > 0) {
                available.push(filter);
            }
        });

        return available;
    };

    const filterList = (): IPromoterItem[] => {
        if (filters?.length === 0) {
            return promoters;
        }
        return promoters.filter((promoter: IPromoterItem) => {
            if (promoter.promoter.reviewed && filters.includes("reviewed"))
                return true;
            if (promoter.promoter.interested && filters.includes("interested"))
                return true;
            if (promoter.promoter.contacted && filters.includes("contacted"))
                return true;
            if (promoter.promoter.replied && filters.includes("replied"))
                return true;
            if (promoter.promoter.comments && filters.includes("comments"))
                return true;
            if (
                promoter.promoter.about &&
                promoter.promoter.about !== "none" &&
                filters.includes("about")
            )
                return true;

            return false;
        });
    };

    const orderPromoters = function (
        order: IOrderBy,
        promotersList: IPromoterItem[]
    ): IPromoterItem[] {
        return promotersList.sort(function (a, b) {
            if (order.ascending) {
                if (a.promoter[order.orderBy] < b.promoter[order.orderBy]) {
                    return -1;
                } else if (a[order.orderBy] > b[order.orderBy]) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (a.promoter[order.orderBy] > b.promoter[order.orderBy]) {
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
                {promoters.length > 0 && getAvailableFilters().length > 0 && (
                    <div className={styles.sortAndOrderContainer}>
                        <Filter availableFilters={getAvailableFilters()} />
                        <OrderBy />
                    </div>
                )}

                <div className={styles.eventsLabel}>
                    {filterList()?.length} promoters
                </div>
                {orderPromoters(order, filterList())?.map((promoter) => (
                    <div
                        key={promoter.promoter.name}
                        className={styles.listItem}
                    >
                        <PromoterItem promoter={promoter} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Promoters;
