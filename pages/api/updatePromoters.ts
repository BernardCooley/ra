// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";
import { getFollowers } from "./getPromoters";

interface IResponseData {
    [x: string]: number;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<IResponseData[]>
) {
    const raUrl = req.query.raUrl;

    const start = async (url: string) => {
        const browser = await puppeteer.launch({
            headless: "chrome",
        });
        const page = await browser.newPage();
        await page.goto(url);

        try {
            return getFollowers(page, "span");
        } catch (e) {
            console.log(e);
            await browser.close();
            return null;
        }
    };

    start(raUrl as string).then((data) => {
        res.status(200).json(data as unknown as IResponseData[]);
    });
}
