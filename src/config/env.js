export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    mpesa: {
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        shortcode: process.env.BUSINESS_SHORTCODE,
        passkey: process.env.PASSKEY,
        callbackUrl: process.env.CALLBACK_URL,
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    redis: {
        url: process.env.REDIS_URL,
    },
};