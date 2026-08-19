import axios from "axios";
import { Buffer } from "node:buffer";
import { redisClient } from "../config/redis.js";
import { mpesaConfig } from "../config/mpesa.js";

const TOKEN_KEY = "mpesa_access_token";

// Prevents multiple simultaneous token requests
let tokenPromise = null;

/**
 * Creates the HTTP Basic Authentication header
 * required by the Daraja OAuth endpoint.
 */
function createBasicAuthHeader() {
    const credentials = `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`;

    const encodedCredentials = Buffer
        .from(credentials)
        .toString("base64");

    return `Basic ${encodedCredentials}`;
}

/**
 * Requests a new OAuth token from Safaricom
 * and stores it in Redis.
 */
async function fetchNewToken() {

    const response = await axios.get(
        `${mpesaConfig.sandboxBaseUrl}/oauth/v1/generate`,
        {
            params: {
                grant_type: "client_credentials",
            },
            headers: {
                Authorization: createBasicAuthHeader(),
            },
            timeout: 10000,
        }
    );

    const { access_token, expires_in } = response.data;

    // Store token with a 60-second safety buffer
    await redisClient.set(
        TOKEN_KEY,
        access_token,
        {
            EX: Number(expires_in) - 60,
        }
    );

    return access_token;
}

/**
 * Returns a valid OAuth access token.
 *
 * Flow:
 * 1. Check Redis.
 * 2. If found, return cached token.
 * 3. Otherwise request a new token.
 */
export async function getAccessToken() {

    try {

        // Check Redis first
        const cachedToken = await redisClient.get(TOKEN_KEY);

        if (cachedToken) {
            return cachedToken;
        }

        // Prevent multiple simultaneous refreshes
        if (!tokenPromise) {

            tokenPromise = fetchNewToken()
                .finally(() => {
                    tokenPromise = null;
                });

        }

        return await tokenPromise;

    } catch (error) {

        if (axios.isAxiosError(error)) {

            throw new Error(
                `Failed to obtain OAuth token: ${
                    error.response?.data?.errorMessage ||
                    error.response?.statusText ||
                    error.message
                }`
            );

        }

        throw error;
    }

}