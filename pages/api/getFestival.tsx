// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

interface Data {
    venue: {
        name: string;
        url: string;
        address: string;
    };
    date: string;
    attending: string;
    promoter: {
        name: string;
        url: string;
    };
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const raUrl = req.query.raUrl;

    console.log(`Getting festivals from ${raUrl}`);

    const start = async (url: string) => {
        const browser = await puppeteer.launch({
            headless: "chrome",
        });
        const page = await browser.newPage();
        await page.goto(url);

        const title = await page.$eval(
            "nav[aria-label='Breadcrumb']",
            (item) => {
                return item.parentElement?.parentElement?.querySelector(
                    "div:nth-child(2)"
                )?.textContent;
            }
        );

        const eventDetailBarElement = await page.$eval(
            "div[data-tracking-id='event-detail-bar']",
            (item) => {
                const venue = item.querySelector(
                    "div ul li:nth-child(1) div a"
                );
                const venueName = venue?.textContent;
                const venueUrl = venue?.href;

                const venueAddress = item.querySelector(
                    "div ul li:nth-child(1) div ul"
                )?.textContent;

                const date = item.querySelector(
                    "div ul li:nth-child(2) div div:nth-child(2) a"
                )?.textContent;
                const attending = item.querySelector(
                    "div ul li:nth-child(4) div ul li:nth-child(1) "
                )?.textContent as unknown as number;

                const promoterName = item.querySelector(
                    "div ul li:nth-child(3) div div:nth-child(2) a"
                )?.textContent;

                const promoterUrl = item.querySelector(
                    "div ul li:nth-child(3) div div:nth-child(2) a"
                )?.href;

                return {
                    venue: {
                        name: venueName,
                        url: venueUrl,
                        address: venueAddress,
                    },
                    date,
                    attending: attending,
                    promoter: {
                        name: promoterName,
                        url: promoterUrl,
                    },
                };
            }
        );

        const lineup = await page.$eval(
            "div[data-tracking-id='event-detail-lineup']",
            (item) => {
                const artists = Array.from(item.querySelectorAll("span a"));
                return artists.map((artist) => {
                    return artist.textContent;
                });
            }
        );

        const description = await page.$eval(
            "section[data-tracking-id='event-detail-description'] section div div div:nth-child(2) div",
            (item) => {
                if (item.textContent?.includes("RA PICK")) {
                    return item.nextElementSibling?.querySelector("li div span")
                        ?.textContent;
                }

                return item.querySelector("ul li div span")?.textContent;
            }
        );

        await browser.close();

        return {
            title,
            venue: eventDetailBarElement.venue,
            date: eventDetailBarElement.date,
            attending: eventDetailBarElement.attending,
            lineup: lineup,
            description,
            promoter: eventDetailBarElement.promoter,
        };
    };

    start(raUrl as string).then((data) => {
        res.status(200).json(data as Data[]);
    });
}
