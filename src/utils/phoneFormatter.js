/**
 * Converts a Kenyan phone number
 * into the format expected by Daraja.
 *
 * Example:
 * 0712345678 -> 254712345678
 */

export function formatPhoneNumber(phone) {

    if (!phone) {
        throw new Error("Phone number is required.");
    }

    // Convert to string
    phone = String(phone);

    // Remove spaces
    phone = phone.replace(/\s+/g, "");

    // Remove hyphens
    phone = phone.replace(/-/g, "");

    // Remove opening bracket
    phone = phone.replace(/\(/g, "");

    // Remove closing bracket
    phone = phone.replace(/\)/g, "");

    // Remove leading +
    if (phone.startsWith("+")) {
        phone = phone.substring(1);
    }

    if (phone.startsWith("0")) {
        phone = "254" + phone.substring(1);
    }

    else if (phone.startsWith("7") || phone.startsWith("1")) {
        phone = "254" + phone;
    }

    if (!/^254(7|1)\d{8}$/.test(phone)) {
        throw new Error("Invalid Kenyan phone number.");
    }

    return phone;
}