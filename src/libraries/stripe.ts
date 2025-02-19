import Stripe from "stripe";
import { serverENV } from "../env-config";

const stripe = new Stripe(serverENV.STRIPE_SECRET_KEY);

export const generatePaymentIntent = async (
    amount: number,
    currency: string,
    options?: any
) => {
    return await stripe.paymentIntents.create({
        amount,
        currency,
        ...options,
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

export const getPaymentIntentStatus = async (intentId: string) =>
    await stripe.paymentIntents.retrieve(intentId);

export const getStatusMessage = (status: string) => {
    switch (status) {
        case "requires_payment_method":
            return "Waiting for payment details...";
        case "requires_confirmation":
            return "Confirming payment...";
        case "requires_action":
            return "Action needed (3D Secure, etc.)...";
        case "processing":
            return "Processing payment...";
        case "requires_capture":
            return "Payment authorized, awaiting capture...";
        case "canceled":
            return "Payment was canceled.";
        case "succeeded":
            return "Payment successful!";
        default:
            return "Unknown payment status.";
    }
};
