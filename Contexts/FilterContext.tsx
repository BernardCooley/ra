import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useState,
} from "react";

export function CreateFilterContext<A>(defaultValue: A) {
    type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
    const defaultUpdate: UpdateType = () => defaultValue;
    const FilterContext = createContext({
        filters: defaultValue,
        setFilters: defaultUpdate,
    });

    function FilterContextProvider(props: PropsWithChildren<{}>) {
        const [filters, setFilters] = useState(defaultValue);

        return (
            <FilterContext.Provider
                value={{ filters, setFilters }}
                {...props}
            />
        );
    }
    return { FilterContext, FilterContextProvider } as const;
}
