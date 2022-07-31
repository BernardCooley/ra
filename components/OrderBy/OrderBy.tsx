import React, { useContext } from "react";
import styles from "./styles.module.scss";
import { capitalizeFirstLetter } from "../../utils";
import ChevronDown from "../../public/assets/icons/chevron-down.svg";
import ChevronUp from "../../public/assets/icons/chevron-up.svg";
import Image from "next/image";
import { orderByContext } from "../../Contexts/AllContexts";

interface Props {}

const OrderBy = ({}: Props) => {
    const { order, setOrder } = useContext(orderByContext);
    const orderByFields = ["name", "location", "events", "followers"];

    const onOrderClick = (field: string) => {
        setOrder({
            orderBy: field,
            ascending: order.orderBy === field ? !order.ascending : true,
        });
    };

    return (
        <div className={styles.orderBycontainer}>
            <div className="orderFilterTitle">Order by</div>
            <ul className={styles.list}>
                {orderByFields.map((field) => (
                    <div className={styles.listItemContainer} key={field}>
                        {order.orderBy === field && !order.ascending && (
                            <div
                                className={`${styles.sortArrowDown} ${
                                    order.ascending ? styles.ascending : ""
                                }`}
                            >
                                <Image
                                    width={30}
                                    height={30}
                                    src={ChevronDown}
                                    alt=""
                                    color="white"
                                />
                            </div>
                        )}
                        <li onClick={() => onOrderClick(field)}>
                            <div
                                className={`${styles.fieldLabel} ${
                                    field === order.orderBy
                                        ? styles.selected
                                        : ""
                                }`}
                            >
                                {capitalizeFirstLetter(field)}
                            </div>
                        </li>
                        {order.orderBy === field && order.ascending && (
                            <div
                                className={`${styles.sortArrowUp} ${
                                    order.ascending ? styles.ascending : ""
                                }`}
                            >
                                <Image
                                    width={30}
                                    height={30}
                                    src={ChevronUp}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default OrderBy;
