// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

interface Data {
    festivalUrls: {
        url: string;
        title: string;
    }[];
}

const getAllFestivalUrlsAndTitles = async (
    page: puppeteer.Page,
    selector: string
) => {
    return await page.$$eval(selector, (items) => {
        return items.map((item) => {
            return {
                url: item.href,
                title: item.textContent,
            };
        });
    });
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data[]>
) {
    const raUrl = req.query.raUrl;

    console.log(`Getting festivals from ${raUrl}`);

    const start = async (url: string) => {
        const festivalEventsSelector = `a[data-test-id="event-listing-heading"]`;

        const browser = await puppeteer.launch({
            headless: "chrome",
        });
        const page = await browser.newPage();
        await page.goto(url);

        if (await page.$(festivalEventsSelector)) {
            return await getAllFestivalUrlsAndTitles(
                page,
                festivalEventsSelector
            );
        }

        await browser.close();
    };

    start(raUrl as string).then((data) => {
        res.status(200).json(data as Data[]);
    });
}
