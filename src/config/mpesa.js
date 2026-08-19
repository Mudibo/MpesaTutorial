import { config } from "./env.js";

export const mpesaConfig = {
    sandboxBaseUrl: "https://sandbox.safaricom.co.ke",

    productionBaseUrl: "https://api.safaricom.co.ke",

    consumerKey: config.mpesa.consumerKey,

    consumerSecret: config.mpesa.consumerSecret,

    shortcode: config.mpesa.shortcode,

    passkey: config.mpesa.passkey,

    callbackUrl: config.mpesa.callbackUrl,
};