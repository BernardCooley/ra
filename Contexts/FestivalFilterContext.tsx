import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useState,
} from "react";

export function CreateFestivalFilterContext<A>(defaultValue: A) {
    type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
    const defaultUpdate: UpdateType = () => defaultValue;
    const FestivalFilterContext = createContext({
        festivalFilters: defaultValue,
        setFestivalFilters: defaultUpdate,
    });

    function FestivalFilterContextProvider(props: PropsWithChildren<{}>) {
        const [festivalFilters, setFestivalFilters] = useState(defaultValue);

        return (
            <FestivalFilterContext.Provider
                value={{ festivalFilters, setFestivalFilters }}
                {...props}
            />
        );
    }
    return { FestivalFilterContext, FestivalFilterContextProvider } as const;
}
