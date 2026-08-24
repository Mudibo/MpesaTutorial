import {supabase} from "../config/supabase.js";
import { PAYMENT_STATUS } from "../constants/payment-status.js";


class PaymentRepository{
    async create(payment){
        const {data, error} = await supabase.from("payments").insert(payment).select().single();
        if(error){
            throw error;
        }
        return data;
    }
    async findByReference(reference){
        const {data, error} = await supabase.from("payments").select("*").eq("reference", reference).single();
        if(error){
            throw error;
        }
        return data;
    }
    async findByCheckoutRequestId(checkoutRequestId){
        const {data, error} = await supabase.from("payments").select("*").eq("checkout_request_id", checkoutRequestId).single();
        if(error){
            throw error;
        }
        return data;
    }
    async updateSTKResponse(reference, merchantRequestId, checkoutRequestId){
        const {data, error} = await supabase.from("payments").update({
            merchant_request_id: merchantRequestId,
            checkout_request_id: checkoutRequestId,
            status: PAYMENT_STATUS.WAITING_CALLBACK,
        }).eq("reference", reference).select().single();
        if(error){
            throw error;
        }
        return data;
    }
    async markSuccessfulPayment(checkoutRequestId, receiptNumber,resultCode, resultDescription){
        const {data, error} = await supabase.from("payments").update({
            status: PAYMENT_STATUS.SUCCESS,
            mpesa_receipt_number: receiptNumber,
            result_code: resultCode,
            result_description: resultDescription,
        }).eq("checkout_request_id", checkoutRequestId).select().single();
        if(error){
            throw error;
        }
        return data;
    }
    async markFailedPayment(checkoutRequestId, resultCode, resultDescription){
        const {data, error} = await supabase.from("payments").update({
            status: PAYMENT_STATUS.FAILED,
            result_code: resultCode,
            result_description: resultDescription,
        }).eq("checkout_request_id", checkoutRequestId).select().single();
        if(error){
            throw error;
        }
        return data;
    }
    async updateFromCallback(checkoutRequestId, updateData) {
        const {
            data,
            error,
        } = await supabase
            .from("payments")
            .update(updateData)
            .eq(
                "checkout_request_id",
                checkoutRequestId
            )
            .select()
            .single();
        if (error) {
            throw error;
        }
        return data;
    }
}

export default new PaymentRepository();