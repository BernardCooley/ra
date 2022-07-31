import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useEffect,
    useState,
} from "react";

export function CreatePromotersContext<A>(defaultValue: A) {
    type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
    const defaultUpdate: UpdateType = () => defaultValue;
    const PromotersContext = createContext({
        promoters: defaultValue,
        setPromoters: defaultUpdate,
    });

    function PromotersContextProvider(props: PropsWithChildren<{}>) {
        const [promoters, setPromoters] = useState(defaultValue);

        return (
            <PromotersContext.Provider
                value={{ promoters, setPromoters }}
                {...props}
            />
        );
    }
    return { PromotersContext, PromotersContextProvider } as const;
}
