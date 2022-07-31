import type { NextPage } from "next";
import styles from "./styles.module.scss";
import { useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/clientApp";
import { IPromoterItem } from "../../types";
import Header from "../../components/Header/Header";
import PromoterItem from "../../components/PromoterItem/PromoterItem";
import { promoters } from "./data";

const Promoters: NextPage = () => {
    return (
        <div className={`${styles.container} pageContainer`}>
            <Header />
            <div className={styles.eventsLabel}>
                {promoters?.length} promoters
            </div>
            {promoters?.map((promoter) => (
                <div key={promoter.name} className={styles.listItem}>
                    <PromoterItem promoter={promoter} />
                </div>
            ))}
        </div>
    );
};

export default Promoters;
