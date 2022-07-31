import "../styles/globals.scss";
import type { AppProps } from "next/app";
import {
    FilterContextProvider,
    OrderByContextProvider,
    PromotersContextProvider,
    FestivalFilterContextProvider,
} from "../Contexts/AllContexts";
import BackToTop from "../components/BackToTop/BackToTop";
import { useScrollDirection } from "../Hooks/useScrollDirection";

function MyApp({ Component, pageProps }: AppProps) {
    const { scrollPosition } = useScrollDirection();

    return (
        <>
            <BackToTop hide={scrollPosition < 50} />
            <FestivalFilterContextProvider>
                <PromotersContextProvider>
                    <FilterContextProvider>
                        <OrderByContextProvider>
                            <Component {...pageProps} />
                        </OrderByContextProvider>
                    </FilterContextProvider>
                </PromotersContextProvider>
            </FestivalFilterContextProvider>
        </>
    );
}

export default MyApp;
