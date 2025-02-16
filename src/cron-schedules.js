import cron from "node-cron"
import { Campaign } from "./models/campaign.model.js"
import { Request } from "./models/request.model.js";

// check requests and campaigns according to its validation dates

const updateDocument = async () => {
    const now = new Date();
    try {
        await Campaign.updateMany(
            { date: { $lt: now } },
            {
                isActive: false
            }
        )

        await Request.updateMany(
            { date: { $lt: now } },
            {
                isActive: false
            }
        )
    } catch (error) {

    }
}

export const scheduleCron = () => {
    cron.schedule("0 0 * * *", updateDocument);
}

