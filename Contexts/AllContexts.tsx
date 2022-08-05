import { CreateFilterContext } from "../Contexts/FilterContext";
import { CreateFestivalFilterContext } from "../Contexts/FestivalFilterContext";
import { CreateOrderByContext } from "../Contexts/OrderByContext";
import { INav, IOrderBy, IPromoterItem } from "../types";
import { CreatePromotersContext } from "../Contexts/PromotersContext";
import { CreateNavContext } from "../Contexts/NavContext";

export const { FilterContext, FilterContextProvider } = CreateFilterContext([]);
export const filterContext = FilterContext;

export const { FestivalFilterContext, FestivalFilterContextProvider } =
    CreateFestivalFilterContext([]);
export const festivalFilterContext = FestivalFilterContext;

export const { OrderByContext, OrderByContextProvider } =
    CreateOrderByContext<IOrderBy>({
        orderBy: "name",
        ascending: true,
    });
export const orderByContext = OrderByContext;

export const { PromotersContext, PromotersContextProvider } =
    CreatePromotersContext<IPromoterItem[]>([]);
export const promotersContext = PromotersContext;

export const { NavContext, NavContextProvider } = CreateNavContext<INav>([
    { navOpen: false },
]);
export const navContext = NavContext;
