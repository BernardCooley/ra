export interface IEventItem {
    docId: string;
    event: {
        title: string;
        href: string;
        promoter: string;
        lineup: string;
    };
}

export interface ILink {
    name: string | null;
    url: string;
}

export interface IPromoterItem {
    docId: string;
    promoter: {
        name: string;
        links: ILink[];
        events: number;
        region: string;
        raUrl: string;
        comments?: string;
        interested?: boolean;
        reviewed?: boolean;
        contacted?: boolean;
        replied?: boolean;
        about?: string;
        followers?: number;
    };
}

export interface IFestivalItem {
    docId: string;
    festival: {
        attending: string;
        date: string;
        description: string;
        lineup: string[];
        promoter: {
            name: string;
            url: string;
        };
        title: string;
        url: string;
        venue: {
            address?: string;
            name?: string;
            url?: string;
        };
        comments?: string;
        interested?: boolean;
        reviewed?: boolean;
    };
}

export interface IOrderBy {
    orderBy: string;
    ascending: boolean;
}

export interface IEvent {
    url: string;
}
