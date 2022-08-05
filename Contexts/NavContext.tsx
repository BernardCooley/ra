import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useState,
} from "react";

export function CreateNavContext<A>(defaultValue: A) {
    type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
    const defaultUpdate: UpdateType = () => defaultValue;
    const NavContext = createContext({
        nav: defaultValue,
        setNav: defaultUpdate,
    });

    function NavContextProvider(props: PropsWithChildren<{}>) {
        const [nav, setNav] = useState(defaultValue);

        return <NavContext.Provider value={{ nav, setNav }} {...props} />;
    }
    return { NavContext, NavContextProvider } as const;
}
