import "../styles/globals.scss";
import type { AppProps } from "next/app";
import {
    FilterContextProvider,
    OrderByContextProvider,
    PromotersContextProvider,
    FestivalFilterContextProvider,
    NavContextProvider,
} from "../Contexts/AllContexts";
import BackToTop from "../components/BackToTop/BackToTop";
import { useScrollDirection } from "../Hooks/useScrollDirection";

function MyApp({ Component, pageProps }: AppProps) {
    const { scrollPosition } = useScrollDirection();

    return (
        <>
            <BackToTop hide={scrollPosition < 50} />
            <NavContextProvider>
                <FestivalFilterContextProvider>
                    <PromotersContextProvider>
                        <FilterContextProvider>
                            <OrderByContextProvider>
                                <Component {...pageProps} />
                            </OrderByContextProvider>
                        </FilterContextProvider>
                    </PromotersContextProvider>
                </FestivalFilterContextProvider>
            </NavContextProvider>
        </>
    );
}

export default MyApp;
