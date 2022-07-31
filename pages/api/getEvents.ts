// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

interface Data {
    title: string;
    href: string;
    lineup: string;
}

interface IDetail {
    name: string;
    selector: string;
    retrieve: string;
}

interface IEventQueryParams {
    attributeName: string;
    attributeValue: string;
    baseSelector: string;
    baseDetailsSelector: string;
    details: IDetail[];
}

const eventQueryParams = {
    attributeName: "data-tracking-id",
    attributeValue: "events-all",
    baseSelector: "ul li div div",
    baseDetailsSelector: "ul :nth-child(2) div",
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const raUrl = req.query.raUrl;

    const start = async (url: string, queryParams: IEventQueryParams) => {
        const { attributeName, attributeValue, baseSelector } = queryParams;

        const browser = await puppeteer.launch({
            headless: "chrome",
        });
        const page = await browser.newPage();
        await page.goto(url);

        // Get all events on page
        const events = await page.$$eval(
            `[${attributeName}='${attributeValue}'] ${baseSelector}`,
            (events) => {
                return events.map((event) => {
                    const eventDetails = {
                        title: event.querySelector("ul :nth-child(2) div h3")
                            ?.textContent,
                        href: event.querySelector("ul :nth-child(2) div h3 a")
                            ?.href,
                        lineup: event.querySelector("ul :nth-child(2) div div")
                            ?.textContent,
                    };

                    return eventDetails;
                });
            }
        );

        const purgeData = () => {
            // Remove events that dont have a href
            const filteredEvents = events.filter((event) => {
                if (event.href) {
                    return event;
                }
            });

            const uniqueEvents: any = [];

            // Remove duplicates
            filteredEvents.forEach((f, i) => {
                if (
                    JSON.stringify(f.href) !==
                    JSON.stringify(filteredEvents[i - 1]?.href)
                ) {
                    uniqueEvents.push(f);
                }
            });

            return uniqueEvents;
        };

        await browser.close();

        return purgeData();
    };

    start(raUrl as string, eventQueryParams as IEventQueryParams).then(
        (data) => {
            res.status(200).json(data);
        }
    );
}
