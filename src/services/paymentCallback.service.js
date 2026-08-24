import paymentRepository from "../repositories/payment.repository.js";
import { parseCallbackMetadata } from "../utils/parseCallbackMetadata.js";
export async function processCallback(
    payload
) {
    const callback =
        payload.Body.stkCallback;
    const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata,
    } = callback;
const metadata = parseCallbackMetadata(
    CallbackMetadata
);
const {
    Amount,
    MpesaReceiptNumber,
    TransactionDate,
    PhoneNumber,
} = metadata;
    const success =
        ResultCode === 0;
if (success) {
    await paymentRepository.updateFromCallback(
        CheckoutRequestID,
        {
            status: "SUCCESS",
            mpesa_receipt_number:
                MpesaReceiptNumber,
            transaction_date:
                TransactionDate,
        }
    );
    } else {
            await paymentRepository.updateFromCallback(
                CheckoutRequestID,
            {
            status: "FAILED",
            }
        );
    }
}