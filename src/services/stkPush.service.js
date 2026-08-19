import axios from "axios";

import { mpesaConfig } from "../config/mpesa.js";
import { getAccessToken } from "./oauth.service.js";
import { formatPhoneNumber } from "../utils/phoneFormatter.js";
import { generateTimestamp } from "../utils/timestamp.js";
import { generatePassword } from "../utils/passwordGenerator.js";

export async function initiateSTKPush({
    phone,
    amount,
    accountReference,
    description,
}) {
    const formattedPhone =
        formatPhoneNumber(phone);
    const timestamp =
        generateTimestamp();
    const password =
        generatePassword(timestamp);
    const accessToken =
        await getAccessToken();
    const payload = {
        BusinessShortCode:
            mpesaConfig.shortcode,
        Password:
            password,
        Timestamp:
            timestamp,
        TransactionType:
            "CustomerPayBillOnline",
        Amount:
            amount,
        PartyA:
            formattedPhone,
        PartyB:
            mpesaConfig.shortcode,
        PhoneNumber:
            formattedPhone,
        CallBackURL:
            mpesaConfig.callbackUrl,
        AccountReference:
            accountReference,
        TransactionDesc:
            description,
    };
    const response =
        await axios.post(
            `${mpesaConfig.sandboxBaseUrl}/mpesa/stkpush/v1/processrequest`,
            payload,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`,
                    "Content-Type":
                        "application/json",
                },
                timeout: 15000,
            }
        );
    return response.data;
}