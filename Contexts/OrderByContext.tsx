import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useState,
} from "react";

export function CreateOrderByContext<A>(defaultValue: A) {
    type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
    const defaultUpdate: UpdateType = () => defaultValue;
    const OrderByContext = createContext({
        order: defaultValue,
        setOrder: defaultUpdate,
    });

    function OrderByContextProvider(props: PropsWithChildren<{}>) {
        const [order, setOrder] = useState(defaultValue);
        return (
            <OrderByContext.Provider value={{ order, setOrder }} {...props} />
        );
    }
    return { OrderByContext, OrderByContextProvider } as const;
}
