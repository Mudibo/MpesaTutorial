import * as stkPushService from "../services/stkPush.service.js";
import * as callbackService from "../services/paymentCallback.service.js";
class PaymentController {
    async initiateSTKPush(req, res, next) {
        try {
            const {
                phone,
                amount,
                description,
            } = req.body;
            const idempotencyKey =
                req.header("Idempotency-Key");
            const payment =
                await stkPushService
                    .initiateSTKPush({
                        phone,
                        amount,
                        description,
                        idempotencyKey,
                    });
            return res.status(200).json(payment);
        }
        catch (error) {
            next(error);
        }
    }
    async handleCallback(req, res, next) {
        try {
            await callbackService.processCallback(
                req.body
            );
            return res.status(200).json({
                ResultCode: 0,
                ResultDesc: "Accepted"
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export default new PaymentController();