import { darajaClient } from "../lib/darajaClient.js";
import { mpesaConfig } from "../config/mpesa.js";
import { redisClient } from "../config/redis.js";
import paymentRepository from "../repositories/payment.repository.js";
import { getAccessToken } from "./oauth.service.js";
import { formatPhoneNumber } from "../utils/phoneFormatter.js";
import { generateTimestamp } from "../utils/timestamp.js";
import { generatePassword } from "../utils/passwordGenerator.js";
import { generatePaymentReference } from "../utils/paymentReference.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";
/**
 * Initiates an STK Push request.
 *
 * @param {Object} payment
 * @param {string} payment.phone
 * @param {number} payment.amount
 * @param {string} payment.description
 *
 * @returns {Promise<Object>}
 */
export async function initiateSTKPush({
    phone,
    amount,
    description,
}) {
    // --------------------------------------------------
    // Format Phone Number
    // --------------------------------------------------
    const formattedPhone =
        formatPhoneNumber(phone);
    // --------------------------------------------------
    // Generate Internal Payment Reference
    // --------------------------------------------------
    const paymentReference =
        generatePaymentReference();
    // --------------------------------------------------
    // Save Payment Before Contacting Safaricom
    // --------------------------------------------------
    await paymentRepository.create({
        reference: paymentReference,
        phone: formattedPhone,
        amount,
        description,
        status: PAYMENT_STATUS.PENDING,
    });
    // --------------------------------------------------
    // Prevent Duplicate Processing
    // --------------------------------------------------
    const lockKey =
        `payment:${paymentReference}`;
    const acquired =
        await redisClient.set(
            lockKey,
            "locked",
            {
                NX: true,
                EX: 60,
            }
        );
    if (!acquired) {
        throw new Error(
            "Duplicate payment detected."
        );
    }
    try {
        // ----------------------------------------------
        // Generate Authentication
        // ----------------------------------------------
        const timestamp =
            generateTimestamp();
        const password =
            generatePassword(timestamp);
        const accessToken =
            await getAccessToken();
        // ----------------------------------------------
        // Prepare STK Payload
        // ----------------------------------------------
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
                paymentReference,
            TransactionDesc:
                description,
        };
        // ----------------------------------------------
        // Send Request
        // ----------------------------------------------
        const response =
            await darajaClient.post(
                "/mpesa/stkpush/v1/processrequest",
                payload,
                {

                 headers: {
                        Authorization:
                           `Bearer ${accessToken}`,
                    },
                }
            );
        // ----------------------------------------------
        // Save Safaricom Response
        // ----------------------------------------------
        await paymentRepository.updateSTKResponse(
            paymentReference,
            response.data.MerchantRequestID,
            response.data.CheckoutRequestID
        );
        // ----------------------------------------------
        // Return Response
        // ----------------------------------------------
        return {
            paymentReference,
            ...response.data,
        };
    }
    catch (error) {
        // ----------------------------------------------
        // Mark Payment Failed
        // ----------------------------------------------
        await paymentRepository.updateStatus(
            paymentReference,
            PAYMENT_STATUS.FAILED
        );
        throw error;
    }
    finally {
        // ----------------------------------------------
        // Always Release Lock
        // ----------------------------------------------
        await redisClient.del(lockKey);
    }
}