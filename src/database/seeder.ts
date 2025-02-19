import Subscription from "./models/Subscription";

export const seedDatabase = async () => {
    let subscription = await Subscription.find({ isActive: true });

    if (subscription.length === 0) {
        console.log("SEEDING_STARTED...");
        await Subscription.insertMany([
            {
                title: "Gold",
                price: 20,
                renewalPeriod: "Monthly",
            },
            {
                title: "Platinum",
                price: 200,
                renewalPeriod: "Yearly",
            },
        ]);
        console.log("...SEEDING_COMPLETED");
    }
};
