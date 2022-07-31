// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { removeDuplicates } from "../../utils";
import { IEvent, ILink } from "../../types";

interface Data {
    name: string;
    region: string;
    links: ILink[];
    events: number;
    raUrl: string;
}

const getSingleElementText = async (page: puppeteer.Page, selector: string) => {
    return await page.$eval(selector, (item) => item.textContent);
};

const getSingleElementUrl = async (page: puppeteer.Page, selector: string) => {
    return await page.$eval(selector, (item) => item.href);
};

export const getAbout = async (page: puppeteer.Page, selector: string) => {
    return await page.$$eval(selector, (items) => {
        let elementsText: string | null | undefined = "";
        items.forEach((item) => {
            if (item.textContent === "About")
                elementsText = item
                    .closest("section")
                    ?.querySelector("ul")?.textContent;
        });
        return elementsText;
    });
};

export const getFollowers = async (page: puppeteer.Page, selector: string) => {
    return await page.$$eval(selector, (items) => {
        let followers: string | null | undefined = "";
        items.forEach((item) => {
            if (item.textContent === "Followers")
                followers = item
                    .closest("li")
                    ?.querySelector("div:nth-child(2)")?.textContent;
        });
        return followers as unknown as number;
    });
};

const getLinks = async (
    page: puppeteer.Page,
    selector: string
): Promise<ILink[]> => {
    return await page.$$eval(selector, (items) => {
        return items.map((item) => {
            return {
                name: item.textContent,
                url: item.href,
            };
        });
    });
};

const getEvents = async (
    page: puppeteer.Page,
    eventSelector: string,
    urlSelector: string
): Promise<IEvent[]> => {
    return await page.$$eval(eventSelector, (items) => {
        return items.map((item) => {
            return {
                url: item.querySelector("li:nth-child(2) div h3 a")?.href,
            };
        });
    });
};

const combineEvents = (
    pastEvents: IEvent[],
    futureEvents: IEvent[]
): IEvent[] => {
    const allEvents = [...futureEvents, ...pastEvents];

    const filteredEvents = allEvents.filter((event) => {
        if (event.url) {
            return event;
        }
    });

    return removeDuplicates(filteredEvents, "url");
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const raUrl = req.query.raUrl;

    const start = async (url: string) => {
        const promoterSelector =
            '[data-tracking-id="event-detail-bar"] div ul li:nth-child(3) div div:nth-child(2) a';
        const linksSelector = `[data-tracking-id="promoter-detail-bar"] div ul :nth-child(2) :nth-child(2) a`;
        const regionSelector = `a[href*="guide"]`;
        const futureEventsSelector = `span[href*="events"]`;
        const pastEventsSelector = `span[href*="past-events"]`;
        const eventSelector = 'ul[data-test-id="non-ticketed-event"]';
        const eventLinkSelector = "li:nth-child(2) div h3 a";

        const browser = await puppeteer.launch({
            headless: "chrome",
        });
        const page = await browser.newPage();
        await page.goto(url);

        console.log(`getting from ${url}`);

        if (await page.$(promoterSelector)) {
            try {
                const name = await getSingleElementText(page, promoterSelector);
                const raUrl = await getSingleElementUrl(page, promoterSelector);

                await page.focus(promoterSelector);
                await page.keyboard.type("\n");

                await page.waitForSelector(linksSelector);

                const region = await getSingleElementText(page, regionSelector);
                const links = await getLinks(page, linksSelector);

                // Click on Upcoming events
                await page.focus(futureEventsSelector);
                await page.keyboard.type("\n");

                // Get future events
                const futureEvents = await getEvents(
                    page,
                    eventSelector,
                    eventLinkSelector
                );

                // Click on Past events
                await page.focus(pastEventsSelector);
                await page.keyboard.type("\n");

                // Get past events
                const pastEvents = await getEvents(
                    page,
                    eventSelector,
                    eventLinkSelector
                );

                const allEvents = combineEvents(futureEvents, pastEvents);

                const about = getAbout(page, "h2");

                await browser.close();

                return {
                    name,
                    region,
                    links,
                    events: allEvents.length,
                    raUrl,
                    about,
                };
            } catch (e) {
                await browser.close();
                return null;
            }
        }
        await browser.close();

        return null;
    };

    start(raUrl as string).then((data) => {
        res.status(200).json(data as Data[]);
    });
}
