import axios from "axios";
import {mpesaConfig} from "../config/mpesa.js";

// Create an Axios instance for interacting with the Daraja API
export const darajaClient = axios.create({
    baseURL: mpesaConfig.sandboxUrl,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});