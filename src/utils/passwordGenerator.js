import { Buffer } from "node:buffer";
import { mpesaConfig } from "../config/mpesa.js";

/**
 * Generates the STK Push password.
 */

export function generatePassword(timestamp) {

    const password =
        mpesaConfig.shortcode +
        mpesaConfig.passkey +
        timestamp;

    return Buffer
        .from(password)
        .toString("base64");

}