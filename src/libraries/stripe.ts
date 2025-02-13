import Stripe from "stripe";
import { serverENV } from "../env-config";

const stripe = new Stripe(serverENV.STRIPE_SECRET_KEY);

export const generatePaymentIntent = async ({
    amount,
    currency,
}: {
    amount: number;
    currency: string;
}) => {
    return await stripe.paymentIntents.create({
        amount,
        currency,
    });
};

export const createProviderExpressAccount = async (email: string) =>
    await stripe.accounts.create({
        type: "express", // Can be 'standard', 'express', or 'custom'
        country: "US",
        email,
    });

export const getAccountLink = async (accountId: string) =>
    await stripe.accountLinks.create({
        account: accountId, // Connected account ID
        refresh_url: `${serverENV.domain}/reauth`,
        return_url: `${serverENV.domain}/success`,
        type: "account_onboarding",
    });
